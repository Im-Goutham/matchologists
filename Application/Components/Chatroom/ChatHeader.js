import React, { Component } from 'react';
import { Platform, StyleSheet, Text, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { View } from 'react-native-animatable';
import metrics from '../../config/metrics';
const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.47
const header_height = 56//54//metrics.DEVICE_HEIGHT * 0.11

let IS_ANDROID = Platform.OS === 'android'
export default class ChatHeader extends Component {
    render() {
        const {isSearcrchbar, tabbar} = this.props;
        return (
            // <LinearGradient
            //     colors={['#DB3D88', '#273174']}
            //     start={{ x: 0, y: 1 }}
            //     end={{ x: 1, y: 1 }}
            //     style={{
            //         height: (tabbar ? 96 : (isSearcrchbar ? 76 : 66)) ,  
            //         // height: (IS_ANDROID ? (tabbar ? 96 : header_height) : (tabbar ? 96 : (isSearcrchbar ? 76 : 66))) , 
            //         justifyContent : isSearcrchbar ? 'flex-start' : "center" }}>
                <View style={{ height: 66, flexDirection: "row", alignContent:"center", backgroundColor:"transparent" }}>
                    {this.props.left}
                    {this.props.middle}
                    {this.props.right}
                </View>
                // {
                //     this.props.tabbar
                // }
            // </LinearGradient>
        )
    }
} 