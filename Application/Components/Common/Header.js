import React, { Component } from 'react';
import { Platform, StyleSheet, Text, Image } from 'react-native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'

import LinearGradient from 'react-native-linear-gradient';
import { View } from 'react-native-animatable';
let IS_ANDROID = Platform.OS === 'android'
export default class Header extends Component {
    render() {
        return (
            <LinearGradient
                colors={['#DB3D88', '#273174']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
                style={{ height: IS_ANDROID ? 54 : 74, flexDirection: "row" }}>
                {this.props.left}
                {this.props.middle}
                {this.props.right}
            </LinearGradient>
        )
    }
} 