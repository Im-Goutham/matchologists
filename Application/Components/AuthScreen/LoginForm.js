import React from 'react';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Platform, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk'
import { type, GoogleSignin, GoogleSigninButton, statusCodes, User } from 'react-native-google-signin';
import Modal from "react-native-modal";
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import I18n from 'react-native-i18n';
import { Image, View, Text } from 'react-native-animatable'
import * as global from '../../../global.json'
import CustomButton from '../CustomButton'
import CustomTextInput from '../CustomTextInput'
import metrics from '../../config/metrics'
import appLogo from '../../../assets/icons/MatchologistsLogoNEW.png'
import BaseFormComponent from "../Common/BaseFormComponent";
import * as actions from "./auth.actions";
import ApiManager from "../Common/ApiManager";
import SplashScreen from 'react-native-splash-screen';
import FCM from "react-native-fcm";

// start mobx configuration
// import { observer } from 'mobx-react/native'
// import { create } from 'mobx-persist'
// import { AuthStore } from '../../Localdata/store'
// const hydrate = create({ storage: AsyncStorage })
// const authStore = new AuthStore
// hydrate('email', authStore)
// close mobx configuration
let IS_ANDROID = Platform.OS === 'android'

const loginWIDTH = metrics.DEVICE_WIDTH * 0.9
const loginHeight = metrics.DEVICE_HEIGHT * 0.45
const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.6
const formStyle = { marginTop: 40 };

// @observer
class LoginForm extends BaseFormComponent {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            userdata: null,
            error: null,
            deviceToken: "",
            is_loginSuccess: false,
        }
    }
    async componentDidMount() {
        this._configureGoogleSignIn();
        await this._getCurrentUser();

        await FCM.getFCMToken().then(token => {
            this.setState({ deviceToken: token || "" });
        });
        if (Platform.OS === "ios") {
            await FCM.getAPNSToken().then(token => {
                console.log("APNS TOKEN (getFCMToken)", token);
            });
        }
    }

    async _configureGoogleSignIn() {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        // await GoogleSignin.hasPlayServices({ autoResolve: true });
        const configPlatform = {
            ...Platform.select({
                ios: {
                    iosClientId: '984386186860-qv2koo0b98mp88uihgnu3hba37mbnjl3.apps.googleusercontent.com',
                },
                android: {},
            }),
        };

        await GoogleSignin.configure({
            ...configPlatform,
            webClientId: '984386186860-5qjdcsru407plus0i9cjgh3g0j8jtp4q.apps.googleusercontent.com',
            offlineAccess: false,
        });
        await GoogleSignin.configure();
    }

    async _getCurrentUser() {
        try {
            const userInfo = await GoogleSignin.signInSilently();
            this.setState({ userInfo, error: null });
        } catch (error) {
            const errorMessage =
                error.code === statusCodes.SIGN_IN_REQUIRED ? 'Please sign in :)' : error.message;
            this.setState({
                error: new Error(errorMessage),
            });
        }
    }

    handleFacebookLogin() {
        var self = this;
        LoginManager
            .logInWithReadPermissions(['public_profile', 'email'])
            .then(function (result) {
                if (result.isCancelled) {
                    alert('Login cancelled');
                } else {
                    AccessToken
                        .getCurrentAccessToken()
                        .then((data) => {
                            console.log('token data is ', data);
                            //  alert(accessToken.toString())
                            let userdata = {
                                "device": Platform.OS,
                                "deviceToken": self.state.deviceToken
                            };
                            // user.accessToken = data.accessToken;
                            // user.expiresIn = data.expirationTime;
                            const responseInfoCallback = (error, result) => {
                                if (error) {
                                    console.log(error)
                                    //   alert('Error fetching data: ' + error.toString());
                                } else {
                                    console.log('user data is ', result)
                                    userdata.emailId = result.email
                                    userdata.facebookId = result.id
                                    userdata.fullName = result.name
                                    // console.log('user data is ', user)
                                    SplashScreen.hide();
                                    self.setState({ userdata, error: null });
                                    self.social_login(userdata)
                                    //  self.facebookLogin(user);
                                    //    alert('Success fetching data: ' + result.toString());
                                }
                            }

                            const infoRequest = new GraphRequest('/me', {
                                accessToken: data.accessToken,
                                parameters: {
                                    fields: {
                                        string: 'email, name, first_name, middle_name, last_name'
                                    }
                                }
                            }, responseInfoCallback);
                            // Start the graph request.
                            new GraphRequestManager()
                                .addRequest(infoRequest)
                                .start()
                        })
                }
            }, function (error) {
                alert('Login fail with error: ' + error);
            });
    }
    googleSignIn = async () => {
        let userdata = {
            "device": Platform.OS,
            "deviceToken": this.state.deviceToken
        }
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();

            userdata.emailId = userInfo.user.email
            userdata.googleId = userInfo.user.id
            userdata.fullName = userInfo.user.name
            // console.log("userInfo", userdata)

            this.setState({ userdata, error: null });
            SplashScreen.hide();
            this.social_login(userdata)
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // sign in was cancelled
                Alert.alert('cancelled');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation in progress already
                Alert.alert('in progress');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                Alert.alert('play services not available or outdated');
            } else {
                Alert.alert('Something went wrong', error.toString());
                this.setState({
                    error,
                });
            }
        }
    };
    social_login = (details) => {
        console.log("details", details)
        let header = {
            'Content-Type': 'application/json'
        }
        ApiManager.callwebservice('POST', 'api/sociallogin', header, details, (success) => {
            let response = JSON.parse(success._bodyInit),
                token = response.access_token,
                data = response.data;
            if (response.status === 0) {
                this.showSimpleMessage("danger", { backgroundColor: "#DC6666" }, response.message, response.message)
                return
            }
            this.setState({
                is_loginSuccess: !this.state.is_loginSuccess
            })
            let password = '';
            this.props.login(details.emailId, password, token, data);
            this.timeOutCall()

        }, (error) => {
            console.log("error", error)
        })
    }
    timeOutCall() {
        setTimeout(() => {
            this.setState({
                is_loginSuccess: !this.state.is_loginSuccess
            },() => this.props.navigation.navigate('basicinfo'))
        }, 3000)
    }

    validation = () => {
        const { language } = this.props;
        const { email, password } = this.state;
        var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!email.length) {
            this.showSimpleMessage("info", { backgroundColor: global.gradientsecondry },  I18n.t('validation.emaillabel', { locale: language }), I18n.t('validation.emailtitle', { locale: language }))
            return false;
        }
        if (reg.test(email) === false) {
            this.showSimpleMessage("info", { backgroundColor: global.gradientsecondry },  I18n.t('validation.emailvalidlabel', { locale: language }), I18n.t('validation.emailvalidtitle', { locale: language }))
            return false;
        }
        if (!password.length) {
            this.showSimpleMessage("info", { backgroundColor: global.gradientsecondry },  I18n.t('validation.passwordlabel', { locale: language }), I18n.t('validation.passwordtitle', { locale: language }))
            return false;
        }
        return true
    }

    onLoginPress() {
        const { email, password , deviceToken} = this.state;
        let details = {
            'emailId': email,
            'password': password,
            'device': Platform.OS,
            'deviceToken': deviceToken
        },
            header = {};
        if (this.validation()) {
            ApiManager.callwebservice('POST', 'api/login', header, details, (success) => {
                let response = JSON.parse(success._bodyInit),
                    token = response.access_token,
                    data = response.data;
                    console.log("response callwebservice login", response)

                    // let userimage=   "" ;
                if (response.status === 0) {
                    this.showSimpleMessage("danger", { backgroundColor: "#DC6666" }, response.message, response.message)
                    return
                } else if(response.status === 1){
                    let userimage=  response.data.profilePic ? response.data.profilePic : "" ;
                    this.showSimpleMessage("", { backgroundColor: "#009933" }, response.message, response.message)
                    if(response.data.verificationStatus){
                        this.setState({ is_loginSuccess: !this.state.is_loginSuccess})
                        // this.showSimpleMessage("", { backgroundColor: "#009933" }, '', response.message)
                        this.timeOutCall()
                        this.props.saveuserProifileimage(userimage)
                        this.props.login(email, password, token, data);    
    
                    }
                }
                // this.props.navigation.navigate('profile')

            }, (error) => {
                console.log("error", error)
            })
        }
        // start mobx configuration

        // authStore.save(email, password)
        // close mobx configuration
    }
    render() {
        const { goBack } = this.props.navigation;

        const { isLoading, onLoginLinkPress, onSignupPress, language } = this.props
        return (
            <View style={styles.container}>
                <LinearGradient colors={[global.gradientprimary, global.gradientsecondry]} style={{ flex: 1 }} />
                <View style={{ flex: 1, backgroundColor: "#fff" }} />
                <View style={{ width: metrics.DEVICE_WIDTH, height: metrics.DEVICE_HEIGHT, zIndex: 1, position: "absolute" }}>
                    <SafeAreaView style={{
                        // backgroundColor: '#DB3D88' 
                    }} />
                    <StatusBar backgroundColor="#DB3D88" barStyle="light-content" />
                    <TouchableOpacity onPress={() => goBack()} style={styles.backbuttonContainer}>
                        <Image
                            source={require('../../images/icons/backbutton.png')}
                            style={{ width: 25, height: 17 }}
                            resizeMethod="resize"
                            resizeMode="contain" />
                    </TouchableOpacity>
                    <ScrollView contentContainerStyle={{ paddingVertical: 32}}>
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
                            {I18n.t('welcomebacktitle', { locale: language })}
                        </Text>
                        <View ref={(ref) => { this.formRef = ref }}
                            animation={'fadeIn'}
                            style={{
                                width: loginWIDTH,
                                // height: loginHeight,
                                alignSelf: 'center',
                                backgroundColor: "#fff",
                                borderRadius: 10,
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.2,
                                shadowRadius: 2,
                                elevation: 3,
                                paddingHorizontal: metrics.DEVICE_WIDTH * 0.06
                            }}>
                            <KeyboardAvoidingView
                                keyboardVerticalOffset={-100}
                                behavior={'padding'}
                                style={[formStyle, styles.bottom]}
                            >
                                <Text style={styles.label}>{I18n.t('emaillabel', { locale: language })}</Text>
                                <CustomTextInput
                                    // style={{ backgroundColor : "#fff" }}
                                    name={'email'}
                                    value={this.state.email}
                                    ref={(ref) => this.emailInputRef = ref}
                                    placeholder={''}
                                    keyboardType={'email-address'}
                                    editable={!isLoading}
                                    returnKeyType={'next'}
                                    blurOnSubmit={false}
                                    withRef={true}
                                    onSubmitEditing={() => this.passwordInputRef.focus()}
                                    onChangeText={(value) => this.setState({ email: value })}
                                    isEnabled={!isLoading}
                                />
                                <View style={{ marginTop: 25 }} />
                                <Text style={styles.label}>{I18n.t('passwordlabel', { locale: language })}</Text>
                                <CustomTextInput
                                    name={'password'}
                                    ref={(ref) => this.passwordInputRef = ref}
                                    value={this.state.password}
                                    placeholder={''}
                                    editable={!isLoading}
                                    returnKeyType={'done'}
                                    secureTextEntry={true}
                                    withRef={true}
                                    onChangeText={(value) => this.setState({ password: value })}
                                    isEnabled={!isLoading}
                                />
                                <Text
                                    ref={(ref) => this.linkRef = ref}
                                    style={styles.forgotPasswordLink}
                                    onPress={() => this.props.navigation.navigate('forgotpassword')}
                                    animation={'fadeIn'}
                                    duration={600}
                                    delay={400}>
                                    {I18n.t('forgotpasswordlabel', { locale: language })}
                                </Text>
                                <LinearGradient
                                    colors={['rgb(220,57, 134)', 'rgb(40,40,120)']}
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 1, y: 1 }} style={styles.loginButton}>
                                    <CustomButton
                                        onPress={() => this.onLoginPress()}
                                        // isEnabled={isValid}
                                        isLoading={isLoading}
                                        textStyle={styles.loginButtonText}
                                        text={I18n.t('Signintitle', { locale: language }).toUpperCase()}
                                    />
                                </LinearGradient>
                            </KeyboardAvoidingView>
                        </View>
                        <View style={{ height: 112, margin: 32, justifyContent: "space-between" }}>
                            <TouchableOpacity
                                onPress={() => this.handleFacebookLogin()}
                                style={[styles.social_button, { backgroundColor: "#2672CB" }]} >
                                <Image source={require('../../images/icons/facebook_icon.png')} style={{ width: 12, height: 24, marginHorizontal: 16 }} />
                                <Text style={styles.loginButtonText}>{I18n.t('facebookLogintitle', { locale: language })}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this.googleSignIn()}
                                style={[styles.social_button, { backgroundColor: "#DD473B" }]} >
                                <Image source={require('../../images/icons/google_icon.png')} style={{ width: 18, height: 18, marginHorizontal: 16 }} />
                                <Text style={styles.loginButtonText}>{I18n.t('gmailLogintitle', { locale: language })}</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => this.props.navigation.navigate('signup')}
                            style={{ justifyContent: "center", alignItems: "center" }}>
                            <Text style={{
                                color: "#909096", fontWeight: 'bold',
                            }}>{I18n.t('notacounttitle', { locale: language })}<Text style={{ fontFamily: "Avenir-Heavy", color: '#5B357A' }}>{I18n.t('signupitle', { locale: language })}</Text> </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
                <Modal
                    isVisible={this.state.is_loginSuccess}
                    scrollTo={this.handleScrollTo}
                    style={{ margin: 0, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color:"#fff", fontFamily: "Avenir-Heavy", fontSize:30}}>{I18n.t('loginsuccesstitle', { locale: language })}</Text>
                    <LottieView
                        speed={500}
                        duration={1000}
                        resizeMode="contain"
                        style={{
                            width: 350,
                            height: 350
                        }}
                        // progress={this.state.progress}
                        source={require('../../jsoncontainer/success_animation.json')}
                        autoPlay
                        loop={false}
                    />
                </Modal>

            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    backbuttonContainer:{
        position: "absolute",
        zIndex: 1,
        width: "20%",
        height: 64,
        backgroundColor: "transparent",
        justifyContent: Platform.OS === 'ios' ? "flex-end" : "center",
        alignItems: "center"
    },
    label:{
        lineHeight: 15, 
        color: "#D43C87", 
        fontFamily: "Avenir-Medium", 
        fontSize: 11,
        paddingHorizontal: IS_ANDROID ? 3 :0
    },
    applogo: {
        // backgroundColor:"#000",
        height: 41,
        width: IMAGE_WIDTH,
        alignSelf: 'center',
    },
    form: {
        marginTop: 20
    },
    head: {
        height: "55%",
        justifyContent: 'flex-end',
    },
    footer: {
        height: "45%",
    },
    loginButton: {
        borderRadius: 5,
        marginVertical: 40,
    },
    loginButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontFamily: "Avenir-Heavy",
        lineHeight: 23,
        fontSize: 17
    },
    forgotPasswordLink: {
        marginTop: 16,
        color: "#71367D",
        fontSize: 13,
        fontFamily: 'Avenir-Heavy',
        lineHeight: 22,
        alignSelf: 'center',
    },
    welcomeText: {
        marginTop: 24,
        alignSelf: "center",
        marginBottom: 32,
        color: '#fff',
        fontFamily: "Avenir-Heavy",
        fontSize: 24,
        lineHeight: 33
    },
    social_button: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        // marginHorizontal: 32,
        // marginVertical: 16,
        height: 50,
        borderWidth: 1,
        borderRadius: 3,
        alignSelf: 'stretch',
        borderColor: 'rgba(0, 0, 0, 0.1)'
    },
})


function YourCustomTransition(animValue, position = "top") {
    const opacity = animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });
    const translateX = animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [360, 0],
    });
    return {
        transform: [{ translateX }],
        opacity,
    };
}
mapStateToProps = (state) => {
    return {
        language: state.language.defaultlanguage,
    }
}
mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ 
        login: actions.login, 
        saveuserProifileimage :actions.savelocalimage
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
