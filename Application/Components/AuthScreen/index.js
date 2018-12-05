import React, { Component, PropTypes } from 'react'
import { KeyboardAvoidingView, LayoutAnimation, Platform, StyleSheet, UIManager, Text } from 'react-native'
import { Image, View } from 'react-native-animatable'
import LinearGradient from 'react-native-linear-gradient';
import I18n from 'react-native-i18n';

import imgLogo from '../../../assets/icons/undraw_appreciation_2_v4bt.png'
import appLogo from '../../../assets/icons/MatchologistsLogoNEW.png'
import * as global from '../../../global.json'
import CustomButton from '../CustomButton'

import metrics from '../../config/metrics'

const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.6
const circle_WIDTH = metrics.DEVICE_WIDTH * 0.6

if (Platform.OS === 'android') UIManager.setLayoutAnimationEnabledExperimental(true)

export default class AuthScreen extends Component {
    render() {
        return (
            <LinearGradient colors={['#DB3D88', '#273174']} style={styles.container}>
                <View style={{
                    flex: 1,
                    justifyContent: 'space-around',
                }}>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: "center"
                    }}>
                        <Image
                            animation={'bounceIn'}
                            duration={1200}
                            delay={200}
                            ref={(ref) => this.logoImgRef = ref}
                            source={appLogo}
                            style={{
                                height: Platform.OS === 'android' ? '35%' : "30%",
                                width: IMAGE_WIDTH,
                                alignSelf: 'center',
                                // backgroundColor:"blue"
                            }}
                            resizeMode='contain'
                            resizeMethod='resize'
                        />
                    </View>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: "center"
                    }}>
                        <View style={{ backgroundColor: 'rgba(256, 256,256, 0.1)', width: circle_WIDTH, height: circle_WIDTH, borderRadius: circle_WIDTH / 2, justifyContent: 'center', alignItems: "center" }}>
                            <View style={{ backgroundColor: 'rgba(256, 256,256, 0.1)', width: metrics.DEVICE_WIDTH * 0.5, height: metrics.DEVICE_WIDTH * 0.5, borderRadius: (metrics.DEVICE_WIDTH * 0.5) / 2, justifyContent: 'center', alignItems: "center" }}>
                                <View style={{ backgroundColor: 'rgba(256, 256,256, 0.1)', width: metrics.DEVICE_WIDTH * 0.4, height: metrics.DEVICE_WIDTH * 0.4, borderRadius: (metrics.DEVICE_WIDTH * 0.4) / 2, justifyContent: 'center', alignItems: "center" }}>
                                    <View style={{ backgroundColor: 'rgba(256, 256,256, 0.1)', width: metrics.DEVICE_WIDTH * 0.3, height: metrics.DEVICE_WIDTH * 0.3, borderRadius: (metrics.DEVICE_WIDTH * 0.3) / 2, justifyContent: 'center', alignItems: "center" }}>
                                        <Image
                                            animation={'bounceIn'}
                                            duration={1200}
                                            delay={200}
                                            ref={(ref) => this.logoImgRef = ref}
                                            style={styles.logoImg}
                                            source={imgLogo}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <Text style={{ color: "#fff", fontSize: 24, fontFamily: "Avenir-Heavy", textAlign: 'center' }}>{I18n.t('welcometitle')}</Text>
                    <View style={styles.separatorContainer} animation={'zoomIn'} delay={700} duration={400} />
                    <View animation={'zoomIn'} delay={600} duration={400} style={{ marginHorizontal: metrics.DEVICE_WIDTH * 0.1 }}>
                        <CustomButton
                            text={'SIGN UP'}
                            onPress={() => this.props.navigation.navigate('signup')}
                            buttonStyle={styles.createAccountButton}
                            textStyle={styles.createAccountButtonText}
                        />
                    </View>
                    <View style={styles.separatorContainer} animation={'zoomIn'} delay={700} duration={400} />
                    <View style={{
                        marginHorizontal: metrics.DEVICE_WIDTH * 0.05,
                        paddingBottom: 52,
                        backgroundColor: "#fff",
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5
                    }}>
                        <View style={{ justifyContent: "center", alignItems: "center", height: 50 }}>
                            <Text style={{ color: "#909096", fontWeight: 'bold' }}>Already have an account ? <Text style={{ fontFamily: global.avenirheavy, color: '#5B357A' }}>Sign In</Text> </Text>
                        </View>
                        <View animation={'zoomIn'} delay={800} duration={400}>
                            <LinearGradient
                                colors={['#DB3D88', '#273174']}
                                start={{ x: 0, y: 1 }}
                                end={{ x: 1, y: 1 }} style={styles.signInButton}>
                                <CustomButton
                                    text={'SIGN IN'}
                                    onPress={() => this.props.navigation.navigate('login')}
                                    textStyle={styles.signInButtonText}
                                />
                            </LinearGradient>
                        </View>
                    </View>
                </View>
            </LinearGradient>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        width: metrics.DEVICE_WIDTH,
        height: metrics.DEVICE_HEIGHT,
        paddingTop: 24,
        alignItems: 'center'
    },
    logoImg: {
        height: '50%',
        width: IMAGE_WIDTH,
        alignSelf: 'center',
        resizeMode: 'contain',
    },
    bottom: {
        backgroundColor: 'transparent'
    },
    createAccountButton: {
        backgroundColor: '#fff'
    },
    createAccountButtonText: {
        color: global.buttonTextcolor,
        fontFamily: "Avenir-Heavy",
        fontSize: 17
    },
    separatorContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: 5
    },
    signInButton: {
        marginHorizontal: metrics.DEVICE_WIDTH * 0.05,
        borderRadius: 5,
        width: metrics.DEVICE_WIDTH * 0.8
    },
    signInButtonText: {
        color: 'white',
        fontFamily: "Avenir-Heavy",
        fontSize: 14
    }
})
