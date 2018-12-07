
import React, { Component } from "react";
import { View, Text, FlatList, Image, StyleSheet, TextInput, Platform, TouchableOpacity, } from "react-native";
import metrics from '../../config/metrics';
import Icons from 'react-native-vector-icons/Feather'
import {
    widthPercentageToDP,
    heightPercentageToDP,
} from 'react-native-responsive-screen';
import userImage from '../../images/Rectangle.png'
import userImage2 from '../../images/Rectangle_2.png'
import userImage3 from '../../images/Rectangle_3.png'
import userImage4 from '../../images/Rectangle_4.png'
import CustomTextInput from '../CustomTextInput'
const IS_ANDROID = Platform.OS === 'android'

const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.47
const IMAGE_HEIGHT = metrics.DEVICE_HEIGHT * 0.284


export default class SearchBar extends Component {
    render() {
        const { isLoading, onLoginLinkPress, onSignupPress, navigation } = this.props
        return (
            <View
                style={{
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                    elevation: 3,
                    position: "absolute",
                    zIndex: 1,
                    top: IS_ANDROID ? metrics.DEVICE_HEIGHT * 0.08 : metrics.DEVICE_HEIGHT * 0.12,
                    width: metrics.DEVICE_WIDTH - 30,
                    alignSelf: "center",
                    backgroundColor: '#FFF',
                    borderRadius: 5,
                    height: 40,
                    flexDirection: "row"
                }} >
                <View style={{
                    paddingHorizontal: 15,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <Image
                        source={require('../../images/icons/search.png')}
                        style={{
                            height: 26,
                            width: 26,
                            backgroundColor: 'transparent',
                        }}
                        resizeMethod="resize"
                        resizeMode="contain" />
                </View>
                <View 
                    style={{
                        flex: 1,
                        justifyContent: "center",
                    }}>
                     <TextInput
                    placeholder="Search ..."
                    ref={(ref) => this.textInputRef = ref}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    style={{
                        height: 40,
                        flex: 1,
                        paddingHorizontal:10
                    }}
                    underlineColorAndroid={'transparent'}
                    placeholderTextColor={'#909096'}
                    selectionColor={'#909096'}
                    onFocus={() => this.setState({ isFocused: true })}
                    onBlur={() => this.setState({ isFocused: false })}
                />
                </View>
            </View>
        )
    }
}
let styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: "#009933",
        borderColor: '#CCC',
    },
    list: {
    }
})
