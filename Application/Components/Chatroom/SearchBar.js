
import React, { Component } from "react";
import { View, Image, StyleSheet, TextInput, Platform } from "react-native";
import metrics from '../../config/metrics';
const IS_ANDROID = Platform.OS === 'android'

export default class SearchBar extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={{
                    paddingHorizontal: 10,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <Image
                        source={require('../../images/icons/search.png')}
                        style={styles.icon}
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
                        style={styles.textinput}
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
    container: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
        position: "absolute",
        zIndex: 1,
        top: IS_ANDROID ? metrics.DEVICE_HEIGHT * 0.08 : (Platform.Version <= '10.3.3' ? metrics.DEVICE_HEIGHT * 0.1 : metrics.DEVICE_HEIGHT * 0.12),
        width: metrics.DEVICE_WIDTH - 30,
        alignSelf: "center",
        backgroundColor: '#FFF',
        borderRadius: 5,
        height: 40,
        flexDirection: "row"
    },
    icon: {
        height: 20,
        width: 20,
    },
    textInput: {
            height: 40,
            flex: 1,
    },
    list: {
    }
})
