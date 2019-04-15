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

import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk'

class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentWillReceiveProps(nextprops, nextState) {
        let is_visitedquestionAnswer = nextprops.question;
        let is_userUpdateProfile= nextprops.visitprofile;
        var userId = nextprops && nextprops.data && nextprops.data._id  ? nextprops.data._id : null;
       var isBlocked = nextprops && nextprops.data && nextprops.data.isBlocked  ? nextprops.data.isBlocked : false;
        console.log("userId", userId)

        isBlocked ? this.props.navigation.navigate('userblocked', { message: "You are temprary blocked by admin"}) 
        :
        nextprops.needSignIn ? this.props.navigation.navigate('appstack') 
        : 
        !is_userUpdateProfile ? this.props.navigation.navigate('basicinfo')
        :
        !is_visitedquestionAnswer ? this.props.navigation.navigate('questionnaire') 
        : 
        this.props.navigation.navigate('homePage')
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
