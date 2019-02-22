import React, { Component, PropTypes } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import { connect } from "react-redux";
import { Text } from 'react-native-animatable';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import Loader from "../Loading/Loader";
import I18n from 'react-native-i18n';
import { Image, View } from 'react-native-animatable'
import * as global from '../../../global.json'
import CustomButton from '../CustomButton'
import CustomTextInput from '../CustomTextInput'
import metrics from '../../config/metrics'
import appLogo from '../../../assets/icons/MatchologistsLogoNEW.png'
import BaseFormComponent from "../Common/BaseFormComponent";
import CountrySelection from './CountrySelection'
const loginWIDTH = metrics.DEVICE_WIDTH * 0.9
const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.6
const formStyle = { marginTop: 40 };
import Modal from "react-native-modal";
import ApiManager from "../Common/ApiManager";
import FCM from "react-native-fcm";
import { TextInputMask } from 'react-native-masked-text'
import _ from 'lodash';

let IS_ANDROID = Platform.OS === 'android'
class SignupForm extends BaseFormComponent {
    constructor(props) {
        super(props);
        this.state = {
            fullname: '',
            phone_number: '',
            email: '',
            password: '',
            postalcode: '',
            country: '+1',
            visibleModal: false,
            scrollOffset: '',
            isLoading: false,
            deviceToken: ""
        }
    }
    async componentDidMount() {
        await FCM.getFCMToken().then(token => {
            this.setState({ deviceToken: token || "" });
            console.log("APNS TOKEN (getFCMToken)", token);

        });
        if (Platform.OS === "ios") {
            await FCM.getAPNSToken().then(token => {
                console.log("APNS TOKEN (getFCMToken)", token);
            });
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
        const { language } = this.props;
        var email_reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        // var password_xpression=/^[]{6,12}$/;
        var password_xpression= /^(?=.*[0-9])[a-zA-Z0-9]{7,12}$/;
        // var password_xpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,12}$/;
        if (!fullname.length) {
            this.showSimpleMessage("info", { backgroundColor: global.gradientsecondry }, I18n.t('validation.fullname_label', { locale: language }), I18n.t('validation.fullname_title', { locale: language }))
            return false
        }

        if (!phone_number.length) {
            this.showSimpleMessage("info", { backgroundColor: global.gradientsecondry }, I18n.t('validation.phonenumberlabel', { locale: language }), I18n.t('validation.phonenumbertitle', { locale: language }))
            return false
        }

        if (!country.length) {
            this.showSimpleMessage("info", { backgroundColor: global.gradientsecondry }, I18n.t('validation.countrylabel', { locale: language }), I18n.t('validation.countrytitle', { locale: language }))
            return false
        }

        if (!email.length) {
            this.showSimpleMessage("info", { backgroundColor: global.gradientsecondry }, I18n.t('validation.emaillabel', { locale: language }), I18n.t('validation.emailtitle', { locale: language }))
            return false
        }

        if (email_reg.test(email) === false) {
            this.showSimpleMessage("info", { backgroundColor: global.gradientsecondry }, I18n.t('validation.emailvalidlabel', { locale: language }), I18n.t('validation.emailvalidtitle', { locale: language }))
            return false
        }

        if (!password.length) {
            this.showSimpleMessage("info", { backgroundColor: global.gradientsecondry }, I18n.t('validation.passwordlabel', { locale: language }), I18n.t('validation.passwordtitle', { locale: language }))
            return false
        }
        if (password_xpression.test(password) === false) {
            this.showSimpleMessage("info", { backgroundColor: global.gradientsecondry }, I18n.t('validation.validpasswordlabel', { locale: language }), I18n.t('validation.validpasswordtitle', { locale: language }))
            return false
        }
        return true
    }

    onRegister = () => {
        const { fullname, phone_number, country, email, password, deviceToken } = this.state;
        let str = phone_number;
        var newPhonenumber= str.replace(/[^0-9]+/g, '')

        let contactnumber = country + "-" + newPhonenumber;
        let details = {
            'emailId': email,
            'password': password,
            'mobile': contactnumber,
            'fullName': fullname,
            'gender': 'male',
            'genderIntrestedIn': 'female',
            'device': Platform.OS,
            'deviceToken': deviceToken
        };
        if (this.validation()) {
            this.setState({ isLoading: !this.state.isLoading })
            let header = {};
            console.log("details", details)
            ApiManager.callwebservice('POST', 'api/register', header, details, (success) => {
                let response = JSON.parse(success._bodyInit);
                console.log("register", response)
                if (response.status === 0) {
                    this.setState({ isLoading: !this.state.isLoading })
                    this.showSimpleMessage("danger", { backgroundColor: "#DC6666" }, '', response.message)
                    return
                } else if (response.status === 1) {
                    this.showSimpleMessage("", { backgroundColor: "#009933" }, '', response.message)
                    this.props.navigation.navigate('profile')
                    this.setState({ isLoading: !this.state.isLoading })
                }
            }, (error) => {
                console.log("error", error)
            })
        }
    }
    onChangeText(value) {
        console.log("hello"), value
    }
    render() {
        const { navigate, goBack } = this.props.navigation;
        const { isLoading } = this.state;
        const { language } = this.props;
        // let phonenumber_arr = this.state.phone_number ? this.state.phone_number.match(/.{1,3}/g) : [];
        // console.log("phone_number", _.replace((_.replace(this.state.phone_number, "(", "")),')','') )
        // console.log("phone_number replace", this.state.phone_number.replace("/[^a-zA-Z0-9]+/g", "") )
        // console.log("phone_number replace", new RegExp('[^0-9]+')+'g');
        // console.log("phone_number newreplace", this.state.phone_number)

        return (
            <View style={{ flex: 1 }}>
                <LinearGradient colors={[global.gradientprimary, global.gradientsecondry]} style={{ flex: 1 }} />
                <View style={{ flex: 1, backgroundColor: "#fff" }} />
                <View style={{ width: metrics.DEVICE_WIDTH, height: metrics.DEVICE_HEIGHT, zIndex: 1, position: "absolute" }}>
                    <SafeAreaView style={{}} />
                    <StatusBar backgroundColor="#DB3D88" barStyle="light-content" />
                    <TouchableOpacity onPress={() => goBack()} style={styles.backbuttonContainer}>
                        <Image
                            source={require('../../images/icons/backbutton.png')}
                            style={{ width: 25, height: 17 }}
                            resizeMethod="resize"
                            resizeMode="contain" />
                    </TouchableOpacity>

                    <ScrollView contentContainerStyle={{
                        paddingVertical: 20,
                        alignItems: "center",
                        // backgroundColor:"#000" 
                    }}>
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
                            delay={400}>{I18n.t('welcome', { locale: language })}
                        </Text>
                        <View ref={(ref) => { this.formRef = ref }}
                            animation={'bounceIn'}
                            style={styles.form}>
                            <View style={styles.head}>
                                <KeyboardAvoidingView
                                    keyboardVerticalOffset={-100}
                                    behavior={'padding'}
                                    style={[formStyle, styles.bottom]}
                                >
                                    <Text style={styles.label}>{I18n.t('fullnameLabel', { locale: language })}</Text>
                                    <CustomTextInput
                                        name={'name'}
                                        ref={(ref) => this.nameInputRef = ref}
                                        placeholder={""}
                                        // placeholder={I18n.t('namelabel')}
                                        value={this.state.fullname}
                                        keyboardType={'default'}
                                        editable={!isLoading}
                                        returnKeyType={'next'}
                                        blurOnSubmit={false}
                                        withRef={true}
                                        onSubmitEditing={()=>this._input.focus()}
                                        // onSubmitEditing={()=>this._input.focus()}
                                        // onSubmitEditing={() => this.emailInputRef.focus()}
                                        onChangeText={(fullname) => this.setState({ fullname })}
                                        isEnabled={!isLoading}
                                    />
                                    <View style={{ marginTop: 25 }} />
                                    <Text style={styles.label}>{I18n.t('phonenumberlabel', { locale: language })}</Text>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                        <TouchableOpacity onPress={() => this.setState({ visibleModal: true })}
                                            style={{
                                                flexDirection: "row",
                                                marginTop: 8,
                                                // marginHorizontal: 5, 
                                                justifyContent: "center",
                                                backgroundColor: 'rgba(245,245,245, 100)',
                                                height: 42,
                                                borderRadius: 5,
                                                alignItems: "center",
                                                width: '25%' //69
                                            }}>
                                            <Text style={{ lineHeight: 23, color: "#909096", fontFamily: "Avenir-Medium", fontSize: 17 }}>
                                                {this.state.country ? this.state.country : '+'} </Text>
                                            <Image source={require('../../images/icons/down_diamond.png')} style={{ width: 8, height: 4 }} />
                                        </TouchableOpacity>
                                        <TextInputMask
                                        ref={(ref) => {this._input = ref ? ref._inputElement : ref}} 
                                        type={"custom"}
                                        keyboardType={"numeric"} 
                                        style={[styles.input]}
                                        selectionColor={'#696969'}
                                        value={this.state.phone_number}
                                        onChangeText={(phone_number) => {
                                            console.log("phone_number", phone_number)
                                            this.setState({ phone_number })
                                        }}
                                        returnKeyType={'next'}
                                        onSubmitEditing={() => this.emailInputRef.focus()}
                                        options={{ mask: "(999) 999 - 9999" }} 
                                        />
                                        {/* <TextInputMask
                                            style={styles.input}
                                            selectionColor={'#696969'}
                                            ref={ref => (this.phonenumberInputRef = ref)}
                                            onSubmitEditing={() => this.emailInputRef.focus()}
                                            options={{
                                                obfuscated: true
                                            }}
                                            type={'cel-phone'}
                                            value={this.state.phone_number}
                                            onChangeText={(phone_number) => this.setState({ phone_number })}
                                        /> */}
                                        {/* <CustomTextInput
                                            style={{
                                                width: metrics.DEVICE_WIDTH * 0.57
                                            }}
                                            name={'name'}
                                            ref={(ref) => this.phonenumberInputRef = ref}
                                            placeholder={""}
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
                                        /> */}
                                    </View>
                                    <View style={{ marginTop: 25 }} />
                                    <Text style={styles.label}>{I18n.t('emaillabel', { locale: language })}</Text>
                                    <CustomTextInput
                                        name={'name'}
                                        ref={(ref) => this.emailInputRef = ref}
                                        placeholder={""}
                                        // placeholder={I18n.t('emaillabel',{ locale:language }).toLowerCase()}
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
                                    {/* <View style={{ marginTop: 25 }} />
                                    <Text style={styles.label}>{I18n.t('pincodelabel', { locale: language })}</Text>
                                    <CustomTextInput
                                        name={'name'}
                                        ref={(ref) => this.pincodeInputRef = ref}
                                        placeholder={""}
                                        value={this.state.postalcode}
                                        keyboardType={'numeric'}
                                        editable={!isLoading}
                                        returnKeyType={'next'}
                                        blurOnSubmit={false}
                                        withRef={true}
                                        onSubmitEditing={() => this.passwordInputRef.focus()}
                                        onChangeText={(postalcode) => this.setState({ postalcode })}
                                        isEnabled={!isLoading}
                                    /> */}
                                    <View style={{ marginTop: 25 }} />
                                    <Text style={styles.label}>{I18n.t('passwordlabel', { locale: language })}</Text>
                                    <CustomTextInput
                                        name={'password'}
                                        ref={(ref) => this.passwordInputRef = ref}
                                        placeholder={""}
                                        value={this.state.password}
                                        editable={!isLoading}
                                        returnKeyType={'done'}
                                        secureTextEntry={true}
                                        withRef={true}
                                        onChangeText={(password) => this.setState({ password })}
                                        isEnabled={!isLoading}
                                    />
                                    <Text style={{ lineHeight: 18, color: "#909096", fontFamily: "Avenir-Heavy", fontSize: 13, marginTop: 25 }} onPress={() => navigate('cmscontent')}>
                                        {I18n.t('termslabel', { locale: language })}
                                        <Text style={{ color: "#71367D" }}> {I18n.t('termsandservicelabel', { locale: language })}</Text> {I18n.t('andlabel', { locale: language })}
                                        <Text style={{ color: "#71367D" }}> {I18n.t('privacypolicylabel', { locale: language })}</Text>
                                    </Text>
                                </KeyboardAvoidingView>
                            </View>
                            <LinearGradient
                                colors={['rgb(220,57, 134)', 'rgb(40,40,120)']}
                                start={{ x: 0, y: 1 }}
                                end={{ x: 1, y: 1 }} style={styles.loginButton}>
                                <CustomButton
                                    onPress={() => this.onRegister()}
                                    isEnabled={true}
                                    isLoading={false}
                                    textStyle={styles.loginButtonText}
                                    text={I18n.t('signupitle', { locale: language }).toUpperCase()}
                                />
                            </LinearGradient>
                        </View>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => navigate('login')}
                            style={{ justifyContent: "center", alignItems: "center", marginTop: 16 }}>
                            <Text style={{
                                color: "#909096", fontWeight: 'bold',
                            }}>{I18n.t('alreadyhaveanacount', { locale: language })}<Text style={{ fontFamily: "Avenir-Heavy", color: '#5B357A' }}>{I18n.t('Signintitle', { locale: language })}</Text> </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
                <Modal
                    isVisible={this.state.visibleModal}
                    scrollTo={this.handleScrollTo}
                    style={{ margin: 0 }}>
                    <CountrySelection
                        selectCode={(data) => this.setCode(data)}
                        onSwipe={() => this.setState({ visibleModal: false })}
                    />
                </Modal>
                <SafeAreaView />
                <Modal
                    isVisible={isLoading}
                    scrollTo={this.handleScrollTo}
                    style={{ margin: 0, alignItems: "center", justifyContent: "center" }}>
                    <Loader />
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
    backbuttonContainer: {
        position: "absolute",
        zIndex: 1,
        width: "20%",
        height: 64,
        backgroundColor: "transparent",
        justifyContent: Platform.OS === 'ios' ? "flex-end" : "center",
        alignItems: "center"
    },
    label: {
        lineHeight: 15,
        color: "#D43C87",
        fontFamily: "Avenir-Medium",
        fontSize: 11,
        paddingHorizontal: IS_ANDROID ? 3 : 0
    },
    applogo: {
        // backgroundColor:"#009933",
        marginTop: IS_ANDROID ? 0 : 12,
        height: 41,
        width: IMAGE_WIDTH,
        alignSelf: 'center',
    },
    form: {
        width: loginWIDTH,
        alignSelf: 'center',
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
        paddingHorizontal: metrics.DEVICE_WIDTH * 0.06,
    },
    head: {
        justifyContent: "center",
    },
    loginButton: {
        marginVertical: 25,
        borderRadius: 5,
    },
    loginButtonText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    welcomeText: {
        marginVertical: 24,
        color: '#fff',
        fontFamily: "Avenir-Heavy",
        fontSize: 24,
        lineHeight: 33
    },
    input: {
        backgroundColor: "#F5F5F5",
        marginTop: 8,
        borderRadius: 5,
        margin: IS_ANDROID ? -1 : 0,
        height: 42,
        paddingVertical: 7,
        paddingHorizontal: IS_ANDROID ? 5 : 5,
        fontSize: 17,
        fontFamily: "Avenir-Medium",
        width: metrics.DEVICE_WIDTH * 0.57,
        color:"#909096"
    }
})

mapStateToProps = (state) => {
    return {
        language: state.language.defaultlanguage,
    }
}
export default connect(mapStateToProps)(SignupForm);
