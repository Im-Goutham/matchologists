/* 
navigation
author : abhishekkalia
 */
import React, { Component } from "react";
import {  Platform, AppState , TextInput, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';

import { createStackNavigator } from 'react-navigation';
import AuthScreen from '../Components/AuthScreen'
import LoginForm from '../Components/AuthScreen/LoginForm';
import SignupForm from '../Components/AuthScreen/SignupForm';
import ForgotPassword from '../Components/AuthScreen/ForgotPassword'
import Questionnaire from '../Components/Questionnaire'
import ProfileScreen from '../Components/Profile';
import AppDrawerNavigator from './Appdrawer';
import I18n from '../i18n/I18n';
import Basicinfo from '../Components/Basicinfo'
import Messagebar from '../Components/MessageBar'
import NotifService from '../Components/Pushcontroller/index';
import appConfig from '../../app.json';

function forVertical(props) {
    const { layout, position, scene } = props;
    const index = scene.index;
    const height = layout.initHeight;

    const translateY = 0;
    const translateX = position.interpolate({
        inputRange: ([index - 1, index, index + 1]),
        outputRange: ([height, 0, 0]),
    });
    const opacity = position.interpolate({
        inputRange: [index - 0.5, index],
        outputRange: [0.5, 1],
        extrapolate: 'clamp'
    });

    return { opacity, transform: [{ translateX }, { translateY }] };
}


const AppStack = createStackNavigator(
    {
        home: { screen: AppDrawerNavigator },
        auth: { screen: AuthScreen },
        login: { screen: LoginForm },
        signup: { screen: SignupForm },
        forgotpassword: { screen: ForgotPassword },
        profile: { screen: ProfileScreen },
        questionnaire: { screen: Questionnaire },
        basicinfo: { screen: Basicinfo },
        msg: { screen: Messagebar }
    },
    {
        mode: "modal",
        initialRouteName: 'home',
        headerMode: "screen",
        navigationOptions: {
            header: null,
            gesturesEnabled: false,
        },
        transitionConfig: () => (Platform.OS === "ios" ? { screenInterpolator: forVertical } : {}),
        cardStyle: Platform.OS === "ios" ? { backgroundColor: "#FFF" } : {},
    }
);
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            senderId: appConfig.senderID,
            appState: AppState.currentState
        };
        this.notif = new NotifService(this.onRegister.bind(this), this.onNotif.bind(this));
    }
    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }
    _handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            console.log('App has come to the foreground! abhi', AppState.currentState)
        }
        this.setState({ appState: nextAppState });
    }
    onRegister(token) {
        Alert.alert("Registered !", JSON.stringify(token));
        console.log(token);
        this.setState({ registerToken: token.token, gcmRegistered: true });
    }
    onNotif(notif) {
        console.log(notif);
        // Alert.alert(notif.title, notif.message);
    }
    handlePerm(perms) {
        Alert.alert("Permissions", JSON.stringify(perms));
    }
    render() {
        return (
            <View style={styles.container}>
            <Text style={styles.title}>Example app react-native-push-notification</Text>
            <View style={styles.spacer}></View>
            <TextInput style={styles.textField} value={this.state.registerToken} placeholder="Register token" />
            <View style={styles.spacer}></View>
    
            <TouchableOpacity style={styles.button} onPress={() => { this.notif.localNotif() }}><Text>Local Notification (now)</Text></TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => { this.notif.scheduleNotif() }}><Text>Schedule Notification in 30s</Text></TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => { this.notif.cancelNotif() }}><Text>Cancel last notification (if any)</Text></TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => { this.notif.cancelAll() }}><Text>Cancel all notifications</Text></TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => { this.notif.checkPermission(this.handlePerm.bind(this)) }}><Text>Check Permission</Text></TouchableOpacity>
    
            <View style={styles.spacer}></View>
            <TextInput style={styles.textField} value={this.state.senderId} onChangeText={(e) => {this.setState({ senderId: e })}} placeholder="GCM ID" />
            <TouchableOpacity style={styles.button} onPress={() => { this.notif.configure(this.onRegister.bind(this), this.onNotif.bind(this), this.state.senderId) }}><Text>Configure Sender ID</Text></TouchableOpacity>
            {this.state.gcmRegistered && <Text>GCM Configured !</Text>}
    
            <View style={styles.spacer}></View>
          </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
    button: {
      borderWidth: 1,
      borderColor: "#000000",
      margin: 5,
      padding: 5,
      width: "70%",
      backgroundColor: "#DDDDDD",
      borderRadius: 5,
    },
    textField: {
      borderWidth: 1,
      borderColor: "#AAAAAA",
      margin: 5,
      padding: 5,
      width: "70%"
    },
    spacer: {
      height: 10,
    },
    title: {
      fontWeight: "bold",
      fontSize: 20,
      textAlign: "center",
    }
  });

export default App;
