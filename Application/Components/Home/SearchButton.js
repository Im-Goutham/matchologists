import React, { Component } from "react";
import { View, Text, FlatList, Image, StyleSheet, TextInput, Platform, TouchableOpacity, } from "react-native";
import metrics from '../../config/metrics';
const IS_ANDROID = Platform.OS === 'android'

export default class SearchButton extends Component {
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
                    top: IS_ANDROID ? metrics.DEVICE_HEIGHT * 0.08 : (Platform.Version <= '10.3.3' ?  metrics.DEVICE_HEIGHT * 0.1 : metrics.DEVICE_HEIGHT * 0.12),
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
                <TouchableOpacity onPress={() => navigation.navigate('searchmember')}
                    activeOpacity={1}
                    style={{
                        flex: 1,
                        justifyContent: "center",
                    }}>
                    <Text style={{
                        fontFamily: 'Avenir-Light',
                        fontSize: 15,
                        color: "#909096",
                        lineHeight: 22,
                    }}>Search ...</Text>
                </TouchableOpacity>
                {/* <TextInput
                    placeholder="Search ..."
                    ref={(ref) => this.textInputRef = ref}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    style={{
                        height: 40,
                        flex: 1,
                        backgroundColor: 'transparent'
                    }}
                    underlineColorAndroid={'transparent'}
                    placeholderTextColor={'#909096'}
                    selectionColor={'#909096'}
                    onFocus={() => this.setState({ isFocused: true })}
                    onBlur={() => this.setState({ isFocused: false })}
                /> */}
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