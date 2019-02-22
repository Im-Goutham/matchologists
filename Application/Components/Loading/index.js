import React from 'react';
import { View, Image, Animated, Easing } from 'react-native'
import LottieView from 'lottie-react-native';

export default class Loading extends React.Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //       progress: new Animated.Value(0),
    //     };
    //   }

    //   componentDidMount() {
    //     Animated.timing(this.state.progress, {
    //       toValue: 1,
    //       duration: 5000,
    //       easing: Easing.linear,
    //     }).start();
    //   }
    render() {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFF" }}>
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
            </View>
        );
    }
}