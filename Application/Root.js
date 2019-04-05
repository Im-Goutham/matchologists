import React from "react";
import { View, Platform, Clipboard, AsyncStorage, YellowBox, AppState, Linking } from "react-native";
import { StackNavigator, NavigationActions } from 'react-navigation'; // 1.0.3
import './i18n/I18n'
import { Provider } from "react-redux";
import store from "./store";
import App from "./Navigation";
import Messagebar from './Components/MessageBar'
import SplashScreen from 'react-native-splash-screen';
import FCM, { NotificationActionType } from "react-native-fcm";
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

class Root extends React.Component {
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
                this.navigator.dispatch({
                    type: NavigationActions.NAVIGATE,
                    routeName: 'speeddatinglivecall',
                    params: { speedDatingEventDayId: data.speedDatingEventDayId }
                });
    
            }
        }
        );

        this.state = {
            token: "",
            tokenCopyFeedback: "",
        };
        SplashScreen.hide();
        this.handleOpenURL = this.handleOpenURL.bind(this);
    }
    getUserData = async (userId) => {
        try {
            const value = await AsyncStorage.getItem('userId');
            return userId(value)
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
            routeName: 'livecall',
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
        if(!url) return
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

    async componentDidMount() {
        console.log("Linking")
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
            console.log("getresult", getresult)
            if (getresult.callInitiatorId) {
                this.callNavigate(getresult.callInitiatorId)
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