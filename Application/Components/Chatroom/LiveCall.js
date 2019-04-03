import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    Dimensions,
    TouchableOpacity,
    Platform,
    PermissionsAndroid
} from 'react-native';
import { connect } from 'react-redux'
// import Icons from 'react-native-vector-icons/Ionicons'
import { OTSession, OTPublisher, OTSubscriber, EventData, OT } from 'opentok-react-native';
import LinearGradient from 'react-native-linear-gradient';
import BaseFormComponent from '../../Components/Common/BaseFormComponent';
import Apirequest from '../Common/Apirequest';
import * as global from '../../../global.json';

const IS_ANDROID = Platform.OS === 'android';
let { width, height } = Dimensions.get('window');
import Timer from './TimeKeeper/index';

class LiveCall extends BaseFormComponent {
    constructor(props) {
        super(props);
        this.publisherProperties = {
            publishAudio: true,
            cameraPosition: 'front',
            publishVideo: true,
        };
        this.publisherEventHandlers = {
            audioLevel: event => {
                console.log('Publisher stream audioLevel!', event);
            },
            error: event => {
                console.log('Publisher stream destroyed! error', event);
            },
            streamCreated: event => {
                // alert("i am publishing")
                console.log('Publisher stream created!', event);
            },
            streamDestroyed: event => {
                console.log('Publisher stream destroyed!_ event', event);
            }
        };
        this.subscriberProperties = {
            subscribeToAudio: true,
            subscribeToVideo: true,
        };
        this.subscriberEventHandlers = {
            error: (error) => {
                console.log(`There was an error with the subscriber: ${error}`);
            },
        };
        this.sessionEventHandlers = {
            sessionConnected: event => {
                console.log('sessionConnected created!', event);
            },
            streamCreated: event => {
                // this.startArchive(event)
                this.chageAppcallSatus()
                console.log('Stream created!', event);
            },
            streamDestroyed: event => {
                this.videocallisend(event)
                console.log('Stream destroyed!', event);
            },
        };
        this.state = {
            data: {},
            sessionId: '',
            token: '',
            videocallconnect: false,
            loading: true,
            streamProperties: {}

        }
    }
    chageAppcallSatus = ()=>{
        this.setState({
            videocallconnect: true
        })
    }
    videocallisend(event) {
        const { goBack, state } = this.props.navigation;
        goBack()
    }
    startArchive(event) {
        console.log('startArchive created!');
        const { state } = this.props.navigation;
        var Data = {
            "profileUserId": state.params.profileUserId,
        }
        console.log("startArchive_Data", Data)
        // if (event && event.streamId) {
            Apirequest.startArchive(this.props.token, Data, resolve => {
                console.log("startArchive_resolve", resolve)
                this.setState({
                    videocallconnect: true,
                    loading: false
                })
            }, reject => {
                this.setState({
                    videocallconnect: true,
                    loading: false
                })
                console.log("startArchive_reject", reject)
            })
        // }
    }
    componentDidMount() {
        const { state } = this.props.navigation;
        let userid = state.params.profileUserId;
        console.log("componentDidMount_userId", userid)
        Apirequest.getChatSessionId(this.props.token, userid, (resolve) => {
            console.log("getChatSessionId_resolve", resolve)
            if (resolve && resolve.message) {
                this.showSimpleMessage("info", { backgroundColor: global.gradientsecondry }, "", resolve.message ? resolve.message : '')
            }
            if (resolve.data) {
                this.setState({
                    data: resolve.data ? resolve.data : {},
                    sessionId: resolve.data && resolve.data.session ? resolve.data.session : '',
                    token: resolve.data && resolve.data.token ? resolve.data.token : '',
                })
                this.startArchive()
            }
        }, (reject) => {
            console.log("getChatSessionId_reject", reject)
        })
    }
    async stopArchive() {
        console.log('stopArchive created!');
        const { goBack, state } = this.props.navigation;
        var Data = {
            "profileUserId": state.params.profileUserId,
        }
        Apirequest.stopArchive(this.props.token, Data, resolve => {
            if (resolve) {
                goBack()
            }
        }, reject => {
            if (reject) {
                goBack()
            }
            console.log("stopArchive_reject", reject)
        })
    }
    reportUser() {
        const { goBack, state } = this.props.navigation;
        var Data = {
            "profileUserId": state.params.profileUserId,
            "type": "video"
        }
        console.log("reportUser", Data)
        Apirequest.reportUser(this.props.token, Data, resolve => {
            console.log("resolve", resolve)
            this.stopArchive()
        }, reject => {
            console.log("reject", reject)
        })
    }
    sendNotificationForVideoCall() {
        const { goBack, state } = this.props.navigation;
        var Data = {
            "callReceiverId": state.params.profileUserId,
        }
        Apirequest.sendNotificationForVideoCall(this.props.token, Data, resolve => {
            console.log("sendNotificationForVideoCall_resolve", resolve)
        }, reject => {
            if (reject && reject.message) {
                this.showSimpleMessage("info", { backgroundColor: global.gradientsecondry }, '', reject.message)
            }
            console.log("sendNotificationForVideoCall_reject", reject)
        })
    }
    render() {
        const { goBack, state } = this.props.navigation;
        const { sessionId, token } = this.state;
        // console.log("state", state);
        // console.log("sessionId", sessionId);
        // console.log("token", token);
        if (this.state.loading) {
            return <Text>Loading</Text>
        }
        return (
            <View style={styles.container}>
                <OTSession
                    apiKey={global.API_KEY}
                    sessionId={sessionId}
                    token={token}
                    eventHandlers={this.sessionEventHandlers}
                >
                    {
                        this.state.videocallconnect ?
                            <>
                                <View style={{ position: "absolute", zIndex: 2 }}>
                                    <OTPublisher
                                        style={{ width: 150, height: 200 }}
                                        properties={this.publisherProperties}
                                        eventHandlers={this.publisherEventHandlers}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <OTSubscriber
                                        style={styles.publisherView}
                                        properties={this.subscriberProperties}
                                        eventHandlers={this.subscriberEventHandlers}
                                    />
                                </View>
                            </>
                            :
                            <View style={{ position: "absolute", zIndex: 2 }}>
                                <OTPublisher
                                    style={{ width: 150, height: 200 }}
                                    properties={this.publisherProperties}
                                    eventHandlers={this.publisherEventHandlers}
                                />
                            </View>
                    }
                </OTSession>
                <TouchableOpacity onPress={() => this.reportUser()} style={styles.reportflag}>
                    <Image
                        source={require('../../images/icons/report.png')}
                        style={{ width: 40, height: 40 }}
                        resizeMethod="resize"
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <View style={styles.callutility}>
                    <View style={styles.commonButton} />
                    <View style={styles.commonButton}>
                        {
                            // this.state.videocallconnect
                            //     ?
                            //     <TouchableOpacity onPress={() => this.stopArchive()}>
                            //         <Image source={require('../../images/icons/stopvideocall.png')} style={{ width: 60, height: 60 }} resizeMethod="resize" resizeMode="contain" />
                            //     </TouchableOpacity>
                            //     :
                                <TouchableOpacity onPress={() => this.sendNotificationForVideoCall()}>
                                    <Image source={require('../../images/icons/videocall.png')} style={{ width: 60, height: 60 }} resizeMethod="resize" resizeMode="contain" />
                                </TouchableOpacity>
                        }
                    </View>
                    <View style={styles.commonButton}>
                        <LinearGradient
                            colors={['#DB3D88', '#273174']}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.callendButton}>
                            <TouchableOpacity
                                onPress={() => this.stopArchive()}
                                style={{ width: 40, height: 40, justifyContent: "center", alignItems: "center" }}>
                                <Image
                                    source={require('../../images/icons/Close.png')}
                                    style={{ width: 15, height: 15 }}
                                    resizeMode="contain"
                                    resizeMethod="resize"
                                />
                            </TouchableOpacity>
                            {/* <Icons name="ios-reverse-camera" size={30} color="#fff" /> */}
                        </LinearGradient>
                    </View>

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row'
    },
    publisherView: {
        width: "100%",
        height: "100%",
        resizeMode: "contain"
    },
    reportflag: {
        top: 50,
        right: 20,
        position: "absolute",
        zIndex: 2,
        // backgroundColor: "rgba(0,0,0,0.3)",
        flexDirection: 'row',
        borderRadius: 20,
        justifyContent: "center"
    },
    callendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: "hidden"
    },
    callutility: {
        width: width,
        height: 160,
        bottom: 0,
        position: "absolute",
        zIndex: 2,
        backgroundColor: "rgba(0,0,0,0.5)",
        flexDirection: 'row',
        borderTopLeftRadius: 20,
        borderTopEndRadius: 20,
        justifyContent: "space-between"
    },
    button: {
        padding: 20,
        borderWidth: 3,
        borderColor: 'white',
        backgroundColor: 'red'
    },
    commonButton: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    emptyView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold'
    }
});
mapStateToProps = (state) => {
    return {
        language: state.language.defaultlanguage,
        data: state.auth.data,
        token: state.auth.token
    }
}
export default connect(mapStateToProps)(LiveCall);