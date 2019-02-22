/**
 * Userprofile page
 * Author :abhishekkalia
 */
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    Text,
    TouchableOpacity,
    ScrollView,
    View,
    Image,
} from 'react-native';
import { connect } from 'react-redux'
import Swiper from 'react-native-swiper';
import I18n from 'react-native-i18n';
import backbutton from '../../images/icons/backbutton_gradient.png'
import PopupMenu from './options'
import Loader from '../Loading/Loader'
import MutualFriends from './mutualfriend'
import ApiManager from "../Common/ApiManager";
import moreoptions from '../../images/icons/moreoptions.png';
import metrics from '../../config/metrics';

const IS_ANDROID = Platform.OS === 'android'

class UserProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            datastores: {},
            traits: [],
            imgList: [],
            loadQueue: [0, 0, 0, 0]
        }
        this.loadHandle = this.loadHandle.bind(this)
    }
    getUserProfile = () => {
        const { state } = this.props.navigation;
        let header = {
            'Authorization': this.props.token,
            'Content-Type': 'application/json'
        }
        let data = {
            "uid": state.params.userId
        }
        ApiManager.callwebservice('POST', 'api/getUserProfile', header, data, (success) => {
            let response = JSON.parse(success._bodyInit);
            if (response.status === 0) {
                return
            } else if (response.status === 1) {
                console.log("response", response.data)
                let galaryData = response.data.gallery
                galaryData.sort(function (a, b) {
                    return a.order - b.order
                })
                var data_arr = [];
                for (var i = 0; i < galaryData.length; i++) {
                    var arr = {};
                    arr.order = galaryData[i].order;
                    arr._id = galaryData[i]._id;
                    if (galaryData[i].isVideo) {
                        arr.uri = galaryData[i].thumbImage;
                    } else {
                        arr.uri = galaryData[i].url;
                    }
                    data_arr.push(arr)
                }
                if (!data_arr.length) {
                    data_arr.push(require('../../images/applogo.png'))
                }
                this.setState({
                    datastores: response.data,
                    imgList: data_arr
                })
            }
        }, (error) => {
            console.log("error", error)
        })
    }
    getFriendsDescription = () => {
        const { state } = this.props.navigation;
        let header = {
            'Authorization': this.props.token,
            'Content-Type': 'application/json'
        }
        let data = {
            "userId": state.params.userId
        }
        ApiManager.callwebservice('POST', 'api/getFriendsDescription', header, data, (success) => {
            let response = JSON.parse(success._bodyInit);
            if (response.status === 0) {
                return
            } else if (response.status === 1) {
                console.log("getFriendsDescription", response.data)
                this.setState({
                    traits: response.data.traits
                })
            }
        }, (error) => {
            console.log("error", error)
        })
    }
    visitProfile = () => {
        const { state } = this.props.navigation;
        console.log("this.state", state.params.userId)
        let header = {
            'Authorization': this.props.token,
        }
        let data = {
            "profileUserId": state.params.userId
        }
        ApiManager.callwebservice('POST', 'api/addVisitedProfileUser', header, data, (success) => {
            let response = JSON.parse(success._bodyInit);
            if (response.status === 0) {
                return
            } else if (response.status === 1) {
            }
        }, (error) => {
            console.log("error", error)
        })
    };
    async componentDidMount() {
        await this.getUserProfile()
        await this.visitProfile()
        await this.getFriendsDescription()
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
    friends_description() {
        return this.state.traits.map((item, index) => {
            return <TouchableOpacity style={[styles.desc_button, { borderColor: "#909096" }]}>
                <Text style={styles.friends_desc_text}>{item}</Text>
            </TouchableOpacity>
        })
    }
    render() {
        const { datastores } = this.state;
        const { language } = this.props;
        const { goBack } = this.props.navigation;
        return (
            <View style={{ flex: 1, backgroundColor: "#FFF" }}>
                <StatusBar backgroundColor={Platform.OS === 'android' ? "#000" : undefined} barStyle={Platform.OS === 'android' ? "light-content" : "light-content"} />
                <TouchableOpacity onPress={() => goBack()} style={styles.backicon}>
                    <Image source={backbutton} style={styles.button_back} resizeMethod="resize" resizeMode="contain" />
                </TouchableOpacity>
                <ScrollView style={styles.container} bounces={false}>
                    {/* <SafeAreaView 
                style={{backgroundColor:"#000"}}/> */}
                    <View style={styles.imageSlider}>
                        <Swiper
                            loadMinimal
                            loadMinimalSize={1}
                            // style={{height:460}}
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
                                        key={i} />
                                )
                            }
                        </Swiper>
                    </View>
                    <View style={styles.detail}>
                        <View style={styles.namefield}>
                            <View style={styles.userDetailbar}>
                                <Text style={styles.username}> {datastores.fullName}</Text>
                                <Text style={styles.location}>  {metrics.DEVICE_HEIGHT} </Text>
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
                                <Text style={styles.answercontains}>Animal Lover: Dogs</Text>
                                <Text style={styles.answercontains}>Movie/TV and Reading: Sci-Fi</Text>
                                <Text style={styles.answercontains}>Exercise: Never</Text>
                                <Text style={styles.answercontains}>Political views: Libertarian</Text>
                                <Text style={styles.answercontains}>Music: Heavy Metal</Text>
                                <Text style={styles.answercontains}>Sports: Cycling</Text>
                            </View>

                        </View>
                        {
                            this.state.traits.length ?
                                <View style={{ paddingLeft: 16, marginTop: 32 }}>
                                    <View style={{ height: 15, marginBottom: 16 }}>
                                        <Text style={styles.mutualfriendsLabel} >{I18n.t('friendsdescriptionLabel', { locale: language })} </Text>
                                    </View>
                                    <View style={{ flex: 0, flexDirection: "row", flexWrap: 'wrap' }}>
                                        {this.friends_description()}
                                    </View>

                                </View>
                                : undefined

                        }

                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.footerButtons}>
                            <Image
                                source={require('../../images/icons/smily.png')}
                                resizeMethod="resize"
                                resizeMode="contain"
                                style={styles.bottomimageButton} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.footerButtons}>
                            <Image
                                source={require('../../images/icons/favourate.png')}
                                resizeMethod="resize"
                                resizeMode="contain"
                                style={styles.bottomimageButton} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.footerButtons}>
                            <Image
                                source={require('../../images/icons/msg.png')}
                                resizeMethod="resize"
                                resizeMode="contain"
                                style={styles.bottomimageButton} />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        )
    }
}
const Slide = props => {
    console.log("props", props)
    return (
        <View style={styles.slide}>
            <Image
                onLoad={props.loadHandle.bind(null, props.i)}
                style={styles.image}
                source={props.uri}
                resizeMethod="resize"
                resizemode="contain"
            />
            {
                !props.loaded && <View style={styles.loadingView}><Loader /></View>
            }
        </View>
    )
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
        paddingTop:32,
        paddingBottom:16,
        // height: 50
    },
    bottomimageButton: {
        width: 31,
        height: 31,
    }
})

mapStateToProps = (state) => {
    return {
        language: state.language.defaultlanguage,
        data: state.auth.data,
        token: state.auth.token
    }
}
export default connect(mapStateToProps)(UserProfile);