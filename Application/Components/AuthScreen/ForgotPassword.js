import React, { Component } from 'react';
import { connect } from "react-redux";

import { StyleSheet, SafeAreaView, StatusBar, Platform, TouchableOpacity, ScrollView, KeyboardAvoidingView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import I18n from 'react-native-i18n';
import { Image, View, Text } from 'react-native-animatable'
import BaseFormComponent from "../Common/BaseFormComponent";
import Modal from "react-native-modal";
import Loader from '../Loading/Loader'

import ApiManager from "../Common/ApiManager";
import * as global from '../../../global.json'
import CustomButton from '../CustomButton'
import CustomTextInput from '../CustomTextInput'
const formStyle = { marginTop: 40 };
let IS_ANDROID = Platform.OS === 'android'

class ForgotPassword extends BaseFormComponent {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            is_Loading:false
        }
    }
    validation() {
        const { email } = this.state;
        const { language}= this.props;
        var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!email.length) {
            this.showSimpleMessage("info", { backgroundColor: global.gradientsecondry }, I18n.t('validation.emaillabel', { locale: language }), I18n.t('validation.emailtitle', { locale: language }))
            return false
        }
        if (reg.test(email) === false) {
            this.showSimpleMessage("info", { backgroundColor: global.gradientsecondry },I18n.t('validation.emailvalidlabel', { locale: language }), I18n.t('validation.emailvalidtitle', { locale: language }))
            return false
        }
        return true;
    }
    handleForgotpassword = () => {
        const { email } = this.state;
        let details = {
            'emailId': email
        },
        header = {};
        if (this.validation()) {
            this.setState({is_Loading: !this.state.is_Loading})
            ApiManager.callwebservice('POST', 'api/forgotPasswordMail', header, details, (success) => {
                let response = JSON.parse(success._bodyInit);
                if (response.status === 0) {
                    this.showSimpleMessage("danger", { backgroundColor: "#DC6666" }, response.message, response.message)
                    this.setState({is_Loading: !this.state.is_Loading})
                    return
                }
                this.showSimpleMessage("", { backgroundColor: global.gradientsecondry }, '', response.message)
                this.timeOutCall()
            }, (error) => {
                console.log("error", error)
            })
        }
    }
    timeOutCall() {
        setTimeout(() => {
            this.setState({
                is_Loading: !this.state.is_Loading
            },() => this.props.navigation.navigate('login'))
        }, 1000)
    }

    render() {
        const { goBack } = this.props.navigation,
            { isLoading, language } = this.props,
            { email } = this.state;
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
                        <Text style={styles.forgotpasswordtitle}>{I18n.t('forgotpasswordHeader', { locale: language })}</Text>
                    </View>
                    <View style={{ width: "15%" }} />
                </View>
                <ScrollView style={styles.container}>
                    <View style={{ backgroundColor: "transparent", justifyContent: "space-around", alignItems: "center", paddingVertical: 30 }}>
                        <Text
                            ref={(ref) => this.linkRef = ref}
                            style={styles.welcomeText}
                            animation={'fadeIn'}
                            duration={600}
                            delay={400}>
                            {I18n.t('forgotpasswordtitle', { locale: language })}
                        </Text>
                    </View>
                    <View ref={(ref) => { this.formRef = ref }}
                        animation={'fadeIn'}
                        style={styles.form}>
                        <KeyboardAvoidingView
                            keyboardVerticalOffset={-100}
                            behavior={'padding'}
                            style={[formStyle]}>
                            <Text style={styles.label}>{I18n.t('emaillabel', { locale: language })}</Text>
                            <CustomTextInput style={{ minHeight: 42 }}
                                name={'email'}
                                ref={(ref) => this.emailInputRef = ref}
                                value={email}
                                placeholder={'Email'}
                                keyboardType={'email-address'}
                                editable={!isLoading}
                                returnKeyType={'done'}
                                withRef={true}
                                onChangeText={(email) => this.setState({ email: email })}
                                isEnabled={!isLoading}
                            />
                            <LinearGradient
                                colors={['rgb(220,57, 134)', 'rgb(40,40,120)']}
                                start={{ x: 0, y: 1 }}
                                end={{ x: 1, y: 1 }} style={styles.loginButton}>
                                <CustomButton
                                    onPress={() => this.handleForgotpassword()}
                                    isLoading={isLoading}
                                    textStyle={styles.loginButtonText}
                                    text={I18n.t('sendbutton', { locale: language })}/>
                            </LinearGradient>
                        </KeyboardAvoidingView>
                    </View>
                </ScrollView>
                <Modal
                    isVisible={this.state.is_Loading}
                    scrollTo={this.handleScrollTo}
                    style={{ margin: 0, justifyContent: "center", alignItems: "center" }}>
                    <Loader/>
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
    }
}
export default connect(mapStateToProps)(ForgotPassword);
