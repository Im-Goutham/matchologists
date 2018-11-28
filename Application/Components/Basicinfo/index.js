import React, { Component, PropTypes } from 'react'
import {
    KeyboardAvoidingView,
    LayoutAnimation,
    Platform,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    UIManager,
    Text,
    ScrollView,
    View,
    Image,
    ListView,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native'
// import { Image } from 'react-native-animatable'
import LinearGradient from 'react-native-linear-gradient';
import I18n from 'react-native-i18n';
import { avenirheavy, primarybg } from '../../../global.json'
import CustomButton from '../CustomButton'
import metrics from '../../config/metrics'
import CustomTextInput from '../CustomTextInput';

import image1 from '../../images/Photo_1.png';
import image2 from '../../images/Photo_2.png';
import image3 from '../../images/Photo_3.png';
import image4 from '../../images/Photo_4.png';
import image5 from '../../images/Photo_5.png';
import image6 from '../../images/Photo_6.png';
let images_arr = [
    image1,
    image2,
    // image3,
    // image4,
    // image5,
    // image6
];
const IS_ANDROID = Platform.OS === 'android'

if (IS_ANDROID) UIManager.setLayoutAnimationEnabledExperimental(true)
const formStyle = { marginTop: 40 };

export default class Basicinfo extends Component {
    render() {
        const { isLoading, onLoginLinkPress, onSignupPress } = this.props
        return (
            <SafeAreaView style={{ flex: 1 }}>
                {Platform.OS === 'android' ? <StatusBar barStyle="dark-content" backgroundColor="#fff" /> : undefined}
                <ScrollView style={styles.container}>
                    <View style={styles.questionBox}>
                        <Text style={styles.questionTitle}>About Yourself</Text>
                    </View>
                    <View style={styles.answerBox}>
                        <KeyboardAvoidingView
                            keyboardVerticalOffset={-100}
                            behavior={'padding'}
                            style={[formStyle, styles.bottom]}
                        >
                            <View style={styles.formgroup}>
                                <Text style={styles.label}>
                                    {I18n.t('namelabel')}</Text>
                                <CustomTextInput
                                    name={'name'}
                                    ref={(ref) => this.nameInputRef = ref}
                                    // placeholder={I18n.t('namelabel')}
                                    keyboardType={'default'}
                                    editable={!isLoading}
                                    returnKeyType={'next'}
                                    blurOnSubmit={false}
                                    withRef={true}
                                    onSubmitEditing={() => this.phonenumberInputRef.focus()}
                                    onChangeText={(value) => this.setState({ email: value })}
                                    isEnabled={!isLoading}
                                />
                            </View>
                            <View style={styles.formgroup}>
                                <Text style={styles.label}>
                                    {I18n.t('dob_label')}</Text>
                                <CustomTextInput
                                    name={'name'}
                                    ref={(ref) => this.nameInputRef = ref}
                                    // placeholder={I18n.t('namelabel')}
                                    keyboardType={'default'}
                                    editable={!isLoading}
                                    returnKeyType={'next'}
                                    blurOnSubmit={false}
                                    withRef={true}
                                    onSubmitEditing={() => this.phonenumberInputRef.focus()}
                                    onChangeText={(value) => this.setState({ email: value })}
                                    isEnabled={!isLoading}
                                />
                            </View>
                            <View style={styles.formgroup}>
                                <Text style={styles.label}>
                                    {I18n.t('bio_label')}</Text>
                                <CustomTextInput
                                    style={{
                                        // flex: 1,
                                        backgroundColor: 'rgb(245,245,245)',
                                        borderRadius: 5,
                                        margin: IS_ANDROID ? -1 : 0,
                                        height: 42,
                                        // height: 100,
                                        padding: 7
                                    }}
                                    numberOfLines={4}
                                    multiline={true}
                                    name={'name'}
                                    ref={(ref) => this.nameInputRef = ref}
                                    keyboardType={'default'}
                                    editable={!isLoading}
                                    returnKeyType={'next'}
                                    blurOnSubmit={false}
                                    withRef={true}
                                    onSubmitEditing={() => this.phonenumberInputRef.focus()}
                                    onChangeText={(value) => this.setState({ email: value })}
                                    isEnabled={!isLoading}
                                />
                            </View>

                        </KeyboardAvoidingView>
                        <View style={styles.formgroup}>
                            <Text style={styles.label}>{I18n.t('gallary_label')}</Text>
                            {/* <Gallary /> */}
                        </View>
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

                </ScrollView>
            </SafeAreaView>
        )
    }
}
class Gallary extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: ds.cloneWithRows(images_arr),
        };
    }

    renderimages() {
        return (
            <View style={{
                justifyContent: 'center',
                flexDirection: 'row',
                flexWrap: 'wrap',
                flex: 1,
                backgroundColor: "red",
            }}>
                {
                    images_arr.map((val, index) => {
                        return <Image
                            key={index}
                            source={val}
                            style={{
                                width: '50%',// metrics.DEVICE_WIDTH * 0.51,
                                // height: metrics.DEVICE_HEIGHT * 0.3,
                                backgroundColor: "red",
                            }}
                            resizeMethod="resize"
                            resizeMode="contain"
                        />
                    })
                }
            </View>
        )

    }
    rendermoreImages() {
        return (
            <View style={{
                justifyContent: 'center',
                //    flexDirection: 'row',
                flexWrap: 'wrap',
                // flex: 1,
                backgroundColor: "red",
            }}>
                {
                    images_arr.map((val, index) => {
                        return <Image
                            source={val}
                            style={{
                                width: metrics.DEVICE_WIDTH * 0.3,
                                height: metrics.DEVICE_HEIGHT * 0.1,
                            }}
                            resizeMethod="resize"
                            resizeMode="contain"
                        />
                    })
                }
                <ListView
                    contentContainerStyle={styles.grid}
                    dataSource={this.state.dataSource}
                    renderRow={(item) => this.renderGridItem(item)}

                />
            </View>)

    }
    renderGridItem(item) {
        return (
            <Image
                source={item}
                style={{
                    width: '30%',// metrics.DEVICE_WIDTH * 0.51,
                    height: metrics.DEVICE_HEIGHT * 0.3,
                    paddingHorizontal: 10,//'1.5%'
                    marginHorizontal: '1.55%'
                    // backgroundColor:"red",
                }}
                resizeMethod="resize"
                resizeMode="contain"
            />
        )
    }
    render() {
        return (
            <View style={{
                flexWrap: "wrap",
                backgroundColor: "blue",
                flex: 1,
            }}>

              
                    <Image
                        source={require('../../images/Photo_1.png')}
                        style={{
                            width: '50%', //metrics.DEVICE_WIDTH * 0.51,
                            height: '30%'// metrics.DEVICE_HEIGHT * 0.3,
                            // backgroundColor:"red"
                        }}
                        resizeMethod="resize"
                        resizeMode="contain"
                    />
                <View style={{
                    // flexWrap: "wrap",
                    flex: 4,
                }}>
                    {
                        images_arr.length <= 1 ? this.renderimages() : this.rendermoreImages()
                    }
                </View>


                {/* <ListView 
                contentContainerStyle={styles.grid}
                dataSource={this.state.dataSource}
                renderRow={(item) => this.renderGridItem(item)}

                /> */}
                {/* <View style={{ 
                    flex: 5, 
                    flexDirection: "row", backgroundColor: "#009933",  }}>
                    <View style={{ 
                        flex: 6,
                        justifyContent : "center",
                        alignItems:"center",
                        //  backgroundColor: "#009933", 
                         }}>
                        <Image
                            source={require('../../images/Photo_1.png')}
                            style={{
                                width: '100%', //metrics.DEVICE_WIDTH * 0.51,
                                height: '100%'// metrics.DEVICE_HEIGHT * 0.3,
                                // backgroundColor:"red"
                            }}
                            resizeMethod="resize"
                            resizeMode="contain"
                        />
                    </View>
                    <View style={{ 
                        justifyContent: "space-between", 
                        flex: 4,
                        justifyContent : "center",
                        alignItems:"center"}}>
                        <Image source={require('../../images/Photo_2.png')}
                            style={{
                                width:'100%',// metrics.DEVICE_WIDTH * 0.30,
                                height: 100//metrics.DEVICE_HEIGHT * 0.17,
                                // backgroundColor:"blue"

                            }}
                            resizeMethod="resize"
                            resizeMode="contain"
                        />
                        <Image source={require('../../images/Photo_3.png')}
                            style={{
                                width:'100%',// metrics.DEVICE_WIDTH * 0.30,
                                height: 100//metrics.DEVICE_HEIGHT * 0.17,
                                // backgroundColor:"green"

                            }}
                            resizeMethod="resize"
                            resizeMode="contain"
                        />
                    </View>
                </View>
                <View style={{ 
                    flex:4, 
                    flexDirection : "row", 
                    justifyContent:"space-between", 
                    alignItems:"center",
                    // backgroundColor:"red"
                    }}>
                <Image source={require('../../images/Photo_4.png')} 
                 style={{
                    width:'30%', //metrics.DEVICE_WIDTH * 0.25,
                    height: metrics.DEVICE_HEIGHT * 0.15,
                    // backgroundColor:"red"
                }}
                resizeMethod="resize"
                resizeMode="contain" 
                />
                <Image source={require('../../images/Photo_5.png')}  
                style={{
                    width:'30%', //metrics.DEVICE_WIDTH * 0.25,
                        height: metrics.DEVICE_HEIGHT * 0.15,
                        // backgroundColor:"green"
                    }}
                    resizeMethod="resize"
                    resizeMode="contain" 
                    />
                <Image source={require('../../images/Photo_6.png')}
                 style={{
                    width:'30%', //metrics.DEVICE_WIDTH * 0.25,
                    height: metrics.DEVICE_HEIGHT * 0.15,
                    // backgroundColor:"blue"

                }}
                resizeMethod="resize"
                resizeMode="contain" 
                />

                </View> */}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        // paddingVertical: 50,
        marginVertical: 20

    },
    grid: {
        // flex:1,
        flexDirection: "row",
        // paddingHorizontal :'1.5%'
    },
    questionBox: {
        // backgroundColor: 'rgb(233,233,234)',
        paddingHorizontal: 30
    },
    questionTitle: {
        color: '#313138',
        fontSize: 30,
        marginTop: 10,
        fontFamily: 'Avenir-Heavy',
    },
    label: {
        color: "#D43C87",
        fontFamily: "Avenir-Medium",
        fontSize: 11
    },
    answerBox: {
        // backgroundColor: 'rgb(233,233,234)',

        // backgroundColor:"red",
        paddingHorizontal: 32,
        // paddingVertical: 10
    },
    formgroup: {
        // backgroundColor:"red",
        paddingVertical: 9
        // paddingTop: 4
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