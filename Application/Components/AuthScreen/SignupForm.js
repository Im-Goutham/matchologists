import React, { Component, PropTypes } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
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

const loginWIDTH = metrics.DEVICE_WIDTH * 0.9
const loginHeight = metrics.DEVICE_HEIGHT * 0.7
const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.6
const formStyle = { marginTop: 40 };

export default class SignupForm extends Component {
    render() {
        const { isLoading, onLoginLinkPress, onSignupPress } = this.props
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor= "blue" barStyle="light-content" />
                <SafeAreaView style={{ backgroundColor: '#DB3D88' }} />
                <LinearGradient colors={[gradientprimary, gradientsecondry]} style={{ flex: 1 }}>
                    <View style={{ flex: 1, backgroundColor: "transparent", justifyContent: "space-around", alignItems: "center", padding: 30 }}>
                        <Image
                            animation={'bounceIn'}
                            duration={1200}
                            delay={200}
                            ref={(ref) => this.logoImgRef = ref}
                            source={appLogo}
                            style={{
                                height: "30%",
                                width: IMAGE_WIDTH,
                                alignSelf: 'center',
                                // backgroundColor:"blue"
                            }}
                            resizeMode='contain'
                            resizeMethod='resize'
                        />
                        <Text
                            ref={(ref) => this.linkRef = ref}
                            style={styles.welcomeText}
                            animation={'fadeIn'}
                            duration={600}
                            delay={400}>
                            {I18n.t('welcomebacktitle')}
                        </Text>
                    </View>
                    <View style={{ flex: 1 }} />

                </LinearGradient>
                <View style={{ flex: 1, backgroundColor: "#fff" }}>
                    <View style={{
                        height: '80%',
                    }} />
                    <View style={{
                        height: '20%',
                        paddingHorizontal: metrics.DEVICE_WIDTH * 0.1,
                        justifyContent: "space-around",
                        // backgroundColor:"red"
                    }}>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <Text style={{
                                color: "#909096", fontWeight: 'bold',
                            }}>{I18n.t('alreadyhaveanacount')}<Text style={{ fontFamily: "Avenir-Heavy", color: '#5B357A' }}>{I18n.t('Signintitle')}</Text> </Text>
                        </View>

                    </View>
                </View>
                <View ref={(ref) => { this.formRef = ref }}
                    animation={'bounceIn'}
                    style={{
                        // justifyContent: "center",
                        width: loginWIDTH,
                        height: Platform.OS === 'ios'?  metrics.DEVICE_HEIGHT * 0.6: metrics.DEVICE_HEIGHT * 0.65,
                        bottom: hp('12%'),
                        // bottom : metrics.DEVICE_HEIGHT * 0.1,
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
                        // padding: 20
                    }}>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.head}>
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
                                placeholder={I18n.t('namelabel')}
                                keyboardType={'default'}
                                editable={!isLoading}
                                returnKeyType={'next'}
                                blurOnSubmit={false}
                                withRef={true}
                                onSubmitEditing={() => this.phonenumberInputRef.focus()}
                                onChangeText={(value) => this.setState({ email: value })}
                                isEnabled={!isLoading}
                            />
                            <Text style={{ color: "#D43C87", fontFamily: "Avenir-Medium", fontSize: 11 }}>
                                {I18n.t('phonenumberlabel')}</Text>
                            <CustomTextInput
                                // style={{ backgroundColor : "#fff" }}
                                name={'name'}
                                ref={(ref) => this.phonenumberInputRef = ref}
                                placeholder={I18n.t('phonenumberlabel')}
                                keyboardType={'numeric'}
                                editable={!isLoading}
                                returnKeyType={'next'}
                                blurOnSubmit={false}
                                withRef={true}
                                onSubmitEditing={() => this.emailInputRef.focus()}
                                onChangeText={(value) => this.setState({ email: value })}
                                isEnabled={!isLoading}
                            />
                            <Text style={{ color: "#D43C87", fontFamily: "Avenir-Medium", fontSize: 11 }}>
                                {I18n.t('emaillabel')}</Text>
                            <CustomTextInput
                                // style={{ backgroundColor : "#fff" }}
                                name={'name'}
                                ref={(ref) => this.emailInputRef = ref}
                                placeholder={I18n.t('emaillabel')}
                                keyboardType={'email-address'}
                                editable={!isLoading}
                                returnKeyType={'next'}
                                blurOnSubmit={false}
                                withRef={true}
                                onSubmitEditing={() => this.passwordInputRef.focus()}
                                onChangeText={(value) => this.setState({ email: value })}
                                isEnabled={!isLoading}
                            />
                            <Text style={{ color: "#D43C87", fontFamily: "Avenir-Medium", fontSize: 11 }}>
                                {I18n.t('passwordlabel')}</Text>
                            <CustomTextInput
                                name={'password'}
                                ref={(ref) => this.passwordInputRef = ref}
                                placeholder={I18n.t('passwordplaceholder')}
                                editable={!isLoading}
                                returnKeyType={'done'}
                                secureTextEntry={true}
                                withRef={true}
                                onChangeText={(value) => this.setState({ password: value })}
                                isEnabled={!isLoading}
                            />
                        </KeyboardAvoidingView>
                    </ScrollView>

                    <View style={styles.footer}>
                        <Text style={{ lineHeight: 26, color: "#909096", fontFamily: "Avenir-Medium", fontSize: 13 }}>{I18n.t('termslabel')}
                            <Text style={{ color: "#71367D" }}>{I18n.t('termsandservicelabel')}</Text> {I18n.t('andlabel')}
                            <Text style={{ color: "#71367D" }}> {I18n.t('privacypolicylabel')}</Text>
                        </Text>
                        <LinearGradient
                            colors={['rgb(220,57, 134)', 'rgb(40,40,120)']}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 1 }} style={styles.loginButton}>
                            <CustomButton
                                // onPress={() => onLoginPress(email, password)}
                                // isEnabled={isValid}
                                isLoading={isLoading}
                                // buttonStyle={styles.loginButton}
                                textStyle={styles.loginButtonText}
                                text={I18n.t('logintitle')}
                            />
                        </LinearGradient>

                    </View>
                </View>
                <SafeAreaView />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        // alignItems : 'center'
        // paddingHorizontal: metrics.DEVICE_WIDTH * 0.1
    },
    form: {
        marginTop: 20
    },
    head: {
        justifyContent: "center",
        paddingVertical: "5%"
        // flex : 6,
        // height: "80%",
        // justifyContent: 'flex-end',
        // backgroundColor : "red",
        // justifyContent : 'center'
        // paddingVertical: 20
    },
    footer: {
        height: metrics.DEVICE_HEIGHT * 0.2
        // height: "20%",
        // justifyContent: 'space-around',
        // alignItems:'flex-end',
        // backgroundColor: "blue"
        // justifyContent: 'flex-end'
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
        // backgroundColor: 'red',
        // color: 'rgba(255,255,255,0.6)',
        alignSelf: 'center',
        // padding: 20
    },
    welcomeText: {
        color: '#fff',
        fontFamily: "Avenir-Heavy",
        fontSize: 25,
        bottom: 10,
        // backgroundColor: "blue",
        lineHeight: 100
    },
    bottom: {
        // backgroundColor: '#1976D2'
    }

})
