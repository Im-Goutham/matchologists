import React, { Component } from 'react';
import { connect } from "react-redux";

import {
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Platform,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Alert
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import I18n from 'react-native-i18n';
import { Image, View, Text } from 'react-native-animatable'
import BaseFormComponent from "../Common/BaseFormComponent";
import Modal from "react-native-modal";
import Loader from '../Loading/Loader'

import Apirequest from "../Common/Apirequest";
import * as global from '../../../global.json'
import * as app from '../../../app.json'
import CustomButton from '../CustomButton'
import CustomTextInput from '../CustomTextInput'
const formStyle = { marginTop: 40 };
let IS_ANDROID = Platform.OS === 'android'

class Changepassword extends BaseFormComponent {
    constructor(props) {
        super(props);
        this.state = {
            oldpassword: "",
            newpassword: "",
            is_Loading: false
        }
    }
    validation() {
        const { oldpassword, newpassword } = this.state;
        const { language } = this.props;
        if (!oldpassword.length) {
            this.showSimpleMessage("info", { backgroundColor: global.gradientsecondry }, I18n.t('validation.oldpasswordlabel', { locale: language }), I18n.t('validation.oldpasswordtitle', { locale: language }))
            return false
        }
        if (!newpassword.length) {
            this.showSimpleMessage("info", { backgroundColor: global.gradientsecondry }, I18n.t('validation.newpasswordlabel', { locale: language }), I18n.t('validation.newpasswordtitle', { locale: language }))
            return false
        }
        return true;
    }
    submitchangePassword = () => {
        const { oldpassword, newpassword } = this.state;
        let details = {
            "oldPassword": oldpassword,
            "newPassword": newpassword
        };

        if (this.validation()) {
            console.log("details", details)
            this.setState({ is_Loading: !this.state.is_Loading })
            Apirequest.changePassword(this.props.token, details, resolve => {
                this.showSimpleMessage("info", { backgroundColor: global.gradientsecondry }, resolve.message ? resolve.message : '', '')
                this.setState({
                    oldpassword: "",
                    newpassword: "",
                    is_Loading: false
                })
                Alert.alert( app.name,
                    resolve.message ? resolve.message : '',
                    [
                        {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                        },
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ],
                    { cancelable: false })

            }, reject => {
                this.showSimpleMessage("info", { backgroundColor: global.gradientsecondry }, reject.message ? reject.message : '', '')
                this.setState({ is_Loading: false })
                console.log("changePassword_reject", reject)

            })
        }
    }

    render() {
        const { goBack } = this.props.navigation,
            { isLoading, language } = this.props,
            { oldpassword, newpassword } = this.state;
        return (
            <LinearGradient colors={[global.gradientprimary, global.gradientsecondry]} style={{ flex: 1 }}>
                <StatusBar backgroundColor="#DB3D88" barStyle="light-content" />
                <SafeAreaView />
                <View style={{ flexDirection: "row", height: IS_ANDROID ? 59 : 69, backgroundColor: 'transparent', alignItems: IS_ANDROID ? 'center' : "flex-end" }}>
                    <TouchableOpacity onPress={() => goBack()} style={styles.backbuttonContainer}>
                        <Image
                            source={require('../../images/icons/backbutton.png')}
                            style={{ width: 25, height: 17 }}
                            resizeMethod="resize"
                            resizeMode="contain" />
                    </TouchableOpacity>
                    <View style={styles.forgot_container}>
                        <Text style={styles.forgotpasswordtitle}>{I18n.t('changepasswordHeader', { locale: language })}</Text>
                    </View>
                    <View style={{ width: "15%" }} />
                </View>
                <ScrollView style={styles.container}>
                    <View style={{ backgroundColor: "transparent", justifyContent: "space-around", alignItems: "center", paddingVertical: 30 }}>
                        {/* <Text
                            ref={(ref) => this.linkRef = ref}
                            style={styles.welcomeText}
                            animation={'fadeIn'}
                            duration={600}
                            delay={400}>
                            {I18n.t('forgotpasswordtitle', { locale: language })}
                        </Text> */}
                    </View>
                    <KeyboardAvoidingView
                        keyboardVerticalOffset={-100}
                        behavior={'padding'}
                    // style={[formStyle]}
                    >

                        <View ref={(ref) => { this.formRef = ref }}
                            animation={'fadeIn'}
                            style={[styles.form]}>
                            <View style={formStyle} />
                            <Text style={styles.label}>{I18n.t('oldpasswordlabel', { locale: language })}</Text>
                            <CustomTextInput style={{ minHeight: 42 }}
                                name={'oldpassword'}
                                ref={(ref) => this.oldpasswordinput = ref}
                                value={oldpassword}
                                keyboardType={'default'}
                                editable={!isLoading}
                                onSubmitEditing={() => this.newpasswordinput.focus()}
                                blurOnSubmit={false}
                                returnKeyType={'next'}
                                withRef={true}
                                onChangeText={(oldpassword) => this.setState({ oldpassword: oldpassword })}
                                isEnabled={!isLoading}
                            />
                            <View style={{ height: 8 }} />
                            <Text style={styles.label}>{I18n.t('newpasswordlabel', { locale: language })}</Text>
                            <CustomTextInput style={{ minHeight: 42 }}
                                name={'newpassword'}
                                ref={(ref) => this.newpasswordinput = ref}
                                value={newpassword}
                                keyboardType={'default'}
                                editable={!isLoading}
                                returnKeyType={'done'}
                                withRef={true}
                                onChangeText={(newpassword) => this.setState({ newpassword: newpassword })}
                                isEnabled={!isLoading}
                            />
                            <LinearGradient
                                colors={['rgb(220,57, 134)', 'rgb(40,40,120)']}
                                start={{ x: 0, y: 1 }}
                                end={{ x: 1, y: 1 }} style={styles.loginButton}>
                                <CustomButton
                                    onPress={() => this.submitchangePassword()}
                                    isLoading={isLoading}
                                    textStyle={styles.loginButtonText}
                                    text={I18n.t('sendbutton', { locale: language })} />
                            </LinearGradient>
                        </View>
                    </KeyboardAvoidingView>

                </ScrollView>
                <Modal
                    isVisible={this.state.is_Loading}
                    scrollTo={this.handleScrollTo}
                    style={{ margin: 0, justifyContent: "center", alignItems: "center" }}>
                    <Loader />
                </Modal>
            </LinearGradient>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    backbuttonContainer: {
        width: "20%",
        height: 42,
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "center"
    },
    forgot_container: {
        width: "65%",
        height: 42,
        backgroundColor: "transparent",
        alignItems: "center",
        justifyContent: "center"
    },
    form: {
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
        paddingHorizontal: 16
    },
    forgotpasswordtitle: {
        fontFamily: "Avenir-Heavy",
        fontSize: 24,
        color: "rgba(255,255, 255, 100)"
    },
    label: {
        lineHeight: 15,
        color: "#D43C87",
        fontFamily: "Avenir-Medium",
        fontSize: 11,
        paddingHorizontal: IS_ANDROID ? 3 : 0
    },
    loginButton: {
        borderRadius: 5,
        marginTop: 32,
        marginBottom: 20,
    },
    loginButtonText: {
        color: '#fff',
        fontFamily: "Avenir-Heavy",
        fontSize: 17
    },
    welcomeText: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontFamily: "Avenir-Medium",
        fontSize: 17,
    }
})
mapStateToProps = (state) => {
    return {
        language: state.language.defaultlanguage,
        data: state.auth.data,
        token: state.auth.token
    }
}
export default connect(mapStateToProps)(Changepassword);
