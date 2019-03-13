/* 
AuthLoadingScreen
author : abhishek kalia
 */
import React from 'react';
import { AppState } from 'react-native';
import { connect } from "react-redux";
import io from 'socket.io-client';

import Loading from '../Components/Loading';
import { baseurl as URL } from '../../app.json';
// import SocketChat from '../Components/Common/client'

import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk'

class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        // this.socket = io(URL); 
        // this.socket.on('testSocket', (data) => { console.log(data)})
        this.state = {
            appState: AppState.currentState,
        };
    }
    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
// console.log("this.socket", this.socket)
        // facebook refresh token
        // AccessToken.refreshCurrentAccessTokenAsync()
        //     .then((FBTokenObject) => {
        //         let FBToken = FBTokenObject.accessToken
        //         console.log("hello abhishek this is face book", FBTokenObject)
        //     })

    }
    componentWillUnmount() {
		AppState.removeEventListener('change', this._handleAppStateChange);
	}
	_handleAppStateChange = (nextAppState) => {
        console.log('current_state', nextAppState);

        // var userId = this.props && this.props.data && this.props.data._id  ?this.props.data._id : null;
        // console.log("userId", userId)
		// if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
			//   console.log('App has come to the foreground!', nextAppState);
		// }
		if (this.state.appState.match(/active/) && nextAppState === ('inactive'||'background')) {
            console.log('current_state', nextAppState);
            // this.socket.emit('userDisconnect', {userId : "userId" }); 
			// SocketChat.userdisConnect()
		}
		this.setState({ appState: nextAppState });
	};
    componentWillReceiveProps(nextprops, nextState) {
        let is_visitedquestionAnswer = nextprops.question;
        let is_userUpdateProfile= nextprops.visitprofile;
        var userId = nextprops && nextprops.data && nextprops.data._id  ? nextprops.data._id : null;
        console.log("userId", userId)

        nextprops.needSignIn ? this.props.navigation.navigate('appstack') 
        : 
        !is_userUpdateProfile ? this.props.navigation.navigate('basicinfo')
        :
        !is_visitedquestionAnswer ? this.props.navigation.navigate('questionnaire') 
        : 
        this.props.navigation.navigate('setting')
    }
    render() {
        const { loading } = this.props
        return (
            <>
                {
                    loading
                        ?
                        <Loading />
                        :
                        undefined
                }
            </>
        );
    }
}
mapStateToProps = (state) => {
    return {
        loading: !state.storage.storageLoaded,
        data: state.auth.data,
        email: !state.auth.email,
        needSignIn: !state.auth.token,
        question: state.question.number,
        visitprofile: state.auth.is_visitProfile,


    }
}

export default connect(mapStateToProps)(AuthLoadingScreen);
