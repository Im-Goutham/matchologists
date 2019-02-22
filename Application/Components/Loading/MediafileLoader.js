import React from 'react';
import { View } from 'react-native'
import LottieView from 'lottie-react-native';
export default class MediafileLoader extends React.Component {
    render() {
        return (
            // <View style={{ flex: 1, justifyContent: "center", alignItems: "center", position:'absolute', zIndex: 1 }}>
                <LottieView
                    speed={500}
                    duration={1000}
                    resizeMode="contain"
                    style={{
                        position:'absolute', zIndex: 1,
                        alignSelf:"center",
                        width: 100,
                        height: 100
                    }}
                    // progress={this.state.progress}
                    source={require('../../jsoncontainer/cloud_loader.json')}
                    autoPlay
                    loop={true}
                />
            // </View>

        );
    }
}