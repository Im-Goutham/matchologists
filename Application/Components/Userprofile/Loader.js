import React from 'react';
import LottieView from 'lottie-react-native';

export default class Loader extends React.Component {
    render() {
        return (
            <LottieView
                resizeMode="contain"
                style={{ 
                    // backgroundColor: "#fff", 
                    width: 100,
                    height : 100 
                }}
                source={require('../../jsoncontainer/material_wave_loading.json')}
                autoPlay
                loop
            />
        );
    }
}