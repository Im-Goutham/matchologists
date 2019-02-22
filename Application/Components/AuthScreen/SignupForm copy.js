import React, { Component, PropTypes } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-animatable';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import I18n from 'react-native-i18n';
import { Image, View } from 'react-native-animatable'
import { gradientprimary, gradientsecondry } from '../../../global.json'
import CustomButton from '../CustomButton'
import CustomTextInput from '../CustomTextInput'
import metrics from '../../config/metrics'
import appLogo from '../../../assets/icons/MatchologistsLogoNEW.png'
// // import TouchableView from '../TouchableView.js';
import BaseFormComponent from "../Common/BaseFormComponent";

import CountrySelection from './CountrySelection'
const loginWIDTH = metrics.DEVICE_WIDTH * 0.9
const loginHeight = metrics.DEVICE_HEIGHT * 0.7
const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.6
const formStyle = { marginTop: 40 };
import Modal from "react-native-modal";
import ApiManager from "../Common/ApiManager";

export default class SignupForm extends BaseFormComponent {
    constructor(props) {
        super(props);
        this.state = {
            fullname: '',
            phone_number: '',
            email: '',
            password: '',
            country: '',
            visibleModal: false,
            scrollOffset: '',
            isLoading: false
        }
    }
    handleScrollTo = p => {
        if (this.scrollViewRef) {
            this.scrollViewRef.scrollTo(p);
        }
    };
    handleOnScroll = event => {
        // console.log("event.nativeEvent.contentOffset.y");
        this.setState({
            scrollOffset: event.nativeEvent.contentOffset.y
        });
    };
    validation = () => {
        const { fullname, phone_number, country, email, password } = this.state;

        var email_reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
        var password_xpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,12}$/;

        if (!fullname.length) {
            this.showSimpleMessage("info", { backgroundColor: gradientsecondry }, "Name Is Required", " Please Provide Your FullName")
            return false
        }

        if (!phone_number.length) {
            this.showSimpleMessage("info", { backgroundColor: gradientsecondry }, "Phone Nember Is Required", " Please Provide Your Contact number")
            return false
        }

        if (!country.length) {
            this.showSimpleMessage("info", { backgroundColor: gradientsecondry }, "Country is not Selected", " Please Select your country")
            return false
        }

        if (!email.length) {
            this.showSimpleMessage("info", { backgroundColor: gradientsecondry }, "Email Is Required", " Please Provide Email Address")
            return false
        }

        if (email_reg.test(email) === false) {
            this.showSimpleMessage("info", { backgroundColor: gradientsecondry }, "Email is not valid" , "Please Provide correct email Address")
            return false
        }

        if (!password.length) {
            this.showSimpleMessage("info", { backgroundColor: gradientsecondry }, "Password Is Required", "Please Provide Password")
            return false
        }

        if (password_xpression.test(password) === false) {
            this.showSimpleMessage("info", { backgroundColor: gradientsecondry }, "Password is not valid" , "Please insert at least 1 Character")
            return false
        }

        return true
    }

    onRegister = () =>{
        const { fullname, phone_number, country, email, password } = this.state;
        let contactnumber = country +"-"+ phone_number;
        // alert(contactnumber)
        let details = {
            'emailId': email,
            'password': password,
            'mobile': contactnumber,
            'fullName': fullname,
            'gender': 'male',
            'genderIntrestedIn': 'female',
            'device': 'ios',
            'deviceToken': ''
        };
        if (this.validation()) {
            this.setState({isLoading: !this.state.isLoading})
            ApiManager.callwebservice('POST', 'api/register', details, (success) => {
                let response = JSON.parse(success._bodyInit);
                // console.log(response)
                if(response.status === 0){
                    this.showSimpleMessage("danger", { backgroundColor: "#DC6666" }, response.status, response.message.message.errmsg)
                    return
                }
                this.props.navigation.navigate('profile')
                this.setState({isLoading: !this.state.isLoading})

            }, (error) => {
                console.log("error", error)
            })
        }
    }
    render() {
        const { navigate } = this.props.navigation;
        const { isLoading } = this.state
        return (
            <View style={{ flex: 1 }}>
                <ScrollView bounces={false} contentContainerStyle={styles.container}>
                    <StatusBar backgroundColor="#DB3D88" barStyle="light-content" />
                    <SafeAreaView style={{ backgroundColor: '#DB3D88' }} />
                    <LinearGradient colors={[gradientprimary, gradientsecondry]} style={{ flex: 1 }}>
                        <View style={styles.gradientView}>
                            <Image
                                animation={'bounceIn'}
                                duration={1200}
                                delay={200}
                                ref={(ref) => this.logoImgRef = ref}
                                source={appLogo}
                                style={styles.applogo}
                                resizeMode='contain'
                                resizeMethod='resize'
                            />
                            <Text
                                ref={(ref) => this.linkRef = ref}
                                style={styles.welcomeText}
                                animation={'fadeIn'}
                                duration={600}
                                delay={400}>
                                {I18n.t('welcome')}
                            </Text>
                        </View>
                        <View style={{ flex: 1 }} />
                    </LinearGradient>
                    <View style={{ flex: 1, backgroundColor: "#fff" }}>
                        <View style={{ height: '80%' }} />
                        <View style={{
                            height: '20%',
                            paddingHorizontal: metrics.DEVICE_WIDTH * 0.1,
                            justifyContent: "space-around",
                        }}>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => navigate('login')}
                                style={{ justifyContent: "center", alignItems: "center" }}>
                                <Text style={{
                                    color: "#909096", fontWeight: 'bold',
                                }}>{I18n.t('alreadyhaveanacount')}<Text style={{ fontFamily: "Avenir-Heavy", color: '#5B357A' }}>{I18n.t('Signintitle')}</Text> </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View ref={(ref) => { this.formRef = ref }}
                        animation={'bounceIn'}
                        style={styles.form}>

                        <View style={styles.head}>
                            <KeyboardAvoidingView
                                keyboardVerticalOffset={-100}
                                behavior={'padding'}
                                style={[formStyle, styles.bottom]}
                            >
                                <Text style={{ color: "#D43C87", fontFamily: "Avenir-Medium", fontSize: 11 }}>
                                    {I18n.t('namelabel')}</Text>
                                <CustomTextInput
                                    // style={{ backgroundColor : "#fff" }}
                                    name={'name'}
                                    ref={(ref) => this.nameInputRef = ref}
                                    // placeholder={I18n.t('namelabel')}
                                    value={this.state.fullname}
                                    keyboardType={'default'}
                                    editable={!isLoading}
                                    returnKeyType={'next'}
                                    blurOnSubmit={false}
                                    withRef={true}
                                    onSubmitEditing={() => this.phonenumberInputRef.focus()}
                                    onChangeText={(fullname) => this.setState({ fullname })}
                                    isEnabled={!isLoading}
                                />
                                <Text style={{ color: "#D43C87", fontFamily: "Avenir-Medium", fontSize: 11 }}>
                                    {I18n.t('phonenumberlabel')}</Text>
                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                    <TouchableOpacity onPress={() => this.setState({ visibleModal: true })}
                                        style={{
                                            flexDirection: "row",
                                            // marginHorizontal: 5, 
                                            justifyContent: "center",
                                            backgroundColor: 'rgba(245,245,245, 100)',
                                            height: 42,
                                            borderRadius: 5,
                                            alignItems: "center",
                                            width: 69
                                        }}>
                                        <Text style={{ lineHeight: 23, color: "#909096", fontFamily: "Avenir-Medium", fontSize: 17 }}>
                                            {this.state.country} </Text>
                                        <Image source={require('../../images/icons/down_diamond.png')} style={{ width: 8, height: 4 }} />
                                    </TouchableOpacity>
                                    <CustomTextInput
                                        style={{
                                            width: metrics.DEVICE_WIDTH * 0.57
                                        }}
                                        name={'name'}
                                        ref={(ref) => this.phonenumberInputRef = ref}
                                        // placeholder={I18n.t('phonenumberlabel')}
                                        value={this.state.phone_number}
                                        keyboardType={'numeric'}
                                        editable={!isLoading}
                                        returnKeyType={'next'}
                                        blurOnSubmit={false}
                                        withRef={true}
                                        onSubmitEditing={() => this.emailInputRef.focus()}
                                        onChangeText={(phone_number) => this.setState({ phone_number })}
                                        isEnabled={!isLoading}
                                    />
                                </View>
                                <Text style={{ color: "#D43C87", fontFamily: "Avenir-Medium", fontSize: 11 }}>
                                    {I18n.t('emaillabel')}</Text>
                                <CustomTextInput
                                    name={'name'}
                                    ref={(ref) => this.emailInputRef = ref}
                                    // placeholder={I18n.t('emaillabel')}
                                    value={this.state.email}
                                    keyboardType={'email-address'}
                                    editable={!isLoading}
                                    returnKeyType={'next'}
                                    blurOnSubmit={false}
                                    withRef={true}
                                    onSubmitEditing={() => this.passwordInputRef.focus()}
                                    onChangeText={(email) => this.setState({ email })}
                                    isEnabled={!isLoading}
                                />
                                <Text style={{ color: "#D43C87", fontFamily: "Avenir-Medium", fontSize: 11 }}>
                                    {I18n.t('passwordlabel')}</Text>
                                <CustomTextInput
                                    name={'password'}
                                    ref={(ref) => this.passwordInputRef = ref}
                                    // // placeholder={I18n.t('passwordplaceholder')}
                                    value={this.state.password}
                                    editable={!isLoading}
                                    returnKeyType={'done'}
                                    secureTextEntry={true}
                                    withRef={true}
                                    onChangeText={(password) => this.setState({ password })}
                                    isEnabled={!isLoading}
                                />
                            </KeyboardAvoidingView>
                        </View>
                        <View style={styles.footer}>
                            <Text style={{ lineHeight: 26, color: "#909096", fontFamily: "Avenir-Medium", fontSize: 13 }}>
                                {I18n.t('termslabel')}
                                <Text style={{ color: "#71367D" }}> {I18n.t('termsandservicelabel')}</Text> {I18n.t('andlabel')}
                                <Text style={{ color: "#71367D" }}> {I18n.t('privacypolicylabel')}</Text>
                            </Text>
                            <LinearGradient
                                colors={['rgb(220,57, 134)', 'rgb(40,40,120)']}
                                start={{ x: 0, y: 1 }}
                                end={{ x: 1, y: 1 }} style={styles.loginButton}>
                                <CustomButton
                                    onPress={() => this.onRegister()}
                                    isEnabled={true}
                                    isLoading={isLoading}
                                    textStyle={styles.loginButtonText}
                                    text={I18n.t('logintitle')}
                                />
                            </LinearGradient>
                        </View>
                    </View>
                    <SafeAreaView />
                </ScrollView>
                <Modal
                    isVisible={this.state.visibleModal}
                    // onSwipe={() => this.setState({ visibleModal: false })}
                    // swipeDirection="down"
                    scrollTo={this.handleScrollTo}
                    style={{
                        margin: 0,
                    }}
                >
                    <CountrySelection
                        selectCode={(data) => this.setCode(data)}
                        // selectCode={(data)=> this.setState({
                        //     country : data.code,
                        //     visibleModal: false,
                        // })}
                        onSwipe={() => this.setState({ visibleModal: false })}
                    />
                </Modal>
            </View>
        )
    }
    setCode(data) {
        this.setState({
            country: data.code,
            visibleModal: false,
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    gradientView: {
        flex: 1,
        backgroundColor: "transparent",
        justifyContent: "space-around",
        alignItems: "center",
        padding: 30
    },
    applogo: {
        height: "30%",
        width: IMAGE_WIDTH,
        alignSelf: 'center',
    },
    form: {
        width: loginWIDTH,
        bottom: hp('12%'),
        alignSelf: 'center',
        zIndex: 1,
        position: "absolute",
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
        paddingHorizontal: metrics.DEVICE_WIDTH * 0.06
    },
    head: {
        justifyContent: "center",
        paddingVertical: "5%"
    },
    footer: {
        height: metrics.DEVICE_HEIGHT * 0.2
    },
    loginButton: {
        borderRadius: 5,
    },
    loginButtonText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    signupLink: {
        color: "#71367D",
        fontSize: 13,
        fontFamily: 'Avenir-Heavy',
        lineHeight: 20,
        alignSelf: 'center',
    },
    welcomeText: {
        color: '#fff',
        fontFamily: "Avenir-Heavy",
        fontSize: 25,
        bottom: 10,
        lineHeight: 100
    },
})
