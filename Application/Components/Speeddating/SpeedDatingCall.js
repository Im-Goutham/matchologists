/**
 * Top-Profile page
 * Author :abhishekkalia
 */
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    SafeAreaView,
    Text,
    View,
    Image,
    TouchableOpacity,
    AsyncStorage,
    ScrollView,
    Alert,
} from 'react-native';
import io from 'socket.io-client'; // 2.0.4
import TimerMixin from 'react-timer-mixin';
import _ from 'lodash';
import { connect } from 'react-redux'
import BaseFormComponent from '../Common/BaseFormComponent';
import i18n from 'react-native-i18n';
import Loading from '../Loading'
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
        this.socket = io(URL);
        this.socket.on("speedDatingEventStarted", data => {
            console.log("userConnect_speedDatingEventStarted", data)
            if (data && data.speedDatingEventDayId) {
                this.getUsersPairForSpeedDating(data.speedDatingEventDayId)
            }
        }
        );
        this.state = {
            userIndex: 0,
            visibleModal: false,
            speedDatingUser: [],
            scrollOffset: '',
            isloading: true
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
        var data = "5ca19973992b010533f3cd91";
        var speeddatingevent,
            heighlightedUserIndex;
        try {
            AsyncStorage.multiGet(["speeddatingevent", "heighlightedUserIndex"], (error, stores) => {
                speeddatingevent = JSON.parse(stores[0][1])
                heighlightedUserIndex = JSON.parse(stores[1][1])

                if (Array.isArray(speeddatingevent) && heighlightedUserIndex !== '') {
                    console.log("speeddatingevent", speeddatingevent)
                    console.log("heighlightedUserIndex", heighlightedUserIndex)
                    if (speeddatingevent[heighlightedUserIndex] && speeddatingevent[heighlightedUserIndex].callStatus === "completed" && speeddatingevent[heighlightedUserIndex].feedback) {
                        this.setState({
                            speedDatingUser: speeddatingevent,
                        }, () => this.sendNotificationForVideoCall(speeddatingevent, ++heighlightedUserIndex))
                    }else {
                        this.setState({
                            speedDatingUser: speeddatingevent,
                        }, () => this.sendNotificationForVideoCall(speeddatingevent, heighlightedUserIndex))    
                    }
                } else {
                    this.getUsersPairForSpeedDating(data)
                }
            })

        } catch (error) {
            console.log("speeddatingevent_error", error)
        }
    }
    speedDatinguserRemove = async () => {
        let keys = ['speeddatingevent', 'heighlightedUserIndex'];
        try {
            AsyncStorage.multiRemove(keys, (error) => {
                console.log("error", error)
            });
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
        }
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
                        return key == 0 ?
                            { ...obj, isHighlight: true, callStatus: "pending", feedback: false }
                            :
                            { ...obj, callStatus: "pending", feedback: false }
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
        // const { userIndex } = this.state;
        console.log("speedDatingUser", speedDatingUser)
        console.log("userIndex", userIndex)
        // var callReceiverId = _.filter(speedDatingUser, (obj) => { return obj.isHighlight })
        callReceiverId = Array.isArray(speedDatingUser) && speedDatingUser[userIndex] && speedDatingUser[userIndex].userId ? speedDatingUser[userIndex].userId : ''
        console.log("callReceiverId", callReceiverId)
        var token = this.props.token;
        var data = {
            "callReceiverId": callReceiverId
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
            invitationname: "abshiehk kalia",
            eventNamepoint: 'speeddatingfeedback'
        })
    }
    callnextuserforspeedDating = () => {
        const { speedDatingUser, userIndex } = this.state;
        var heighlightedUserIndex = userIndex;
        speedDatingUser[heighlightedUserIndex]["feedback"] = true;
        speedDatingUser[heighlightedUserIndex]["callStatus"] = "completed";
        speedDatingUser[heighlightedUserIndex]["isHighlight"] = false;
        var speedDaterIndex = userIndex;
        console.log("speedDaterIndex======", speedDaterIndex);
        this.setState({
            isloading: true
        })
        // }, () => this.speedDatingUserStore(speedDatingUser, (speedDaterIndex + 1)))

        Alert.alert(
            i18n.t('appname'),
            'Would you like to connect next User {{ username}} \n if you press cancel you have to wait for next to user connect with you.', [
                // { text: 'Ask me later', onPress: () => console.log('Ask me later pressed') },
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

        // const { speedDatingUser, userIndex } = this.state;

        // console.log("speedDatingUser_length", userIndex)
        // if (speedDatingUser.length > userIndex) {
        //     this.state.userIndex++;
        //     this.setState({
        //         userIndex: this.state.userIndex,
        //         isloading: false
        //     })
        // }
        // else {
        //     alert("user is not found")
        // }
    }
    render() {
        const { isloading, userIndex } = this.state;
        console.log("userIndex", userIndex)
        if (isloading) {
            return <Loading />
        }
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
                    userId={this.state.speedDatingUser[userIndex].userId}
                    isloading={this.state.isloading}
                    callnextuserforspeedDating={this.callnextuserforspeedDating.bind(this)}
                    speeddatingfeedback={this.speeddatingfeedback.bind(this)}
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