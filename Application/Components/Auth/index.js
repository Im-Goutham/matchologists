import React, { Component } from 'react'
import AuthScreen from '../AuthScreen'
import Chatroom from '../Chatroom'
import I18n from '../../i18n/I18n';

/**
 * The root component of the application.
 * In this component I am handling the entire application state, but in a real app you should
 * probably use a state management library like Redux or MobX to handle the state (if your app gets bigger).
 */
export class Auth extends Component {
    state = {
        isLoggedIn: false, // Is the user authenticated?
        isLoading: false, // Is the user loggingIn/signinUp?
        isAppReady: false // Has the app completed the login animation?
    }

    /**
     * Two login function that waits 1000 ms and then authenticates the user succesfully.
     * In your real app they should be replaced with an API call to you backend.
     */
    _simulateLogin = (username, password) => {
        this.setState({ isLoading: true })
        setTimeout(() => this.setState({ isLoggedIn: true, isLoading: false }), 1000)
    }

    _simulateSignup = (username, password, fullName) => {
        this.setState({ isLoading: true })
        setTimeout(() => this.setState({ isLoggedIn: true, isLoading: false }), 1000)
    }

    /**
     * Simple routing.
     * If the user is authenticated (isAppReady) show the Chatroom, otherwise show the AuthScreen
     */
    render() {
        if (this.state.isAppReady) {
            return (
                <Chatroom
                    logout={() => this.setState({ isLoggedIn: false, isAppReady: false })}
                />
            )
        } else {
            return (
                <AuthScreen
                    login={this._simulateLogin}
                    signup={this._simulateSignup}
                    isLoggedIn={this.state.isLoggedIn}
                    isLoading={this.state.isLoading}
                    onLoginAnimationCompleted={() => this.setState({ isAppReady: true })}
                />
            )
        }
    }
}

export default Auth