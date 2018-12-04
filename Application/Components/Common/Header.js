import React, { Component } from 'react';
import { Platform, StyleSheet, Text, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { View } from 'react-native-animatable';
import metrics from '../../config/metrics';
const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.47
const header_height = metrics.DEVICE_HEIGHT * 0.11

let IS_ANDROID = Platform.OS === 'android'
export default class Header extends Component {
    render() {
        return (
            <LinearGradient
                colors={['#DB3D88', '#273174']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
                style={{ height: IS_ANDROID ? header_height : 74, }}>
                <View style={{ height: 44, flexDirection: "row", alignContent:"center" }}>
                    {this.props.left}
                    {this.props.middle}
                    {this.props.right}
                </View>
            </LinearGradient>
        )
    }
} 