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
    ScrollView,
    Alert,
} from 'react-native';
import io from 'socket.io-client'; // 2.0.4
import TimerMixin from 'react-timer-mixin';

import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient';
import BaseFormComponent from '../Common/BaseFormComponent';
import i18n from 'react-native-i18n';
import Loading from '../Loading'
import Header from '../Common/Header';
import SpeeddatingliveCall from "../Chatroom/SpeeddatingliveCall";
import SpeedDatingUser from './SpeedDatingUser';
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
    userInterval() {
        TimerMixin.setTimeout(() => {
            this.callnextuserforspeedDating()
        }, 500);
        
    }
    componentDidMount = async () => {
        var data = "5ca19973992b010533f3cd91";
        this.getUsersPairForSpeedDating(data)
        // this.callnextuserforspeedDating()
    }
    getUsersPairForSpeedDating(speedDatingEventDayId) {
        let data = {
            "speedDatingEventDayId": speedDatingEventDayId
        }
        // console.log("getUsersPairForSpeedDating", data)
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
                    this.setState({
                        speedDatingUser: speedDatingUsers,
                    }, () => this.sendNotificationForVideoCall())
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
    sendNotificationForVideoCall() {
        const { speedDatingUser, userIndex } = this.state;
        console.log("callReceiverId", speedDatingUser[userIndex])
        var callReceiverId = speedDatingUser[userIndex].userId
        var token = this.props.token;
        var data = {
            "callReceiverId": callReceiverId
        }
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
    userCancelForSpeedDating=()=>{
        Alert.alert(
            i18n.t('appname'),
            'if you cancel you have to wait 7 min to connect next user ',
            [
                { text: 'OK', onPress: () => this.userInterval() },
            ],
            { cancelable: false },
        );
    }
    callnextuserforspeedDating = () => {
        this.setState({
            isloading: true
        })
        Alert.alert(
            i18n.t('appname'),
            'Would you like to connect next User',
            [
                { text: 'Ask me later', onPress: () => console.log('Ask me later pressed') },
                {
                    text: 'Cancel',
                    onPress: () => this.userCancelForSpeedDating(),
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => this.getNextUser() },
            ],
            { cancelable: false },
        );
    }
    getNextUser = () => {
        const { speedDatingUser, userIndex } = this.state;
        console.log("speedDatingUser_length", userIndex)
        if (speedDatingUser.length > userIndex) {
            this.state.userIndex++;
            this.setState({
                userIndex: this.state.userIndex,
                isloading: false
            })
        }
        else {
            alert("user is not found")
        }
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