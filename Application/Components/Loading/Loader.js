import React from 'react';
import { View, Image, Animated, Easing } from 'react-native'
import LottieView from 'lottie-react-native';

export default class Loader extends React.Component {
    render() {
        return (
                <LottieView
                    speed={500}
                    duration={1000}
                    resizeMode="contain"
                    style={{
                        width: 200,
                        height: 200
                    }}
                    // progress={this.state.progress}
                    source={require('../../jsoncontainer/preloader.json')}
                    autoPlay
                    loop={true}
                />
        );
    }
}