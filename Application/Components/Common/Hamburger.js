import React, { Component } from 'react';
import {Image, Animated, Easing} from 'react-native'
import LottieView from 'lottie-react-native';
import metrics from '../../config/metrics';
const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.05
const header_height = metrics.DEVICE_HEIGHT * 0.1

class Close extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          progress: new Animated.Value(0),
        };
      }
    
      componentDidMount() {
        Animated.timing(this.state.progress, {
          toValue: 1,
          duration: 5000,
          easing: Easing.linear,
        }).start();
      }
    
    render() {
        return (
            <LottieView
                speed={100}
                duration={800}
                resizeMode="contain"
                style={{
                    width: 30,
                    height: 30
                }}
                progress={this.state.progress}
                source={require('../../jsoncontainer/menu_switch.json')}
                autoPlay
                loop={false}
            />
        );
    }
}
class Menu extends React.Component {
    componentDidMount() {
        // this.animation.play();
        // this.animation.play(30, 120);
      }
    
    render() {
        return (
            <Image
                source={require('../../images/menu.png')}
                style={{
                    width: metrics.DEVICE_WIDTH * 0.0588,
                    height: metrics.DEVICE_HEIGHT * 0.023
                }}
                resizeMethod="resize"
                resizeMode="contain" />
            // <LottieView
            // ref={animation => {
            //     this.animation = animation;
            //   }}
            //     speed={100}
            //     duration={800}
            //     resizeMode="contain"
            //     style={{
            //         width: 30,
            //         height: 30
            //     }}
            //     imageAssetsFolder={'../../jsoncontainer/location/AE/location.aep'}
            //     // source={require('../../jsoncontainer/menu_switch.json')}
            //     // source={require('../../jsoncontainer/location/AE/location.aep')}
            //     autoPlay
            //     loop={false}
            // />
        );
    }
}
export { Close, Menu };
