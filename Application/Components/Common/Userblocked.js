import React from 'react';
import { View, Image, Animated, Easing, Text } from 'react-native'
import LottieView from 'lottie-react-native';

export default class Userblocked extends React.Component {
    render() {
        const { state } = this.props.navigation;
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFF" }}>
                <View style={{ width: 200, height: 200, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: "#273174", fontSize: 17, fontFamily: 'Avenir-Medium' }}>{state.params.message}</Text>
                </View>
                <View style={{ width: 200, height: 200, justifyContent: "center", alignItems: "center" }}>
                    <LottieView
                        speed={500}
                        duration={1000}
                        resizeMode="contain"
                        style={{}}
                        source={require('../../jsoncontainer/1860-lock.json')}
                        autoPlay
                        loop={true}
                    />
                </View>

            </View>
        );
    }
}