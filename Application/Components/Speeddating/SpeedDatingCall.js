/**
 * Top-Profile page
 * Author :abhishekkalia
 */
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    View,
    AsyncStorage,
    Alert,
} from 'react-native';
import io from 'socket.io-client'; // 2.0.4
import TimerMixin from 'react-timer-mixin';
import _ from 'lodash';
import { connect } from 'react-redux';
import BaseFormComponent from '../Common/BaseFormComponent';
import i18n from 'react-native-i18n';
import moment from 'moment'
import Loading from '../Loading';
import SpeeddatingliveCall from "../Chatroom/SpeeddatingliveCall";
import Apirequest from '../Common/Apirequest';
import * as global from '../../../global.json';
import metrics from '../../config/metrics';
import { baseurl as URL } from '../../../app.json';
const IS_ANDROID = Platform.OS === 'android';
const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.05;
const header_height = metrics.DEVICE_HEIGHT * 0.1;

class SpeedDatingCall extends BaseFormComponent {
    constructor(props) {
        super(props);
        // this.socket = io(URL);
        // this.socket.on("speedDatingEventStarted", data => {
        //     console.log("userConnect_speedDatingEventStarted", data)
        //     if (data && data.speedDatingEventDayId) {
        //         this.getUsersPairForSpeedDating(data.speedDatingEventDayId)
        //     }
        // }
        // );
        this.state = {
            userIndex: 0,
            visibleModal: false,
            speedDatingUser: [],
            scrollOffset: '',
            isloading: true,
            startEvent: false
        }
    }
    speedDatingUserStore = async (speeddatingusers, heighlightedUserIndex) => {
        var speeddatingevent,
            heighlightedUserIndex;
        console.log("speeddatingusers", speeddatingusers)
        console.log("heighlightedUserIndex", heighlightedUserIndex)
        try {
            AsyncStorage.multiSet([['heighlightedUserIndex', JSON.stringify(heighlightedUserIndex)], ['speeddatingevent', JSON.stringify(speeddatingusers)]], () => {
                AsyncStorage.multiGet(["speeddatingevent", "heighlightedUserIndex"], (error, stores) => {
                    speeddatingevent = stores[0][1] ? JSON.parse(stores[0][1]) : []
                    heighlightedUserIndex = stores[1][1] ? JSON.parse(stores[1][1]) : []
                    console.log("speedDatingUserStore_heighlightedUserIndex", heighlightedUserIndex)
                    if (Array.isArray(speeddatingevent) && heighlightedUserIndex !== '') {
                        this.setState({
                            speedDatingUser: speeddatingevent,
                            userIndex: heighlightedUserIndex
                        }, () => this.sendNotificationForVideoCall(speeddatingevent, heighlightedUserIndex))
                    }
                })
            });

        } catch (error) {
            console.log("error", error)
        }
    }
    speedDatingUserget = async () => {
        const { state } = this.props.navigation;
        console.log("speedDatingUserget_state", state)
        // var speedDatingEventDayId = state && state.params && state.params.speedDatingEventDayId ? state.params.speedDatingEventDayId : ''
        var speedDatingEventDayId = "5ca19973992b010533f3cd91";
        console.log("speedDatingUserget_speedDatingEventDayId", speedDatingEventDayId)
        var speeddatingevent,
            heighlightedUserIndex;
        try {
            AsyncStorage.multiGet(["speeddatingevent", "heighlightedUserIndex"], (error, stores) => {
                console.log("multiGet_stores", stores)
                speeddatingevent = stores && stores[0] && stores[0][1] ? JSON.parse(stores[0][1]) : []
                heighlightedUserIndex = stores && stores[1] && stores[1][1] ? JSON.parse(stores[1][1]) : 0
                console.log("speeddatingevent", speeddatingevent)

                if (Array.isArray(stores) && stores && stores[0] && stores[0][1] && stores[1] && stores[1][1] && heighlightedUserIndex !== '') {
                    console.log("speeddatingevent", speeddatingevent)
                    console.log("heighlightedUserIndex", heighlightedUserIndex)

                    if (speeddatingevent[heighlightedUserIndex] && speeddatingevent[heighlightedUserIndex].callStatus === "completed" && speeddatingevent[heighlightedUserIndex].feedback) {
                        this.setState({
                            speedDatingUser: speeddatingevent,

                        }, () => this.sendNotificationForVideoCall(speeddatingevent, ++heighlightedUserIndex))
                    } else {
                        this.setState({
                            speedDatingUser: speeddatingevent,
                        }, () => this.sendNotificationForVideoCall(speeddatingevent, heighlightedUserIndex))
                    }
                } else {
                    this.getUsersPairForSpeedDating(speedDatingEventDayId)
                }
            })

        } catch (error) {
            console.log("speeddatingevent_error", error)
        }
    }
    speedDatinguserRemove = async (callback) => {
        let keys = ['speeddatingevent', 'heighlightedUserIndex'];
        try {
           var removed =  AsyncStorage.multiRemove(keys, (error) => {
                console.log("error", error)
            });
            if(removed){
                callback("success")
            }
            return true;
        }
        catch (exception) {
            return false;
        }
    }

    userInterval() {
        TimerMixin.setTimeout(() => {
            this.callnextuserforspeedDating()
        }, 480000);
    }

    componentDidMount = () => {
        // this.speedDatinguserRemove()
        // var data = "5ca19973992b010533f3cd91";
        // this.getUsersPairForSpeedDating(data);
        this.speedDatingUserget()
    }
    getUsersPairForSpeedDating(speedDatingEventDayId) {
        let data = {
            "speedDatingEventDayId": speedDatingEventDayId
        };
        var notificationdate = new Date();
        var token = this.props.token;
        var speedDatingUsers = []
        Apirequest.getUsersPairForSpeedDating(token, data, resolve => {
            if (resolve.data) {
                console.log("getUsersPairForSpeedDating_resolve", resolve)
                var datasource = resolve.data;
                for (var i = 0; i < datasource.length; i++) {
                    let dataobject = {};
                    dataobject.userId = datasource[i] && datasource[i].userId ? datasource[i].userId : '';
                    dataobject.fullName = datasource[i] && datasource[i].fullName ? datasource[i].fullName : '';
                    dataobject.age = datasource[i] && datasource[i].age ? datasource[i].age : '';
                    dataobject.profilePic = datasource[i] && datasource[i].profilePic ? datasource[i].profilePic : '';
                    speedDatingUsers.push(dataobject);
                }
                if (speedDatingUsers && speedDatingUsers.length) {
                    const CurrentspeedDatingusers = _.map(speedDatingUsers, (obj, key) => {
                        return key == 0 ? { ...obj, callStatus: "ongoing", feedback: false, notificationDateTime: notificationdate } : { ...obj, callStatus: "pending", feedback: false, notificationDateTime: notificationdate }
                    });
                    console.log("CurrentspeedDatingusers", CurrentspeedDatingusers)
                    var heighlightedUserIndex = 0
                    this.speedDatingUserStore(CurrentspeedDatingusers, heighlightedUserIndex)
                } else {
                    this.setState({
                        speedDatingUser: [],
                    })
                }
            }
        }, reject => {
            this.setState({
                speedDatingUser: [],
                isloading: false
            })
            console.log("getSpeedDatingEvents_reject", reject)
        })
    }
    sendNotificationForVideoCall(speedDatingUser, userIndex) {
        const { state } = this.props.navigation;
        console.log("sendNotificationForVideoCall_state", state)
        // var speedDatingEventDayId = state && state.params && state.params.speedDatingEventDayId ? state.params.speedDatingEventDayId : ''
        var speedDatingEventDayId = "5ca19973992b010533f3cd91";
        // const { userIndex } = this.state;
        console.log("speedDatingUser", speedDatingUser)
        console.log("userIndex", userIndex)
        // var callReceiverId = _.filter(speedDatingUser, (obj) => { return obj.isHighlight })
        callReceiverId = Array.isArray(speedDatingUser) && speedDatingUser[userIndex] && speedDatingUser[userIndex].userId ? speedDatingUser[userIndex].userId : ''
        console.log("callReceiverId", callReceiverId)
        var token = this.props.token;
        var data = {
            "callReceiverId": callReceiverId,
            "type": 'speeddatingcall',
            "eventDayId": speedDatingEventDayId
        }
        console.log("sendNotificationForVideoCall_speedDatingUser", data)
        Apirequest.sendNotificationForVideoCall(token, data, resolve => {
            console.log("sendNotificationForVideoCall_resolve", resolve)
            if (resolve.message) {
                this.showSimpleMessage("", { backgroundColor: global.gradientsecondry }, "", resolve.message)
                this.setState({
                    isloading: false
                })
            }
        }, reject => {
            console.log("sendNotificationForVideoCall_reject", reject)
            if (reject && reject.message) {
                this.showSimpleMessage("", { backgroundColor: global.gradientsecondry }, "", reject.message)
            }
        })
    }
    speeddatingfeedback() {
        this.setState({
            isloading: true
        })
        const { navigate } = this.props.navigation;
        const { speedDatingUser, userIndex } = this.state;
        var dataItems = speedDatingUser[userIndex];
        console.log("dataItems", dataItems)
        navigate('speeddatingfeedback', {
            checkemitRequest: this.callnextuserforspeedDating.bind(this),
            data: dataItems,
            token: this.props.token,
            invitationname: dataItems.fullName,
            eventNamepoint: 'speeddatingfeedback',
            notFeedbackGive: this.notFeedbackGive.bind(this)

        })
    }
    notFeedbackGive(){

    }
    callnextuserforspeedDating = () => {
        const { state, navigate } = this.props.navigation;
        const { speedDatingUser, userIndex } = this.state;
        var heighlightedUserIndex = userIndex;
        speedDatingUser[heighlightedUserIndex]["feedback"] = true;
        speedDatingUser[heighlightedUserIndex]["callStatus"] = "completed";
        // speedDatingUser[heighlightedUserIndex]["isHighlight"] = false;
        var speedDaterIndex = userIndex;
        console.log("speedDatingUser======", speedDatingUser);
        console.log("speedDaterIndex======", speedDaterIndex);
        this.setState({
            isloading: true,
        })
        var nextUsername = speedDatingUser && speedDatingUser[speedDaterIndex + 1] ? speedDatingUser[speedDaterIndex + 1].fullName : '';
        (!nextUsername) ?
            this.speedDatinguserRemove(cb => {
                console.log("cb", cb)
                navigate('homePage')
            })
            :
            Alert.alert(
                i18n.t('appname'),
                `Would you like to connect next User ${nextUsername} \n if you press cancel you have to wait for next user to connect with you.`, [
                    {
                        text: 'Cancel',
                        onPress: () => this.userInterval(),
                        style: 'cancel',
                    },
                    { text: 'OK', onPress: () => this.getNextUser(speedDatingUser, speedDaterIndex) },
                ],
                { cancelable: false },
            );
    }
    getNextUser = (speedDatingUser, speedDaterIndex) => {
        this.speedDatingUserStore(speedDatingUser, (speedDaterIndex + 1))
    }
    // updatSpeedDatingEvent = async (event) => {
    // }
    streamCreated_update(cb) {
        const { speedDatingUser, userIndex } = this.state;
        var newspeedDatingUser = _.map(speedDatingUser, (obj) => { return obj && obj.userId === cb.userId ? obj = cb : obj })
        this.updateSingleStore(newspeedDatingUser)
    }
    updateSingleStore = async (newspeedDatingUser) => {
        console.log("updateSingleStore", newspeedDatingUser)
        try {
            AsyncStorage.setItem('speeddatingevent', JSON.stringify(newspeedDatingUser), () => {
                AsyncStorage.getItem('speeddatingevent', (err, result) => {
                    // console.log("updateSingleStore_speeddatingevent", JSON.parse(result))
                    this.setState({
                        speedDatingUser: JSON.parse(result)

                    })
                })

            })
        } catch (error) {
            console.log("error", error)
        }
    }
    render() {
        const { isloading, userIndex, startEvent } = this.state;
                // var speedDatingEventDayId = state && state.params && state.params.speedDatingEventDayId ? state.params.speedDatingEventDayId : ''
                var speedDatingEventDayId = "5ca19973992b010533f3cd91";

        console.log("userIndex", userIndex)
        if (isloading) {
            return <Loading />
        }
        // if (!startEvent) {
        //     return (<View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        //         <TouchableOpacity onPress={() => this.setState({ startEvent: true })}>
        //             <Text>Start SpeedDating Event</Text>
        //         </TouchableOpacity>
        //     </View>
        //     )
        // }
        return (
            <View style={styles.container}>
                {/* <View style={{ flexWrap: "wrap", flexDirection: 'row' }}>
                    {
                        this.state.speedDatingUser.map((item, index) => {
                            return <TouchableOpacity key={index} style={{}}  >
                                <Image
                                    source={item && item.profilePic ? { uri: item.profilePic } : require('../../images/applogo.png')}
                                    style={{ width: 60, height: 60, borderRadius: 30 }} resizeMethod="resize" resizemode="contain" />
                            </TouchableOpacity>
                        })}
                </View> 
                */}
                <SpeeddatingliveCall
                    navigation={this.props.navigation}
                    speedDateruserObj={this.state.speedDatingUser[userIndex]}
                    userId={this.state.speedDatingUser[userIndex].userId}
                    isloading={this.state.isloading}
                    callnextuserforspeedDating={this.callnextuserforspeedDating.bind(this)}
                    speeddatingfeedback={this.speeddatingfeedback.bind(this)}
                    // updatSpeedDatingEvent={this.updatSpeedDatingEvent.bind(this)}
                    streamCreated_update={this.streamCreated_update.bind(this)}
                    speedDatingEventDayId = {speedDatingEventDayId}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bottomModal: {
        justifyContent: "flex-end",
        margin: 0
    },
});
mapStateToProps = (state) => {
    return {
        language: state.language.defaultlanguage,
        data: state.auth.data,
        token: state.auth.token
    }
}
export default connect(mapStateToProps)(SpeedDatingCall);