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
import Swiper from 'react-native-swiper';
import I18n from 'react-native-i18n';
import { colors } from 'react-native-elements';
import LottieView from 'lottie-react-native';

import metrics from '../../config/metrics';
import image1 from '../../images/Photos.png'
import backbutton from '../../images/icons/backbutton.png'
import PopupMenu from './options'
import Loader from './Loader'
import MutualFriends from './mutualfriend'

const IS_ANDROID = Platform.OS === 'android'

import moreoptions from '../../images/icons/moreoptions.png'

export default class UserProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imgList: [image1, image1, image1, image1
                //  'https://gitlab.pro/yuji/demo/uploads/d6133098b53fe1a5f3c5c00cf3c2d670/DVrj5Hz.jpg_1',
                // 'https://gitlab.pro/yuji/demo/uploads/2d5122a2504e5cbdf01f4fcf85f2594b/Mwb8VWH.jpg',
                // 'https://gitlab.pro/yuji/demo/uploads/4421f77012d43a0b4e7cfbe1144aac7c/XFVzKhq.jpg',
                // 'https://gitlab.pro/yuji/demo/uploads/576ef91941b0bda5761dde6914dae9f0/kD3eeHe.jpg'
            ],
            loadQueue: [0, 0, 0, 0]
        }
        this.loadHandle = this.loadHandle.bind(this)
    }
    loadHandle(i) {
        let loadQueue = this.state.loadQueue
        loadQueue[i] = 1
        this.setState({
            loadQueue
        })
    }
    editPost() {

    }
    deletePost() {
    }
    cancel() {
    }
    render() {
        const { goBack } = this.props.navigation;
        // alert(metrics.DEVICE_HEIGHT * 1.3)
        return (
            <View style={{ flex: 1 }}>
                <StatusBar
                    backgroundColor={Platform.OS === 'android' ? "#000" : undefined}
                    barStyle={Platform.OS === 'android' ? "light-content" : "light-content"} />

                <ScrollView contentContainerStyle={styles.container}
                    bounces={false}
                >
                    {/* <SafeAreaView 
                style={{backgroundColor:"#000"}}/> */}
                    <View style={styles.imageSlider}>
                        <TouchableOpacity 
                        onPress={()=>goBack()}
                            style={styles.backicon}
                            >
                        <Image
                            source={backbutton}
                            style={{        width: 22,
                                height: 16,
                        }}
                            resizeMethod="resize"
                            resizeMode="contain" />
                            </TouchableOpacity>
                        <Swiper
                            loadMinimal
                            loadMinimalSize={1}
                            // style={{height:750}}
                            loop={false}
                            bounces={false}
                            // showsButtons={true}
                            // paginationStyle={{
                            //     bottom: 35,
                            //     colors: "#000"
                            // }}
                            dot={
                                <View style={{
                                    backgroundColor: 'rgba(255,255,255,0.3)',
                                    width: 10,
                                    height: 2,
                                    borderRadius: 1.5,
                                    marginLeft: 3,
                                    marginRight: 3,
                                    // marginTop: 3,
                                    // marginBottom: 3
                                }} />
                            }
                            activeDot={
                                <View style={{
                                    backgroundColor: '#FFF',
                                    width: 10,
                                    height: 2,
                                    borderRadius: 1.5,
                                    marginLeft: 3,
                                    marginRight: 3,
                                    // marginTop: 3,
                                    // marginBottom: 3
                                }} />
                            }
                        >
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
                        <View style={styles.detail}>
                            <View style={styles.namefield}>
                                <View style={{ flex: 1, backgroundColor: "transparent" }}>
                                    <Text style={styles.username}> Daisy Brady</Text>
                                    <Text style={styles.location}>  Seattle, USA </Text>
                                </View>
                                <View style={styles.moreoptions}>
                                    <PopupMenu
                                        button={moreoptions}
                                        buttonStyle={{ width: 20, height: 20, margin: 7.5, resizeMode: "contain" }}
                                        destructiveIndex={1}
                                        options={["Edit", "Delete", "Cancel"]}
                                        actions={[this.editPost, this.deletePost, this.cancel]}
                                    />
                                </View>
                            </View>
                            <View style={{
                                paddingHorizontal: 20,
                                paddingVertical: 20,
                                // backgroundColor:"#009933" 
                            }}>
                                <Text style={styles.areainterest} numberOfLines={4}>{I18n.t('userdetail')} </Text>
                            </View>
                            <View style={{
                                paddingLeft: 20, paddingVertical: 20,
                                // backgroundColor:"red"
                            }}>
                                <View style={{ height: 50 }}>
                                    <Text style={styles.mutualfriendsLabel} numberOfLines={4}>{I18n.t('mutualfriendsLabel')} </Text>
                                </View>
                                <View style={{ height: 75 }}>
                                    <MutualFriends />

                                </View>
                            </View>
                            <View style={{ paddingLeft: 20 }}>
                                <View style={{ height: 50 }}>
                                    <Text style={styles.mutualfriendsLabel} >{I18n.t('basicprofileLabel')} </Text>
                                </View>
                                <Text style={styles.answercontains}>Animal Lover: Dogs</Text>
                                <Text style={styles.answercontains}>Movie/TV and Reading: Sci-Fi</Text>
                                <Text style={styles.answercontains}>Exercise: Never</Text>
                                <Text style={styles.answercontains}>Political views: Libertarian</Text>
                                <Text style={styles.answercontains}>Music: Heavy Metal</Text>
                                <Text style={styles.answercontains}>Sports: Cycling</Text>
                            </View>
                        </View>
                        <View style={styles.footer}>
                            <TouchableOpacity style={styles.footerButtons}>
                                <Image
                                    source={require('../../images/icons/smily.png')}
                                    resizeMethod="resize"
                                    resizeMode="contain"
                                    style={{
                                        width: 31,
                                        height: 31,
                                    }} />

                            </TouchableOpacity>
                            <TouchableOpacity style={styles.footerButtons}>
                                <Image
                                    source={require('../../images/icons/favourate.png')}
                                    resizeMethod="resize"
                                    resizeMode="contain"
                                    style={{
                                        width: 31,
                                        height: 31,
                                    }} />

                            </TouchableOpacity>
                            <TouchableOpacity style={styles.footerButtons}>
                                <Image
                                    source={require('../../images/icons/msg.png')}
                                    resizeMethod="resize"
                                    resizeMode="contain"
                                    style={{
                                        width: 31,
                                        height: 31,
                                    }} />

                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
            // </SafeAreaView>
        )
    }
}
const Slide = props => {
    return (
        <View style={styles.slide}>
            <Image
                onLoad={props.loadHandle.bind(null, props.i)}
                style={styles.image}
                // source={image1}
                source={props.uri}
                // source={{ uri: props.uri }}
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
        // flex:1,
        paddingVertical: 0,
        // height: '70%',
        backgroundColor: "#fff"
    },
    imageSlider: {
        height: IS_ANDROID ? 1024 :1100 //metrics.DEVICE_HEIGHT * 1.3,
    },
    detail: {
        backgroundColor: "#FFF"
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        // alignItems: 'center',
        // backgroundColor: 'red'
    },
    moreoptions: {
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-end",
        backgroundColor: "#fff"
    },
    image: {
        flex: 1,
        width: null,
        height: null,
        // resizemode:"contain",
        // backgroundColor: 'red'
    },
    backicon: {
        width: 22,
        height: 16,
        position: "absolute",
        zIndex: 1,
        top: 50,
        left: 20
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
        paddingHorizontal: 20,
        // justifyContent:"center", 
        // backgroundColor: "#009933",
        flexDirection: "row",
        alignItems: "center"
    },
    username: {
        fontSize: 24,
        fontFamily: 'Avenir-Medium',
        color: "#3E3E47", //"rgba(255, 255, 255, 0.6)",
        lineHeight: 33,
        // opacity: 0.6
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
    }
})

