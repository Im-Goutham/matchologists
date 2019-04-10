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
import _ from 'lodash'
import { connect } from 'react-redux'
import { OTSession, OTPublisher, OTSubscriber, EventData, OT } from 'opentok-react-native';
import LinearGradient from 'react-native-linear-gradient';
import BaseFormComponent from '../Common/BaseFormComponent';
import Apirequest from '../Common/Apirequest';
import * as global from '../../../global.json';
const IS_ANDROID = Platform.OS === 'android';
let { width, height } = Dimensions.get('window');
import Timer from './TimeKeeper/index';

class SpeeddatingliveCall extends BaseFormComponent {
    constructor(props) {
        super(props);
        this.publisherProperties = {
            publishAudio: false,
            cameraPosition: 'front',
            publishVideo: true,
        };
        this.publisherEventHandlers = {
            audioLevel: event => {
                console.log('Publisher stream audioLevel!', event);
            },
            error: event => {
                console.log('Publisher stream destroyed!', event);
            },
            streamCreated: event => {
                var newspeed = this.props.speedDateruserObj;
                newspeed.callStatus = "ongoing";
                var eventData = Object.assign({}, newspeed, event)
                this.props.streamCreated_update(eventData)
                console.log('Publisher stream created!', event);
            },
            streamDestroyed: event => {
                console.log('Publisher stream destroyed!', event);
            }
        };
        this.subscriberProperties = {
            subscribeToAudio: false,
            subscribeToVideo: true,
        };
        this.sessionEventHandlers = {
            sessionConnected: event => {
                console.log('sessionConnected created!', event);
            },
            streamCreated: event => {
                // this.startArchive(event)
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
    componentDidMount() {
        this.getChatSessionId();
    }
    videocallisend() {
        const { goBack, state } = this.props.navigation;
        goBack()
    }
    startArchive(event) {
        console.log('startArchive created!');
        const { goBack, state } = this.props.navigation;
        var Data = {
            "profileUserId": this.props.userId,
        }
        console.log("startArchive_Data", Data)
        if (event && event.streamId) {
            Apirequest.startArchive(this.props.token, Data, resolve => {
                console.log("startArchive_resolve", resolve)
            }, reject => {
                console.log("startArchive_reject", reject)
            })
        }
    }
    getChatSessionId = async () => {
        let userid = this.props.userId;
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
                    loading: false
                }, () => this.startArchive())
            }
        }, (reject) => {
            console.log("getChatSessionId_reject", reject)
        })
    }
    async stopArchive() {
        console.log('stopArchive created!');
        const { goBack, state } = this.props.navigation;
        var Data = {
            "profileUserId": this.props.userId,
        }
        Apirequest.stopArchive(this.props.token, Data, resolve => {
            if (resolve) {
                this.videocallisend()
            }
        }, reject => {
            this.videocallisend()
            console.log("stopArchive_reject", reject)
        })
    }
    reportUser() {
        const { goBack, state } = this.props.navigation;
        var Data = {
            "profileUserId": this.props.userId,
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
    exitFromSpeedDatingEvent(){
        var Data = {
            "speedDatingEventDayId": this.props.speedDatingEventDayId
        }
        Apirequest.exitFromSpeedDatingEvent(this.props.token, Data, resolve => {
            if (resolve) {
                this.videocallisend()
            }
        }, reject => {
            console.log("exitFromSpeedDatingEvent_reject", reject)
        })
    }
    render() {
        const { goBack, state } = this.props.navigation;
        const { sessionId, token, loading } = this.state;
        if (loading) {
            return <></>
        }
        return (
            <View style={styles.container}>
                <OTSession
                    apiKey={global.API_KEY}
                    sessionId={sessionId}
                    token={token}
                    eventHandlers={this.sessionEventHandlers}
                >
                    <View style={{ position: "absolute", zIndex: 2 }}>
                        <OTPublisher
                            style={{ width: 125, height: 125, top: 60 }}
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
                    <View style={styles.commonButton}>
                    <TouchableOpacity
                                onPress={() =>this.exitFromSpeedDatingEvent()}
                                style={{ width: 40, height: 40, justifyContent: "center", alignItems: "center" }}>
                                <Image
                                    source={require('../../images/icons/exitIcon.png')}
                                    style={{ width: 40, height: 40 }}
                                    resizeMode="contain"
                                    resizeMethod="resize"
                                />
                            </TouchableOpacity>
                    </View>
                    <View style={styles.commonButton}>
                        {
                            <Timer
                                beat={false}
                                seconds={20}
                                radius={50}
                                borderWidth={3}
                                color="#C52957"
                                bgColor="#000"
                                bgColorSecondary="#E495AC"
                                bgColorThirt="#EFD6DE"
                                shadowColor="#FFF"
                                textStyle={{ fontSize: 26, color: '#FFF', }}
                                subTextStyle={{ fontSize: 10, color: '#FFF', }}
                                onTimeElapsed={() => this.props.speeddatingfeedback()}
                                isPausable={false}
                                onPause={() => console.log('Pause')}
                                onResume={() => console.log('Resume')}
                                minScale={0.9}
                                maxScale={1.2}
                            />
                        }
                    </View>
                    <View style={styles.commonButton}>
                        <LinearGradient
                            colors={['#DB3D88', '#273174']}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.callendButton}>
                            <TouchableOpacity
                                onPress={() => this.props.callnextuserforspeedDating()}
                                // onPress={() => this.stopArchive()}
                                style={{ width: 40, height: 40, justifyContent: "center", alignItems: "center" }}>
                                <Image
                                    source={require('../../images/icons/Close.png')}
                                    style={{ width: 15, height: 15 }}
                                    resizeMode="contain"
                                    resizeMethod="resize"
                                />
                            </TouchableOpacity>
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
    commonButton: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    button: {
        padding: 20,
        borderWidth: 3,
        borderColor: 'white',
        backgroundColor: 'red'
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
export default connect(mapStateToProps)(SpeeddatingliveCall);