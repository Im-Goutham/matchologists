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
import LinearGradient from 'react-native-linear-gradient';
import I18n from 'react-native-i18n';
import DateTimePicker from 'react-native-modal-datetime-picker';
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
];
let gender_arr = ["MALE", "FEMALE", "BOTH"];
const IS_ANDROID = Platform.OS === 'android'

if (IS_ANDROID) UIManager.setLayoutAnimationEnabledExperimental(true)
const formStyle = { marginTop: 40 };
export default class Basicinfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedgender: 0,
            isDateTimePickerVisible: false,
            selectedDate: "Select Date",
        }
    }
    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = date => {
        let today =  date, //new Date('Thu Dec 12 2018 19:08:04 GMT+0530 (IST)')
        currentdate= today.getFullYear() +'-'+ parseInt(today.getMonth()+1) + '-'+ today.getDate() ;
        this.setState({ 
            selectedDate: currentdate //date.toString() 
        });
        this._hideDateTimePicker();
    };

    render() {
        const { isDateTimePickerVisible, selectedDate, selectedgender } = this.state;
        const { navigate } = this.props.navigation;
        const { isLoading, onLoginLinkPress, onSignupPress } = this.props
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
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
                                    onSubmitEditing={() => this.bioInputRef.focus()}
                                    onChangeText={(value) => this.setState({ email: value })}
                                    isEnabled={!isLoading}
                                />
                            </View>
                            <View style={styles.formgroup}>
                                <Text style={styles.label}>
                                    {I18n.t('dob_label')}</Text>
                                <TouchableOpacity onPress={this._showDateTimePicker}
                                    style={{
                                        height: 52,
                                        backgroundColor: "rgba(245,245,245,100)", flexDirection: "row", alignItems: "center"
                                    }}>
                                    <Text style={{
                                        paddingLeft:10,
                                        width: metrics.DEVICE_WIDTH * 0.73,
                                        fontFamily: "Avenir-Medium",
                                        fontSize: 17,
                                        color: "#909096"
                                    }}>{selectedDate}</Text>

                                    <Image style={{ width: 19, height: 21 }}
                                        source={require('../../images/icons/calender_button.png')}
                                        resizeMethod="resize"
                                        resizeMode="contain" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.formgroup}>
                                <Text style={styles.label}>
                                    {I18n.t('gender_label')}
                                </Text>
                                <View style={{
                                    height: 42,
                                    borderWidth: 1,
                                    borderColor: "#F5F5F5",
                                    borderRadius: 21,
                                    flexDirection: "row",
                                    // justifyContent: "space-between",
                                    // alignItems: "center"
                                }}>
                                    {
                                        gender_arr.map((value, key) => {
                                            return (
                                                selectedgender === key ?
                                                    <LinearGradient key={key}
                                                        colors={['#DB3D88', '#273174']}
                                                        start={{ x: 0, y: 1 }}
                                                        end={{ x: 1, y: 1 }}
                                                        style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "red", borderRadius: 21 }}
                                                    >

                                                        <Text style={{
                                                            fontFamily: "Avenir-Heavy",
                                                            fontSize: 17,
                                                            color: "#FFF"
                                                        }}>{value}</Text>
                                                    </LinearGradient>
                                                    :
                                                    <TouchableOpacity key={key} onPress={() => this.setState({ selectedgender: key })}
                                                        style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#FFF", borderRadius: 21 }}
                                                    >
                                                        <Text style={{
                                                            fontFamily: "Avenir-Heavy",
                                                            fontSize: 17,
                                                            color: "#909096"
                                                        }}>{value}</Text>
                                                    </TouchableOpacity>
                                            )
                                        })
                                    }
                                </View>
                            </View>

                            <View style={styles.formgroup}>
                                <Text style={styles.label}>
                                    {I18n.t('bio_label')}</Text>
                                    <View   style={{
                                        // flex: 1,
                                        backgroundColor: 'rgba(245,245,245, 100)',
                                        borderRadius: 5,
                                        margin: IS_ANDROID ? -1 : 0,
                                        height: 100,
                                        padding: 7
                                    }}>
                                    <CustomTextInput
                                    // style={{
                                    //     // flex: 1,
                                    //     backgroundColor: 'rgba(245,245,245, 100)',
                                    //     borderRadius: 5,
                                    //     margin: IS_ANDROID ? -1 : 0,
                                    //     height: 42,
                                    //     // height: 100,
                                    //     padding: 7
                                    // }}
                                    numberOfLines={4}
                                    multiline={true}
                                    name={'name'}
                                    ref={(ref) => this.bioInputRef = ref}
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
                            </View>
                        </KeyboardAvoidingView>
                        <View style={styles.formgroup}>
                            <Text style={styles.label}>{I18n.t('gallary_label')}</Text>
                            <Gallary />
                        </View>
                        <LinearGradient
                            colors={['#DB3D88', '#273174']}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.signInButton}>
                            <CustomButton
                                text={I18n.t('start_button')}
                                onPress={() => navigate('questionnaire')}
                                textStyle={styles.signInButtonText}
                            />
                        </LinearGradient>
                    </View>
                </ScrollView>
                <DateTimePicker
                    isVisible={isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                />
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
    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity style={{ flex: 6.5, borderRadius: 10, overflow: "hidden" }}>
                        <Image
                            source={require('../../images/Photo_1.png')}
                            style={{
                                flex: 1,
                                width: null,
                                height: null,
                            }}
                            resizeMethod="resize"
                        // resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <View style={{ justifyContent: "space-between", alignItems: 'center', flex: 3.5, }}>
                        <Image
                            source={image2}
                            style={{
                                marginVertical:5,
                                width: metrics.DEVICE_WIDTH * 0.25,
                                height: metrics.DEVICE_WIDTH * 0.25,
                            }}
                            resizeMethod="resize"
                            resizeMode="contain"
                        />
                        <Image
                            source={image3}
                            style={{
                                marginVertical:5,
                                width: metrics.DEVICE_WIDTH * 0.25,
                                height: metrics.DEVICE_WIDTH * 0.25,
                            }}
                            resizeMethod="resize"
                            resizeMode="contain"
                        />
                    </View>
                </View>
                <View style={{
                    height: metrics.DEVICE_WIDTH * 0.28,
                    flexDirection: "row", justifyContent: "space-around", alignItems: 'center'
                }}>
                    <Image
                        source={image4}
                        style={{
                            width: metrics.DEVICE_WIDTH * 0.25,
                            height: metrics.DEVICE_WIDTH * 0.25,
                        }}
                        resizeMethod="resize"
                        resizeMode="contain"
                    />
                    <Image
                        source={image5}
                        style={{
                            width: metrics.DEVICE_WIDTH * 0.25,
                            height: metrics.DEVICE_WIDTH * 0.25,
                        }}
                        resizeMethod="resize"
                        resizeMode="contain"
                    />
                    <Image
                        source={image6}
                        style={{
                            width: metrics.DEVICE_WIDTH * 0.25,
                            height: metrics.DEVICE_WIDTH * 0.25,
                        }}
                        resizeMethod="resize"
                        resizeMode="contain"
                    />
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        marginVertical: 20
    },
    grid: {
        flexDirection: "row",
    },
    questionBox: {
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
        paddingHorizontal: 32,
    },
    formgroup: {
        paddingVertical: 9
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