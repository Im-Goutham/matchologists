/**
 * profile page
 * Author :Abhishek Kalia
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    StatusBar,
    SafeAreaView,
    Platform,
    Text,
    UIManager
} from 'react-native'
import { Image, View } from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import I18n from 'react-native-i18n';
import metrics from '../../config/metrics';
import CustomButton from '../CustomButton';
import {
    widthPercentageToDP,
    heightPercentageToDP,
    listenOrientationChange,
    removeOrientationListener
  } from 'react-native-responsive-screen';

const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.6
const IMAGE_HEIGHT = metrics.DEVICE_HEIGHT * 0.6

import image from '../../../assets/icons/undraw_love_is_in_the_air_4mmc.png'
if (Platform.OS === 'android') UIManager.setLayoutAnimationEnabledExperimental(true)

export default class ProfileScreen extends Component {
    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            {Platform.OS==='android'? <StatusBar barStyle="dark-content" backgroundColor="#fff" /> : undefined }
            
                <View style={styles.container}>
                    <View style={styles.imagecontainer}>
                        <Image
                            animation={'bounceIn'}
                            duration={1200}
                            delay={200}
                            ref={(ref) => this.logoImgRef = ref}
                            source={image}
                            style={styles.imagestyle}
                            resizeMode='contain'
                            resizeMethod='resize'
                        />
                    </View>
                    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                        <View style={styles.textContainer}>
                            <Text style={styles.wishText}>{I18n.t('success_msg')}</Text>
                            <Text style={styles.answerText}>{I18n.t('answer_string')}</Text>
                        </View>
                        <View style={{ flex: 5, backgroundColor: 'transparent', paddingHorizontal: 20, justifyContent: "center" }}>
                            <LinearGradient
                                colors={['#DB3D88', '#273174']}
                                start={{ x: 0, y: 1 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.signInButton}>
                                <CustomButton
                                    text={I18n.t('start_button')}
                                    onPress={() => console.log("button")}
                                    textStyle={styles.signInButtonText}
                                />
                            </LinearGradient>

                        </View>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        // alignItems: 'center',
        backgroundColor: 'transparent',
    },
    imagecontainer: {
        flex: 1,
        backgroundColor:
            'transparent',
        alignItems: "center"
    },
    imagestyle: {
        // backgroundColor : "red",
        width: Platform.OS === 'ios' ? IMAGE_WIDTH : widthPercentageToDP('60%'),
        height: Platform.OS === 'ios' ? IMAGE_HEIGHT : heightPercentageToDP('60%') 
    },
    textContainer: {
        flex: 6,
        backgroundColor: 'transparent',
        justifyContent: "flex-end",
        alignItems: "center",
    },
    wishText: {
        fontFamily: "Avenir-Heavy",
        fontSize: 24,
        textAlign: "center",
        color: "#313138",
        bottom: 20
    },
    answerText: {
        fontFamily: "Avenir-Medium",
        fontSize: 17,
        color: "#909096",
        textAlign: "center"
    },
    signInButton: {
        borderRadius: 5,
    },
    signInButtonText: {
        fontFamily: "Avenir-Heavy",
        fontSize: 17,
        color: "#fff"
    }
});
