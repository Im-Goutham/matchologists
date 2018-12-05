import React, { Component } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, Platform, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import I18n from 'react-native-i18n';
import { Image, View, Text } from 'react-native-animatable'
import Header from '../Common/Header'
import * as global from '../../../global.json'
import CustomButton from '../CustomButton'
import CustomTextInput from '../CustomTextInput'
import metrics from '../../config/metrics'
import appLogo from '../../../assets/icons/MatchologistsLogoNEW.png'

const loginWIDTH = metrics.DEVICE_WIDTH * 0.9
const loginHeight = Platform.OS === 'android' ? metrics.DEVICE_HEIGHT * 0.3 : metrics.DEVICE_HEIGHT * 0.3
const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.6

export default class ForgotPassword extends Component {
    render() {
        const { goBack } = this.props.navigation;
        const { isLoading } = this.props
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="#DB3D88" barStyle="light-content" />

                <LinearGradient colors={[global.gradientprimary, global.gradientsecondry]} style={{ flex: 1 }}>
                    <SafeAreaView />
                    <View style={{flexDirection:"row"}}>
                    <TouchableOpacity
                        onPress={()=>goBack()}
                                    style={{
                                        width: "20%",
                                        backgroundColor: "transparent",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                     <Image
                                        source={require('../../images/icons/backbutton.png')}
                                        style={{ width: 25, height: 17 }}
                                        resizeMethod="resize"
                                        resizeMode="contain" />
                                </TouchableOpacity>
                                <View style={{ width: "65%", backgroundColor: "transparent", alignItems: "center", justifyContent: "center" }}>
                                    <Text style={{ fontFamily: "Avenir-Heavy", fontSize: 24, color: "rgba(255,255, 255, 100)" }}>Forgot Password</Text>
                                </View>
                                <TouchableOpacity 
                                onPress={()=>this.setState({visibleModal: true})}
                                style={{
                                    width: "15%",
                                    backgroundColor: "transparent",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}>
                                    {/* <Image
                                        source={require('../../images/filter.png')}
                                        style={{ width: 17, height: 18, left: 5 }}
                                        resizeMethod="resize"
                                        resizeMode="contain" /> */}
                                </TouchableOpacity>
                        </View>
                               
                        
                                
                           
                    <View style={{ flex: 0.3, backgroundColor: "transparent", justifyContent: "space-around", alignItems: "center", padding: 30 }}>
                        
                        <Text
                            ref={(ref) => this.linkRef = ref}
                            style={styles.welcomeText}
                            animation={'fadeIn'}
                            duration={600}
                            delay={400}>
                            {I18n.t('forgotpasswordtitle')}
                        </Text>
                    </View>
                    <View style={{ flex: 0.8 }} />

                </LinearGradient>
                <View ref={(ref) => { this.formRef = ref }}
                    animation={'fadeIn'}
                    style={{
                        // justifyContent: "center",
                        width: loginWIDTH,
                        height: loginHeight,
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
                    <View style={styles.head}>
                        <Text style={{ color: "#D43C87", fontFamily: "Avenir-Medium", fontSize: 11 }}>
                            {I18n.t('emaillabel')}</Text>
                        <CustomTextInput
                            // style={{ backgroundColor : "#fff" }}
                            name={'email'}
                            ref={(ref) => this.emailInputRef = ref}
                            placeholder={'Email'}
                            keyboardType={'email-address'}
                            editable={!isLoading}
                            returnKeyType={'next'}
                            blurOnSubmit={false}
                            withRef={true}
                            // onSubmitEditing={() => this.passwordInputRef.focus()}
                            onChangeText={(value) => this.setState({ email: value })}
                            isEnabled={!isLoading}
                        />
                    </View>
                    <View style={styles.footer}>
                        <View style={{
                            height: "60%", backgroundColor: "transparent", bottom: 0,
                        }}>
                            <LinearGradient
                                colors={['rgb(220,57, 134)', 'rgb(40,40,120)']}
                                start={{ x: 0, y: 1 }}
                                end={{ x: 1, y: 1 }} style={styles.loginButton}>
                                <CustomButton
                                    onPress={() => this.props.navigation.navigate('profile')}
                                    isLoading={isLoading}
                                    textStyle={styles.loginButtonText}
                                    text={I18n.t('sendbutton')}
                                />
                            </LinearGradient>
                        </View>

                    </View>
                </View>
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
        // flex : 6,
        height: "55%",
        justifyContent: 'flex-end',
        // backgroundColor : "red",
        // justifyContent : 'center'
        // paddingVertical: 20
    },
    footer: {
        height: "45%",
        justifyContent: "center",
        // alignItems:"center",
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
        color: 'rgba(255, 255, 255, 100)',
        fontFamily: "Avenir-Medium",
        fontSize: 17,
        bottom: 10,
        // backgroundColor: "blue",
        // lineHeight: 100
    }

})
