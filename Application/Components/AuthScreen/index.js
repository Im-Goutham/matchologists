import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from "redux";
import { connect } from 'react-redux'
import { StatusBar, LayoutAnimation, Platform, SafeAreaView, StyleSheet, UIManager, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { Image, View } from 'react-native-animatable'
import LinearGradient from 'react-native-linear-gradient';
import I18n, { getLanguages } from 'react-native-i18n';
import imgLogo from '../../../assets/icons/undraw_appreciation_2_v4bt.png'
import appLogo from '../../../assets/icons/MatchologistsLogoNEW.png'
import * as global from '../../../global.json'
import * as actions from "../../i18n/language.action";

import CustomButton from '../CustomButton'
import metrics from '../../config/metrics'
import Modal from "react-native-modal";

const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.6
const circle_WIDTH = metrics.DEVICE_WIDTH * 0.6
if (Platform.OS === 'android') UIManager.setLayoutAnimationEnabledExperimental(true)
let languages_array = [];

class AuthScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_changeLanguage: false,
            scrollOffset: ''
        }
    }
    handleScrollTo = p => {
        if (this.scrollViewRef) {
            this.scrollViewRef.scrollTo(p);
        }
    };

    handleOnScroll = event => {
        console.log("event.nativeEvent.contentOffset.y");

        this.setState({
            scrollOffset: event.nativeEvent.contentOffset.y
        });
    };
    toggle() {
        this.setState({
            is_changeLanguage: !this.state.is_changeLanguage
        })
    }
    changeMyLocalLanguage(item) {
        this.setState({
            is_changeLanguage: !this.state.is_changeLanguage
        }, this.props.savelocallanguage(item))
    }
    componentDidMount() {
        getLanguages().then(languages => {
            console.log("languages", languages);
        });
        this.props.islanguageChange ? undefined : Alert.alert(
            'Language Change',
            'Do you want to change language',
            [
              
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {text: 'OK', onPress: () => this.toggle()},
            ],
            {cancelable: false},
          );
    }
    renderLanguage() {
        const { language } = this.props
        return Object.keys(I18n.translations).map((item, index) => {
            return (
                <TouchableOpacity onPress={() => this.changeMyLocalLanguage(item)} style={[styles.language_button, { backgroundColor: item === language ? 'rgba(39, 49, 116, 50)' : "#FFF" }]} key={index}>
                    <Text style={{ color: item === language ? "#FFF" : global.gradientsecondry, fontFamily: "Avenir-Heavy", fontSize: 17 }}>{I18n.translations[item].id}</Text>
                </TouchableOpacity>
            )
        })
    }
    render() {
        const { is_changeLanguage } = this.state;
        const { language } = this.props;
        return (
            <LinearGradient colors={['#DB3D88', '#273174']} style={styles.container}>
                <SafeAreaView style={{}} />
                <StatusBar backgroundColor="#DB3D88" barStyle="light-content" />
                {/* <TouchableOpacity onPress={() => this.toggle()}
                        style={{ 
                            position: "absolute", right: 10, zIndex:3, top: Platform.OS === 'android'? 25 : 35 , backgroundColor: "rgba(255,255,255,0.4)", width: 50, height: 36, alignItems: "center", justifyContent: "center", borderRadius: 18 }}>
                        <Text style={{ color: "#FFF" }}>{this.props.language}</Text></TouchableOpacity>
 */}
                <ScrollView contentContainerStyle={{}} bounces={false} showsVerticalScrollIndicator={false}>
                    <View style={{ marginTop: 32 }}>
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
                    </View>
                    <View style={{
                        marginTop: 53,
                        justifyContent: 'center',
                        alignItems: "center"
                    }}>
                        <View style={[styles.lightCircle, { width: circle_WIDTH, height: circle_WIDTH, borderRadius: circle_WIDTH / 2 }]}>
                            <View style={[styles.lightCircle, { width: metrics.DEVICE_WIDTH * 0.5, height: metrics.DEVICE_WIDTH * 0.5, borderRadius: (metrics.DEVICE_WIDTH * 0.5) / 2 }]}>
                                <View style={[styles.lightCircle, { width: metrics.DEVICE_WIDTH * 0.4, height: metrics.DEVICE_WIDTH * 0.4, borderRadius: (metrics.DEVICE_WIDTH * 0.4) / 2 }]}>
                                    <View style={[styles.lightCircle, { width: metrics.DEVICE_WIDTH * 0.3, height: metrics.DEVICE_WIDTH * 0.3, borderRadius: (metrics.DEVICE_WIDTH * 0.3) / 2 }]}>
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
                    <Text style={{ color: "#fff", fontSize: 24, fontFamily: "Avenir-Heavy", textAlign: 'center', marginTop: 40 }}>{I18n.t('welcometitle', { locale: language })}</Text>
                    <View animation={'zoomIn'} delay={600} duration={400} style={{ marginHorizontal: metrics.DEVICE_WIDTH * 0.1, marginTop: 32 }}>
                        <CustomButton
                            text={I18n.t('signupitle', { locale: language })}
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
                            <Text style={{ color: "#909096", fontFamily: "Avenir-Medium" }} onPress={() => this.props.navigation.navigate('login')} >{I18n.t('alreadyhaveanacount', { locale: language })} <Text style={{ fontFamily: "Avenir-Heavy", color: '#5B357A' }}>{I18n.t('Signintitle', { locale: language })}</Text> </Text>
                        </View>
                        <View animation={'zoomIn'} delay={800} duration={400}>
                            <LinearGradient
                                colors={['#DB3D88', '#273174']}
                                start={{ x: 0, y: 1 }}
                                end={{ x: 1, y: 1 }} style={styles.signInButton}>
                                <CustomButton
                                    text={I18n.t('Signintitle', { locale: language })}
                                    onPress={() => this.props.navigation.navigate('login')}
                                    textStyle={styles.signInButtonText}
                                />
                            </LinearGradient>
                        </View>
                    </View>
                </ScrollView>
                <Modal
                    backdropOpacity={0.3}
                    isVisible={is_changeLanguage}
                    onSwipe={() => this.setState({ is_changeLanguage: false })}
                    swipeDirection="down"
                    scrollTo={this.handleScrollTo}
                    style={{ margin: 0, }}>
                    <View style={{ flex: 1 }} />
                    <View style={{ flex:0, backgroundColor: "#FFF" }}>
                        <Text style={{ color: global.gradientprimary, fontFamily: "Avenir-Medium", fontSize: 14, marginVertical: 10, textAlign: "center" }}>{I18n.t('selectlanguage', { locale: language })}  </Text>
                        <View style={{ backgroundColor: "#909096", height: 1 }} />
                        {this.renderLanguage()}
                        <View style={{ backgroundColor: "#909096", height: 1 }} />
                        <TouchableOpacity style={{width:'100%', alignItems: "center", justifyContent:"center" }} onPress={() => this.toggle()}>
                            <Text style={{ color: global.gradientsecondry, fontFamily: "Avenir-Heavy", fontSize: 20, marginVertical: 10 }} > {I18n.t('cancel', { locale: language })} </Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </LinearGradient>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    applogo: {
        // backgroundColor:"#000",
        height: 41,
        width: IMAGE_WIDTH,
        alignSelf: 'center',
    },
    logoImg: {
        width: 75, height: 63
    },
    lightCircle: {
        backgroundColor: 'rgba(256, 256,256, 0.1)',
        // width: circle_WIDTH, 
        // height: circle_WIDTH, 
        // borderRadius: circle_WIDTH / 2, 
        justifyContent: 'center',
        alignItems: "center"
    },
    language_button: {
        height: 45,
        alignItems: "center",
        justifyContent: "center",
    },
    bottom: {
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
        marginTop: 54,
        alignItems: 'center',
        flexDirection: 'row',
        // marginVertical: 5
    },
    signInButton: {
        marginHorizontal: metrics.DEVICE_WIDTH * 0.05,
        borderRadius: 5,
        width: metrics.DEVICE_WIDTH * 0.8
    },
    signInButtonText: {
        color: 'white',
        fontFamily: "Avenir-Heavy",
        fontSize: 17
    }
})
mapStateToProps = (state) => {
    return {
        language: state.language.defaultlanguage,
        islanguageChange: state.language.islanguageChange,
        data: state.auth.data,
        token: state.auth.token
    }
}
mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ savelocallanguage: actions.savelocallanguage }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen);
