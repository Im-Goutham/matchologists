import React, { Component, PropTypes } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { SocialIcon } from 'react-native-elements'
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk'
import { GoogleSignin } from 'react-native-google-signin';
import LinearGradient from 'react-native-linear-gradient';
import I18n from 'react-native-i18n';
import { Image, View, Text } from 'react-native-animatable'

import { gradientprimary, gradientsecondry } from '../../../global.json'
import CustomButton from '../CustomButton'
import CustomTextInput from '../CustomTextInput'
import metrics from '../../config/metrics'
import appLogo from '../../../assets/icons/MatchologistsLogoNEW.png'

const loginWIDTH = metrics.DEVICE_WIDTH * 0.9
const loginHeight = metrics.DEVICE_HEIGHT * 0.45
const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.6

export default class LoginForm extends Component {


    async componentDidMount() {
        await this._configureGoogleSignIn();
        await this._getCurrentUser();
      }
    
      async _configureGoogleSignIn() {
        // await GoogleSignin.hasPlayServices({ autoResolve: true });
        // const configPlatform = {
        //   ...Platform.select({
        //     ios: {
        //       iosClientId: '954330942455-5742nq1qk0aifalcs26h3ee1kc7b216b.apps.googleusercontent.com',
        //     },
        //     android: {},
        //   }),
        // };
    
        // await GoogleSignin.configure({
        //   ...configPlatform,
        //   webClientId: '905637758517-8b69ud9v71gboqq1fer1eomn61ne4t95.apps.googleusercontent.com',
        //   offlineAccess: false,
        // });
        await GoogleSignin.configure();
      }
    
      async _getCurrentUser() {
        try {
          const user = await GoogleSignin.currentUserAsync();
          this.setState({ user, error: null });
        } catch (error) {
          this.setState({
            error,
          });
        }
      }



    handleFacebookLogin () {
        var self = this;
        LoginManager
          .logInWithReadPermissions(['public_profile'])
          .then(function (result) {
            if (result.isCancelled) {
              alert('Login cancelled');
            } else {
              AccessToken
                .getCurrentAccessToken()
                .then((data) => {
                  console.log('token data is ',data);
                //  alert(accessToken.toString())
                  let user = {};
                  user.accessToken = data.accessToken;
                  user.expiresIn = data.expirationTime;
                  const responseInfoCallback = (error, result) => {
                    if (error) {
                      console.log(error)
                   //   alert('Error fetching data: ' + error.toString());
                    } else {
                      console.log('user data is ',result)
                      user.name = result.name;
                    //  self.facebookLogin(user);
                  //    alert('Success fetching data: ' + result.toString());
                    }
                  }
  
                  const infoRequest = new GraphRequest('/me', {
                    accessToken: data.accessToken,
                    parameters: {
                      fields: {
                        string: 'email,name,first_name,middle_name,last_name'
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
        console.log('_signIn is ');
            try {
            const user = await GoogleSignin.signIn();
            console.log('user is ',user);
            this.setState({ user, error: null });
            this.googleSignIn(user);

            } catch (error) {
            if (error.code === 'CANCELED') {
                error.message = 'user canceled the login flow';
            }
            this.setState({
                error,
            });
            }
      };

    render() {
        const { isLoading, onLoginLinkPress, onSignupPress } = this.props
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="#DB3D88" barStyle="light-content" />

                <LinearGradient colors={[gradientprimary, gradientsecondry]} style={{ flex: 1 }}>
                    <SafeAreaView />

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
                        height: '48%',
                    }} />
                    <View style={{
                        height: '52%',
                        paddingHorizontal: metrics.DEVICE_WIDTH * 0.1,
                        justifyContent: "space-around",
                    }}>
                        <SocialIcon
                            title={I18n.t('facebookLogintitle')}
                            button
                            type='facebook'
                            style={{ borderRadius: 5, backgroundColor: "#2672CB" }}
                            onPress={() => this.handleFacebookLogin()}
                        />
                        <SocialIcon
                            title={I18n.t('gmailLogintitle')}
                            button
                            type='google'
                            style={{ borderRadius: 5, backgroundColor: "#DD473B" }}
                            onPress={()=> this.googleSignIn()}
                        />
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => this.props.navigation.navigate('signup')}
                            style={{ justifyContent: "center", alignItems: "center" }}>
                            <Text style={{
                                color: "#909096", fontWeight: 'bold',
                            }}>{I18n.t('notacounttitle')}<Text style={{ fontFamily: "Avenir-Heavy", color: '#5B357A' }}>{I18n.t('logintitle')}</Text> </Text>
                        </TouchableOpacity>

                    </View>
                </View>
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
                        <View style={{
                            // backgroundColor : 'green' 
                        }}>
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
                                onSubmitEditing={() => this.passwordInputRef.focus()}
                                onChangeText={(value) => this.setState({ email: value })}
                                isEnabled={!isLoading}
                            />
                        </View>
                        <View style={{
                            // backgroundColor : 'magenta' 
                        }}>
                            <Text style={{ color: "#D43C87", fontFamily: "Avenir-Medium", fontSize: 11 }}>
                                {I18n.t('passwordlabel')}</Text>
                            <CustomTextInput
                                name={'password'}
                                ref={(ref) => this.passwordInputRef = ref}
                                placeholder={I18n.t('passwordlabel')}
                                editable={!isLoading}
                                returnKeyType={'done'}
                                secureTextEntry={true}
                                withRef={true}
                                onChangeText={(value) => this.setState({ password: value })}
                                isEnabled={!isLoading}
                            />
                        </View>
                    </View>
                    <View style={styles.footer}>
                        <View style={{ height: "40%", backgroundColor: "transparent" }}>
                            <Text
                                ref={(ref) => this.linkRef = ref}
                                style={styles.signupLink}
                                onPress={() => this.props.navigation.navigate('forgotpassword')}
                                animation={'fadeIn'}
                                duration={600}
                                delay={400}>
                                {I18n.t('forgotpasswordlabel')}
                            </Text>
                        </View>
                        <View style={{ height: "60%", backgroundColor: "transparent" }}>
                            <LinearGradient
                                colors={['rgb(220,57, 134)', 'rgb(40,40,120)']}
                                start={{ x: 0, y: 1 }}
                                end={{ x: 1, y: 1 }} style={styles.loginButton}>
                                <CustomButton
                                    onPress={() => this.props.navigation.navigate('profile')}
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
        // flex : 6,
        height: "55%",
        justifyContent: 'flex-end',
        // backgroundColor : "red",
        // justifyContent : 'center'
        // paddingVertical: 20
    },
    footer: {
        height: "45%",
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
        // lineHeight: 100
    }

})
