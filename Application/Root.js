import React from "react";
import { View, Platform, Clipboard, AsyncStorage, YellowBox, AppState, Linking, Alert } from "react-native";
import _ from 'lodash';
import i18n from 'react-native-i18n'
import moment from 'moment'
import { StackNavigator, NavigationActions } from 'react-navigation'; // 1.0.3
import './i18n/I18n'
import { Provider } from "react-redux";
import store from "./store";
import App from "./Navigation";
import Messagebar from './Components/MessageBar'
import SplashScreen from 'react-native-splash-screen';
import FCM, { NotificationActionType } from "react-native-fcm";
import Apirequest from '../Application/Components/Common/Apirequest';
import BaseFormComponent from '../Application/Components/Common/BaseFormComponent'

import { registerKilledListener, registerAppListener } from "./Listeners/index";
// import firebaseClient from "./FirebaseClient";
import io from 'socket.io-client'; // 2.0.4
import { baseurl as URL } from '../app.json';

console.ignoredYellowBox = ['Remote debugger'];
console.reportErrorsAsExceptions = false;
registerKilledListener();

YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);

class Root extends BaseFormComponent {
    constructor(props) {
        super(props);
        this.socket = io(URL);
        this.socket.on('connect', () => { });
        // this.socket.on("userConnected", data => {
        //     console.log("userConnected_socket", data)
        // })
        // this.socket.on("userDisconnected", data => {
        //     console.log("userDisconnected_socket", data)
        // })
        this.socket.on("speedDatingEventStarted", data => {
            console.log("userConnect_speedDatingEventStarted", data)
            if (data && data.speedDatingEventDayId) {
               this.getUsersPairForSpeedDating(data.speedDatingEventDayId)
            }
        });
        this.state = {
            token: "",
            tokenCopyFeedback: "",
        };
        SplashScreen.hide();
        this.handleOpenURL = this.handleOpenURL.bind(this);
    }
    // speedDatingUserget = async (speedDatingEventDayId) => {
    //     // const { state } = this.props.navigation;
    //     console.log("speedDatingUserget_state", state)
    //     // var speedDatingEventDayId = state && state.params && state.params.speedDatingEventDayId ? state.params.speedDatingEventDayId : ''
    //     // var speedDatingEventDayId = "5ca19973992b010533f3cd91";
    //     console.log("speedDatingUserget_speedDatingEventDayId", speedDatingEventDayId)
    //     var speeddatingevent,
    //         heighlightedUserIndex;
    //     try {
    //         AsyncStorage.multiGet(["speeddatingevent", "heighlightedUserIndex"], (error, stores) => {
    //             console.log("multiGet_stores", stores)
    //             speeddatingevent = stores && stores[0] && stores[0][1] ? JSON.parse(stores[0][1]) : []
    //             heighlightedUserIndex = stores && stores[1] && stores[1][1] ? JSON.parse(stores[1][1]) : 0
    //             console.log("speeddatingevent", speeddatingevent)

    //             if (Array.isArray(stores) && stores && stores[0] && stores[0][1] && stores[1] && stores[1][1] && heighlightedUserIndex !== '') {
    //                 console.log("speeddatingevent", speeddatingevent)
    //                 console.log("heighlightedUserIndex", heighlightedUserIndex)

    //                 if (speeddatingevent[heighlightedUserIndex] && speeddatingevent[heighlightedUserIndex].callStatus === "completed" && speeddatingevent[heighlightedUserIndex].feedback) {
    //                     this.setState({
    //                         speedDatingUser: speeddatingevent,

    //                     }, () => this.sendNotificationForVideoCall(speeddatingevent, ++heighlightedUserIndex))
    //                 } else {
    //                     this.setState({
    //                         speedDatingUser: speeddatingevent,
    //                     }, () => this.sendNotificationForVideoCall(speeddatingevent, heighlightedUserIndex))
    //                 }
    //             } else {
    //                 this.getUsersPairForSpeedDating(speedDatingEventDayId)
    //             }
    //         })

    //     } catch (error) {
    //         console.log("speeddatingevent_error", error)
    //     }
    // }
    getUsersPairForSpeedDating = async(speedDatingEventDayId)=> {
        let data = {
            "speedDatingEventDayId": speedDatingEventDayId
        };
       var token = await  AsyncStorage.getItem('token')
       if(token){
        token = JSON.parse(token)
       }
        // console.log("AsyncStorage_userId=========>" , token)
        var notificationdate = new Date();
        // var token = this.props.token;
        var speedDatingUsers = [];
        console.log("getUsersPairForSpeedDating_data", data)

        await Apirequest.getUsersPairForSpeedDating(token, data, resolve => {
            console.log("getUsersPairForSpeedDating_resolve", resolve)
            if (resolve.data) {
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
                        return key == 0 ? { ...obj, callStatus: "pending", feedback: false, notificationDateTime: notificationdate } : { ...obj, callStatus: "pending", feedback: false, notificationDateTime: notificationdate }
                    });
                    console.log("CurrentspeedDatingusers", CurrentspeedDatingusers)
                    var heighlightedUserIndex = 0
                    this.speedDatingUserStore(CurrentspeedDatingusers, heighlightedUserIndex, speedDatingEventDayId, token)
                } else {
                        speedDatingUser = [];
                }
            }
        }, reject => {
            console.log("getSpeedDatingEvents_reject", reject)
        })
    }
    speedDatingUserStore = async (speeddatingusers, heighlightedUserIndex, speedDatingEventDayId, token) => {
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
                        this.sendNotificationForVideoCall(speeddatingevent, heighlightedUserIndex, speedDatingEventDayId, token)
                    }
                })
            });

        } catch (error) {
            console.log("error", error)
        }
    }
    sendNotificationForVideoCall(speedDatingUser, userIndex, speedDatingEventDayId, token) {
        console.log("speedDatingUser", speedDatingUser)
        console.log("userIndex", userIndex)
        // var callReceiverId = _.filter(speedDatingUser, (obj) => { return obj.isHighlight })
        callReceiverId = Array.isArray(speedDatingUser) && speedDatingUser[userIndex] && speedDatingUser[userIndex].userId ? speedDatingUser[userIndex].userId : ''
        console.log("callReceiverId", callReceiverId)
        // var token = this.props.token;
        var data = {
            "callReceiverId": callReceiverId,
            "type": 'speeddatingcall',
            "eventDayId": speedDatingEventDayId
        }
        console.log("sendNotificationForVideoCall_speedDatingUser", data)
        Apirequest.sendNotificationForSpeedDatingCall(token, data, resolve => {
            console.log("sendNotificationForVideoCall_resolve", resolve)
            if (resolve.message) {
                this.showSimpleMessage("", { backgroundColor: global.gradientsecondry }, "", resolve.message)
                Alert.alert(
                    i18n.t('appname'),
                    `Speed dating event is started, would you like to navigate to notification screen ?`,[
                        {
                            text: 'Cancel',
                            onPress: () => console.log("cancel press"),
                            style: 'cancel',
                        },
                        { text: 'OK', onPress: () => this.navigator.dispatch({
                            type: NavigationActions.NAVIGATE,
                            routeName: 'notification',
                            params: { speedDatingEventDayId: data.speedDatingEventDayId }
                        })
                    }],
                    { cancelable: false },
                );
            }
        }, reject => {
            console.log("sendNotificationForVideoCall_reject", reject)
            if (reject && reject.message) {
                this.showSimpleMessage("", { backgroundColor: global.gradientsecondry }, "", reject.message)
            }
        })
    }

    getUserData = async (userId) => {
        try {
            const value = await AsyncStorage.getItem('userId');
            if(value){
                return userId(value)
            }
            console.log("useridIS", value)
        } catch (error) {
            console.log("error", error)
        }
    }
    socketconnect = () => {
        this.getUserData(userId => {
            var userData = JSON.parse(userId)
            if (userData && userData._id) {
                var sok = this.socket.emit('userConnect', { userId: userData._id })
                console.log("userConnect", sok)
            }
        })
    }
    _handleAppStateChange = (nextAppState) => {
        console.log("nextAppState", nextAppState)
        if (nextAppState === 'inactive' || nextAppState === 'background') {
            this.socketDisconnect()
        } else if (nextAppState === 'active') {
            this.socketconnect()
        }
    };
    socketDisconnect = async () => {
        this.getUserData(userId => {
            var userData = JSON.parse(userId)
            console.log("socketDisconnect_data", userData._id)
            if (userData && userData._id) {
                var sok = this.socket.emit('userDisconnect', { userId: userData._id })
                console.log("userDisconnect", sok)
            }
        })
    }
    callNavigate(callInitiatorId) {
        this.navigator.dispatch({
            type: NavigationActions.NAVIGATE,
            routeName: 'notification',
            params: { profileUserId: callInitiatorId }
        });
    }
    componentWillUnmount = () => {
        AppState.removeEventListener('change', this._handleAppStateChange);
        Linking.removeEventListener('url', this.handleOpenURL);
    }
    handleOpenURL = (event) => {
        console.log("handleOpenURL_event_before")
        console.log("handleOpenURL_event", event)
        this.navigate(event.url);
    }
    navigate(url) {
        console.log("navigateL_event", url)
        if (!url) return
        const route = url.replace(/.*?:\/\//g, '');
        const id = route.match(/\/([^\/]+)\/?$/)[1];
        const routeName = route.split('/')[0];
        if (routeName === 'setting') {
            this.navigator.dispatch({
                type: NavigationActions.NAVIGATE,
                routeName: 'setting',
                // params: { profileUserId: callInitiatorId }
            });
        };
    }
    // gettimeDifference = () => {
    //     var end = moment.utc();
    //     // var newspeed = this.props.speedDateruserObj;
    //     var duration =  moment.utc("2019-04-12T12:46:45.438Z");
    //     console.log("duration", duration)

    //     duration = end.diff(duration, 'seconds');
    //     console.log("duration/60", duration)

    //     // speeddatingtime = Math.round(duration/60);
    //     // return Math.round(duration/60)
    //     // console.log("speeddatingtime", speeddatingtime)

    // }

    async componentDidMount() {
        // this.gettimeDifference()
    //     console.log("Linking")
    //     var data = {
    //      speedDatingEventDayId : "5ca593b25d631005359bb33d"
    // }
    //     this.getUsersPairForSpeedDating(data.speedDatingEventDayId)

        AppState.addEventListener('change', this._handleAppStateChange);
        if (Platform.OS === 'android') {
            Linking.getInitialURL().then(url => { this.navigate(url) });
        } else {
            Linking.addEventListener('url', this.handleOpenURL);
        }
        this.socketconnect()
        FCM.createNotificationChannel({
            id: 'default',
            name: 'Default',
            description: 'used for example',
            priority: 'high'
        })
        registerAppListener(this.props.navigation, getresult => {
            // console.log("getresult", getresult.aps.alert.title==="videocall" ? undefined : undefined )
            if (getresult && getresult.aps &&getresult.aps.alert && getresult.aps.alert && getresult.aps.alert.title==="videocall" ) {
                Alert.alert(
                    i18n.t('appname'),
                    `${getresult.aps.alert.body} would you like to navigate to notification screen ?`,[
                        {
                            text: 'Cancel',
                            onPress: () => console.log("cancel press"),
                            style: 'cancel',
                        },
                        { text: 'OK', onPress:()=>this.callNavigate(getresult)}
                    ],
                    { cancelable: false },
                );
            }
        });
        FCM.getInitialNotification().then(notif => {
            this.setState({
                initNotif: notif
            });
            if (notif && notif.targetScreen === "detail") {
                setTimeout(() => {
                    this.props.navigation.navigate("Detail");
                }, 500);
            }
        });
        try {
            let result = await FCM.requestPermissions({
                badge: false,
                sound: true,
                alert: true
            });
        } catch (e) {
            console.error(e);
        }
        FCM.getFCMToken().then(token => {
            console.log("TOKEN (getFCMToken)", token);
            this.setState({ token: token || "" });
        });
        if (Platform.OS === "ios") {
            FCM.getAPNSToken().then(token => {
                console.log("APNS TOKEN (getFCMToken)", token);
            });
        }
        // topic example
        FCM.subscribeToTopic('sometopic')
        FCM.unsubscribeFromTopic('sometopic')
    }
    // showLocalNotification() {
    // 	FCM.presentLocalNotification({
    // 		channel: 'default',
    // 		id: new Date().valueOf().toString(), // (optional for instant notification)
    // 		title: "Test Notification with action", // as FCM payload
    // 		body: "Force touch to reply", // as FCM payload (required)
    // 		sound: "bell.mp3", // "default" or filename
    // 		priority: "high", // as FCM payload
    // 		click_action: "com.myapp.MyCategory", // as FCM payload - this is used as category identifier on iOS.
    // 		badge: 10, // as FCM payload IOS only, set 0 to clear badges
    // 		number: 10, // Android only
    // 		ticker: "My Notification Ticker", // Android only
    // 		auto_cancel: true, // Android only (default true)
    // 		large_icon:
    // 			"https://image.freepik.com/free-icon/small-boy-cartoon_318-38077.jpg", // Android only
    // 		icon: "ic_launcher", // as FCM payload, you can relace this with custom icon you put in mipmap
    // 		big_text: "Show when notification is expanded", // Android only
    // 		sub_text: "This is a subText", // Android only
    // 		color: "red", // Android only
    // 		vibrate: 300, // Android only default: 300, no vibration if you pass 0
    // 		wake_screen: true, // Android only, wake up screen when notification arrives
    // 		group: "group", // Android only
    // 		picture:
    // 			"https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_150x54dp.png", // Android only bigPicture style
    // 		ongoing: true, // Android only
    // 		my_custom_data: "my_custom_field_value", // extra data you want to throw
    // 		lights: true, // Android only, LED blinking (default false)
    // 		show_in_foreground: true // notification when app is in foreground (local & remote)
    // 	});
    // }

    // scheduleLocalNotification() {
    // 	FCM.scheduleLocalNotification({
    // 		id: "testnotif",
    // 		fire_date: new Date().getTime() + 5000,
    // 		vibrate: 500,
    // 		title: "Hello",
    // 		body: "Test Scheduled Notification",
    // 		sub_text: "sub text",
    // 		priority: "high",
    // 		large_icon:
    // 			"https://image.freepik.com/free-icon/small-boy-cartoon_318-38077.jpg",
    // 		show_in_foreground: true,
    // 		picture:
    // 			"https://firebase.google.com/_static/af7ae4b3fc/images/firebase/lockup.png",
    // 		wake_screen: true,
    // 		extra1: { a: 1 },
    // 		extra2: 1
    // 	});
    // }

    // sendRemoteNotification(token) {
    // 	let body;

    // 	if (Platform.OS === "android") {
    // 		body = {
    // 			to: token,
    // 			data: {
    // 				custom_notification: {
    // 					title: "Simple FCM Client",
    // 					body: "Click me to go to detail",
    // 					sound: "default",
    // 					priority: "high",
    // 					show_in_foreground: true,
    // 					targetScreen: "detail"
    // 				}
    // 			},
    // 			priority: 10
    // 		};
    // 	} else {
    // 		body = {
    // 			to: token,
    // 			notification: {
    // 				title: "Simple FCM Client",
    // 				body: "Click me to go to detail",
    // 				sound: "default"
    // 			},
    // 			data: {
    // 				targetScreen: "detail"
    // 			},
    // 			priority: 10
    // 		};
    // 	}

    // 	firebaseClient.send(JSON.stringify(body), "notification");
    // }

    // sendRemoteData(token) {
    // 	let body = {
    // 		to: token,
    // 		data: {
    // 			title: "Simple FCM Client",
    // 			body: "This is a notification with only DATA.",
    // 			sound: "default"
    // 		},
    // 		priority: "normal"
    // 	};

    // 	firebaseClient.send(JSON.stringify(body), "data");
    // }

    // showLocalNotificationWithAction() {
    // 	FCM.presentLocalNotification({
    // 		title: "Test Notification with action",
    // 		body: "Force touch to reply",
    // 		priority: "high",
    // 		show_in_foreground: true,
    // 		click_action: "com.myidentifi.fcm.text", // for ios
    // 		android_actions: JSON.stringify([
    // 			{
    // 				id: "view",
    // 				title: "view"
    // 			},
    // 			{
    // 				id: "dismiss",
    // 				title: "dismiss"
    // 			}
    // 		]) // for android, take syntax similar to ios's. only buttons are supported
    // 	});
    // }
    // setClipboardContent(text) {
    // 	Clipboard.setString(text);
    // 	this.setState({ tokenCopyFeedback: "Token copied to clipboard." });
    // 	setTimeout(() => {
    // 		this.clearTokenCopyFeedback();
    // 	}, 2000);
    // }
    // clearTokenCopyFeedback() {
    // 	this.setState({ tokenCopyFeedback: "" });
    // }
    render() {
        let { token, tokenCopyFeedback } = this.state;
        // console.log(JSON.stringify(this.state.initNotif))
        return (
            <Provider store={store}>
                <View style={{ flex: 1 }}>
                    <App {...this.props} ref={nav => (this.navigator = nav)} />
                    <Messagebar />
                </View>
            </Provider>
        );

    }

}
export default Root;