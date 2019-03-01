/* 
AuthLoadingScreen
author : abhishek kalia
 */
import React from 'react';
import { AppState } from 'react-native';
import { connect } from "react-redux";
import Loading from '../Components/Loading';
import SocketChat from '../Components/Common/client'

import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk'

class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appState: AppState.currentState,
        };
    }
    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);

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
		// if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
			//   console.log('App has come to the foreground!', nextAppState);
		// }
		if (this.state.appState.match(/active/) && nextAppState === ('inactive'||'background')) {
			console.log('current_state', nextAppState);
			SocketChat.userdisConnect()
		}
		this.setState({ appState: nextAppState });
	};
    componentWillReceiveProps(nextprops, nextState) {
        let is_visitedquestionAnswer = nextprops.question;
        let is_userUpdateProfile= nextprops.visitprofile;

        nextprops.needSignIn ? this.props.navigation.navigate('appstack') 
        : 
        !is_userUpdateProfile ? this.props.navigation.navigate('basicinfo')
        :
        !is_visitedquestionAnswer ? this.props.navigation.navigate('questionnaire') 
        : 
        this.props.navigation.navigate('message')
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
        email: !state.auth.email,
        needSignIn: !state.auth.token,
        question: state.question.number,
        visitprofile: state.auth.is_visitProfile

    }
}

export default connect(mapStateToProps)(AuthLoadingScreen);
