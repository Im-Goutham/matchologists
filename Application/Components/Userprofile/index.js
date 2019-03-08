/**
 * Userprofile page
 * Author :abhishekkalia
 */
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    StatusBar,
    Text,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    View,
    Image,
} from 'react-native';
import { connect } from 'react-redux'
import Swiper from 'react-native-swiper';
import I18n from 'react-native-i18n';
import backbutton from '../../images/icons/backbutton_gradient.png'
import backbuttonwhite from '../../images/icons/backbutton.png'
import PopupMenu from './options'
import Loader from '../Loading/Loader'
import MutualFriends from './mutualfriend'
import ApiManager from "../Common/ApiManager";
import moreoptions from '../../images/icons/moreoptions.png';
import playIcon from '../../images/icons/playIcon.png';
import pauseIcon from '../../images/icons/pauseIcon.png';
import metrics from '../../config/metrics';
import Geocoder from 'react-native-geocoder';
import Video from 'react-native-video';
import Modal from 'react-native-modal';
import ApiRequest from '../Common/Apirequest';
import BaseFormComponent from '../Common/BaseFormComponent'
import * as global from '../../../global.json'
Geocoder.fallbackToGoogle('AIzaSyCtUjtU1-n7mQ-V-iFQanx3hL_082lBSXs')

const IS_ANDROID = Platform.OS === 'android'
const { width, height } = Dimensions.get('window')

class UserProfile extends BaseFormComponent {
    constructor(props) {
        super(props)
        this.state = {
            datastores: {},
            traits: [],
            location: '',
            imgList: [],
            loadQueue: [0, 0, 0, 0],
            isvideoPlay: false,
            paused: false,
            currentTime: 0.0,
            videoUrl: '',
            isShowingVideoControl: true
        }
        this.loadHandle = this.loadHandle.bind(this)
    }
    async componentDidMount() {
        await this.getUserProfile()
    }
    getUserProfile = async () => {
        const { state } = this.props.navigation;
        var token = this.props.token;
        var userId = state.params.userId
        let header = {
            'Authorization': this.props.token,
            'Content-Type': 'application/json'
        }
        let data = {
            "uid": state.params.userId
        }
        await ApiManager.callwebservice('POST', 'api/getUserProfile', header, data, (success) => {
            let response = JSON.parse(success._bodyInit);
            let cordinates = {};

            if (response.status === 0) {
                return
            } else if (response.status === 1) {
                // visit user profile api call
                ApiRequest.visitProfile(token, userId)
                // end
                console.log("response", response.data)
                let galaryData = response.data.gallery
                galaryData.sort(function (a, b) {
                    return a.order - b.order
                })
                cordinates.lat = response.data.location.coordinates[1];
                cordinates.lng = response.data.location.coordinates[0];
                var data_arr = [];
                for (var i = 0; i < galaryData.length; i++) {
                    var arr = {};
                    arr.order = galaryData[i].order;
                    arr._id = galaryData[i]._id;
                    if (galaryData[i] && galaryData[i].isVideo === true) {
                        arr.isVideo = true;
                        arr.uri = galaryData[i].thumbImage ? galaryData[i].thumbImage : '';
                        arr.url = galaryData[i].url ? galaryData[i].url: '';
                    } else {
                        arr.isVideo = false;
                        arr.uri = galaryData[i].url;
                    }
                    data_arr.push(arr)
                }
                if (!data_arr.length) {
                    data_arr.push(require('../../images/applogo.png'))
                }
                console.log("galaryData", data_arr)

                this.setState({
                    datastores: response.data,
                    imgList: data_arr
                }, () => this.setLocation(cordinates))
            }
        }, (error) => {
            console.log("error", error)
        })
    }
    setLocation = async (cordinates) => {
        Geocoder.geocodePosition(cordinates).then(res => { this.setState({ location: res[0].formattedAddress }) })
            .catch(err => console.log(err))
    }
    loadHandle(i) {
        let loadQueue = this.state.loadQueue
        loadQueue[i] = 1
        this.setState({
            loadQueue
        })
    }
    editPost() { }
    deletePost() { }
    cancel() { }
    getCurrentTimePercentage() {
        if (this.state.currentTime > 0) {
            return parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
        } else {
            return 0;
        }
    }
    playVideo = (remoteVideoLocation) => {
        this.setState({
            videoUrl: remoteVideoLocation,
            isvideoPlay: true
        })
    }
    basicProfile = () => {
        return this.state.datastores && this.state.datastores.basicProfile ? this.state.datastores.basicProfile.map((value, index) => {
            return <Text numberOfLines={1} style={styles.answercontains} key={index}> {value.question} : {value.answer}</Text>
        }) : null
    }
    playPauseIconControl = () => {
        this.setState({
            isShowingVideoControl: !this.state.isShowingVideoControl
        })
    }
    // getTraits = (traits) => {
    //     this.setState({ traits })
    // }
    addToFavourite = async () => {
        const { state } = this.props.navigation;
        ApiRequest.addToFavourite(this.props.token, state.params.userId, (resolve) => {
            console.log("resolve", resolve)
            this.state.datastores.isFriend = false;
            this.setState({
                datastores: this.state.datastores
            })
            this.showSimpleMessage("info", { backgroundColor: global.gradientsecondry }, '', resolve.message ? resolve.message : '')
        }, (reject) => {
            console.log("reject", reject)
            this.showSimpleMessage("", { backgroundColor: global.gradientsecondry }, '', reject.message? reject.message : '')
        })
    }
    pokeUser = async()=>{
        const { state } = this.props.navigation;
        ApiRequest.pokeUser(this.props.token, state.params.userId, (resolve) => {
            console.log("resolve", resolve)
            this.state.datastores.isFriend = false;
            this.setState({
                datastores: this.state.datastores
            })
            this.showSimpleMessage("", { backgroundColor: global.gradientsecondry }, '', resolve.message ? resolve.message : '')
        }, (reject) => {
            console.log("reject", reject)
            this.showSimpleMessage("", { backgroundColor: global.gradientsecondry }, '',reject.message? reject.message : '')
        })

    }
    sendFriendRequest= async()=>{
        const { state } = this.props.navigation;
        ApiRequest.sendFriendRequest(this.props.token, state.params.userId, (resolve) => {
            console.log("resolve", resolve)
            this.state.datastores.isFriend = false;
            this.setState({
                datastores: this.state.datastores
            })
            this.showSimpleMessage("", { backgroundColor: global.gradientsecondry }, '', resolve.message ? resolve.message : '')
        }, (reject) => {
            console.log("reject", reject)
            this.showSimpleMessage("", { backgroundColor: global.gradientsecondry }, '',reject.message? reject.message : '')
        })
    }
    render() {
        const { datastores } = this.state;
        const { language } = this.props;
        const { goBack, navigate } = this.props.navigation;
        const flexCompleted = this.getCurrentTimePercentage() * 100;
        const flexRemaining = (1 - this.getCurrentTimePercentage()) * 100;
        const { state } = this.props.navigation;
        console.log("resolve.datastores", datastores)
        return (
            <>
                <View style={{ flex: 1, backgroundColor: "#FFF" }}>
                    <StatusBar backgroundColor={Platform.OS === 'android' ? "#000" : undefined} barStyle={Platform.OS === 'android' ? "light-content" : "light-content"} />
                    <TouchableOpacity onPress={() => goBack()} style={styles.backicon}>
                        <Image source={backbutton} style={styles.button_back} resizeMethod="resize" resizeMode="contain" />
                    </TouchableOpacity>
                    <ScrollView style={styles.container} bounces={false}>
                        <View style={styles.imageSlider}>
                        {
                            this.state.imgList && this.state.imgList.length > 1 ? 
                            <Swiper
                            loadMinimal
                            loadMinimalSize={1}
                            loop={false}
                            bounces={false}
                            showsButtons={false}
                            // paginationStyle={{
                            //     bottom: 35,
                            //     colors: "#000"
                            // }}
                            dot={<View style={styles.dots} />}
                            activeDot={<View style={styles.activedots} />} >
                            {
                                this.state.imgList.map((item, i) =>
                                    <Slide
                                        loadHandle={this.loadHandle}
                                        loaded={!!this.state.loadQueue[i]}
                                        uri={item}
                                        i={i}
                                        key={i}
                                        playVideo={this.playVideo.bind(this)} />
                                )
                            }
                        </Swiper>
                            :
                             <Image source={require('../../images/applogo.png')} style={{ flex:1 ,height:null, width:null }} resizeMethod="resize" resizeMode="contain"/>
                        }
                        </View>
                        <View style={styles.detail}>
                            <View style={styles.namefield}>
                                <View style={styles.userDetailbar}>
                                    <Text style={styles.username}> {datastores.fullName}</Text>
                                    <Text style={styles.location}>  {this.state.location} </Text>
                                </View>
                                <View style={styles.moreoptions}>
                                    <PopupMenu
                                        button={moreoptions}
                                        buttonStyle={styles.popupmenu}
                                        destructiveIndex={1}
                                        options={["Cancel"]}
                                        actions={[this.editPost, this.deletePost, this.cancel]}
                                    />
                                </View>
                            </View>
                            <View style={styles.bioDetail}>
                                <Text style={styles.areainterest} numberOfLines={4}>{datastores.bio} </Text>
                            </View>
                            <View style={styles.mutualfriendsarea}>
                                <View style={styles.label}>
                                    <Text style={styles.mutualfriendsLabel}>{I18n.t('mutualfriendsLabel', { locale: language })} </Text>
                                </View>
                                <View style={{ height: 66 }}>
                                    <MutualFriends />
                                </View>
                                <View style={styles.label}>
                                    <Text style={styles.mutualfriendsLabel} >{I18n.t('basicprofileLabel', { locale: language })} </Text>
                                </View>
                                <View style={{ paddingLeft: 16 }}>
                                    {this.basicProfile()}
                                </View>
                            </View>
                            <Friendsdescription
                                userId={state.params.userId}
                                token={this.props.token}
                            />
                        </View>
                        <View style={styles.footer}>
                            {
                                datastores.isFriend ?
                                    <>
                                        <TouchableOpacity style={styles.footerButtons} onPress={() => this.addToFavourite()}>
                                            <Image
                                                source={require('../../images/icons/favourate.png')}
                                                resizeMethod="resize"
                                                resizeMode="contain"
                                                style={styles.bottomimageButton} />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.footerButtons} onPress={() => navigate('message')}>
                                            <Image
                                                source={require('../../images/icons/msg.png')}
                                                resizeMethod="resize"
                                                resizeMode="contain"
                                                style={styles.bottomimageButton} />
                                        </TouchableOpacity>
                                    </>
                                    :
                                    <>
                                        <TouchableOpacity style={styles.footerButtons} onPress={() => this.pokeUser()}>
                                            <Image
                                                source={require('../../images/icons/smily.png')}
                                                resizeMethod="resize"
                                                resizeMode="contain"
                                                style={styles.bottomimageButton} />
                                        </TouchableOpacity>
                                        <TouchableOpacity disabled={datastores.isFriendRequestPending ? false : false} style={[{ opacity: datastores.isFriendRequestPending ? 0.5 : 1 }, styles.footerButtons]} onPress={() => this.sendFriendRequest()}>
                                            <Image
                                                source={require('../../images/icons/new-user.png')}
                                                resizeMethod="resize"
                                                resizeMode="contain"
                                                style={styles.bottomimageButton} />
                                        </TouchableOpacity>
                                    </>
                            }
                        </View>
                    </ScrollView>
                </View>
                <Modal
                    backdropOpacity={0.3}
                    isVisible={this.state.isvideoPlay}
                    onSwipe={() => this.setState({ isvideoPlay: false })}
                    swipeDirection="down"
                    scrollTo={this.handleScrollTo}
                    onBackdropPress={() => this.setState({ isvideoPlay: false })}
                    onBackButtonPress={() => this.setState({ isvideoPlay: false })}
                    style={{ padding: 0, margin: 0 }}>
                    <View style={styles.mediaScreen}>
                        <TouchableOpacity onPress={() => this.setState({ isvideoPlay: false })} style={[styles.backicon]}>
                            <Image source={backbuttonwhite} style={styles.button_back} resizeMethod="resize" resizeMode="contain" />
                        </TouchableOpacity>
                        {
                            this.state.isShowingVideoControl ?
                                <TouchableOpacity onPress={() => this.setState({ paused: !this.state.paused })} style={styles.videoControl}>
                                    <Image source={this.state.paused ? playIcon : pauseIcon} style={{ width: 40, height: 40 }} resizeMethod="resize" resizeMode="contain" />
                                </TouchableOpacity>
                                : undefined
                        }
                        <Video
                            ref={(ref) => { this.video = ref }}
                            resizeMode="none"
                            /* For ExoPlayer */
                            source={{ uri: this.state.videoUrl }}
                            // source={{ uri: 'http://matchologistapi.node.indianic.com/public/upload/15511806726801551180906803.mp4' }}
                            style={{ height: "100%", width: '100%', alignSelf: "auto" }}
                            fullscreen={false}
                            rate={this.state.rate}
                            paused={this.state.paused}
                            volume={this.state.volume}
                            muted={this.state.muted}
                            // resizeMode={this.state.resizeMode}
                            onLoad={this.onLoad}
                            onProgress={this.onProgress}
                            onEnd={this.onEnd}
                            onAudioBecomingNoisy={this.onAudioBecomingNoisy}
                            onAudioFocusChanged={this.onAudioFocusChanged}
                            repeat={false}
                        // posterResizeMode={"center"}
                        />
                        <View style={{ height: 42, width: width, position: "absolute", bottom: 0, }}>
                            <View style={styles.progress}>
                                <View style={[styles.innerProgressCompleted, { flex: flexCompleted }]} />
                                <View style={[styles.innerProgressRemaining, { flex: flexRemaining }]} />
                            </View>
                        </View>
                    </View>
                </Modal>
            </>
        )
    }
    onLoad = (data) => {
        // console.log("onLoad_data", data)
        this.setState({ duration: data.duration });
    };

    onProgress = (data) => {
        // console.log("onProgress_data", data)
        this.setState({ currentTime: data.currentTime });
    };

    onEnd = () => {
        this.setState({
            paused: true,
            isvideoPlay: false
        })
        this.video.seek(0)
    };

    onAudioBecomingNoisy = () => {
        this.setState({ paused: true })
    };
}
const Slide = props => {
    console.log("props", props.uri)
    return (
        <View style={styles.slide}>
            {
                <>
                    {
                        props.uri.isVideo ?
                            <TouchableOpacity style={{ position: "absolute", zIndex: 1, alignSelf: "center" }} onPress={() => props.playVideo(props.uri.url)}>
                                <Image source={require('../../images/icons/Videos.png')}
                                    style={{ width: 40, height: 40 }}
                                    resizemode="contain"
                                    resizeMethod="resize"
                                />
                            </TouchableOpacity>
                            :
                            undefined
                    }<Image
                        onLoad={props.loadHandle.bind(null, props.i)}
                        style={styles.image}
                        source={{ uri: props.uri.uri }}
                        resizeMethod="resize"
                        resizemode="contain"
                    />
                </>
            }
            {
                !props.loaded && <View style={styles.loadingView}><Loader /></View>
            }
        </View>
    )
}
class Friendsdescription extends Component {
    constructor(props) {
        super(props);
        this.state = {
            traits: []
        }
    }
    componentWillMount() {
        this.getFriendsDescription()
    }
    getFriendsDescription = () => {
        let header = {
            'Authorization': this.props.token,
            'Content-Type': 'application/json'
        }
        let data = {
            "userId": this.props.userId
        }
        ApiManager.callwebservice('POST', 'api/getFriendsDescription', header, data, (success) => {
            let response = JSON.parse(success._bodyInit);
            console.log("getFriendsDescription", response)
            if (response.status === 0) {
                return
            } else if (response.status === 1) {
                this.setState({
                    traits: response.data && response.data.traits ? response.data.traits : []
                })
            }
        }, (error) => {
            console.log("error", error)
        })
    }

    friends_description() {
        return this.state.traits.map((item, index) => {
            return <TouchableOpacity style={[styles.desc_button, { borderColor: "#909096" }]} key={index}>
                <Text style={styles.friends_desc_text}>{item}</Text>
            </TouchableOpacity>
        })
    }
    render() {
        console.log("this.state.traits.length", this.state.traits.length)
        return (
            <View style={{ paddingLeft: 16, marginTop: 32 }}>
                {
                    this.state.traits && this.state.traits.length ?
                        <View style={{ height: 15, marginBottom: 16 }}>
                            <Text style={styles.mutualfriendsLabel} >{I18n.t('friendsdescriptionLabel')} </Text>
                        </View>
                        : null
                }
                <View style={{ flex: 0, flexDirection: "row", flexWrap: 'wrap' }}>
                    {this.friends_description()}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: "rgba(1,1,1,0.3)",
        paddingHorizontal: 50
    },
    container: {
        paddingVertical: 0,
        backgroundColor: "#fff"
    },
    imageSlider: {
        height: IS_ANDROID ? 460 : 460
    },
    detail: {
        backgroundColor: "#FFF"
    },
    slide: {
        flex: 1,
        justifyContent: 'center'
    },
    videoControl: {
        width: 50,
        height: 50,
        position: "absolute",
        zIndex: 1,
        alignSelf: "center"
    },
    moreoptions: {
        width: 42,
        height: 42,
        justifyContent: "center",
        alignItems: "flex-end",
        backgroundColor: "#fff"
    },
    image: {
        flex: 1,
        width: null,
        height: null,
    },
    desc_button: {
        paddingHorizontal: 10,
        borderRadius: 12,
        borderWidth: 1,
        marginRight: 8,
        marginVertical: 4
    },
    backicon: {
        width: 54,
        height: 54,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        zIndex: 1,
        top: IS_ANDROID ? 20 : 25,
        left: 10,
        // backgroundColor:"red"
    },
    button_back: {
        width: 30,
        height: 20,
    },
    loadingView: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,.5)'
    },
    loadingImage: {
        width: 60,
        height: 60
    },
    namefield: {
        height: 100,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        // backgroundColor:"#000"
    },
    username: {
        padding: 0,
        margin: 0,
        fontSize: 24,
        fontFamily: 'Avenir-Medium',
        color: "#3E3E47",
        lineHeight: 33,
        // backgroundColor:"#009933"
    },
    location: {
        fontSize: 16,
        fontFamily: 'Avenir-Medium',
        color: "#909096",
        lineHeight: 22,
    },
    answercontains: {
        fontSize: 15,
        fontFamily: 'Avenir-Medium',
        color: "#909096",
        lineHeight: 22,
    },
    mediaScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    areainterest: {
        fontSize: 15,
        fontFamily: 'Avenir-Medium',
        color: "#3E3E47",
        lineHeight: 22,
    },
    mutualfriendsLabel: {
        color: "#71367D",
        fontSize: 15,
        fontFamily: 'Avenir-Medium',
    },
    footer: {
        height: 100,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    friends_desc_text: {
        fontSize: 15,
        fontFamily: 'Avenir-Medium',
        color: "#909096",
        lineHeight: 22,
    },
    footerButtons: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
        marginHorizontal: 10
    },
    dots: {
        backgroundColor: 'rgba(255,255,255,0.3)',
        width: 10,
        height: 2,
        borderRadius: 1.5,
        marginLeft: 3,
        marginRight: 3,
    },
    activedots: {
        backgroundColor: '#FFF',
        width: 10,
        height: 2,
        borderRadius: 1.5,
        marginLeft: 3,
        marginRight: 3,
    },
    userDetailbar: {
        flex: 1,
        // backgroundColor: "red"
    },
    popupmenu: {
        width: 20,
        height: 20,
        margin: 7.5,
        resizeMode: "contain"
    },
    bioDetail: {
        paddingHorizontal: 16,
        // paddingVertical: 20,
    },
    mutualfriendsarea: {
        // paddingLeft: 20,
        // paddingVertical: 20,
    },
    label: {
        paddingLeft: 16,
        paddingTop: 32,
        paddingBottom: 16,
        // height: 50
    },
    bottomimageButton: {
        width: 31,
        height: 31,
    },
    // video Styles
    progress: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 3,
        overflow: 'hidden',
    },
    innerProgressCompleted: {
        height: 20,
        backgroundColor: '#cccccc',
    },
    innerProgressRemaining: {
        height: 20,
        backgroundColor: '#2C2C2C',
    },
})

mapStateToProps = (state) => {
    return {
        language: state.language.defaultlanguage,
        data: state.auth.data,
        token: state.auth.token
    }
}
export default connect(mapStateToProps)(UserProfile);