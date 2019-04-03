import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    Easing,
    AsyncStorage,
    Image,
    Switch,
    Platform,
    Picker,
    TouchableWithoutFeedback
} from "react-native";
import CustomSlider from 'react-native-custom-slider';
import LinearGradient from 'react-native-linear-gradient';
import _ from 'lodash';
import i18n from 'react-native-i18n'
import CustomButton from '../CustomButton';
import Apirequest from '../Common/Apirequest'
import metrics from '../../config/metrics';
import Modal from "react-native-modal";
import checked from '../../../assets/icons/checked.png';
import unchecked from '../../../assets/icons/unchecked.png';
import DateTimePicker from "react-native-modal-datetime-picker";

var IS_Android = Platform.OS === 'android';

const knobOffset = 25;
var data = {};
var localfilter = {};
var daysArray = [
    { day: "Monday", isSelected: false },
    { day: "Tuesday", isSelected: false },
    { day: "Wednesday", isSelected: false },
    { day: "Thursday", isSelected: false },
    { day: "Friday", isSelected: false },
    { day: "Saturday", isSelected: false },
    { day: "Sunday", isSelected: false }
];

export default class SettingsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            compatibilityPercentage: [0],
            loading: false,
            refreshing: false,
            newmatch: true,
            newmsg: true,
            newwink: true,
            privateAccount: true,
            dateselect: true,
            daysArray: daysArray,
            speeddatingsettingsmodal: false,
            fromTime_showPicker: false,
            allopen: false,
            fromTime: '',
            toTime: ''
        };
    }
    saveUserSettings = async (success) => {
        var token = this.props.token;
        await AsyncStorage.setItem("localsetting", JSON.stringify(data))

        await AsyncStorage.setItem("localfilter", JSON.stringify(localfilter))

        var postData = Object.assign({}, data, localfilter)
        console.log("saveUserSettings_data", postData )

        Apirequest.saveUserSettings(token, postData, resolve => {
            if (success) {
                return success({ data: "user Setting Saved" })
            }
            console.log("saveUserSettings_resolve", resolve)
        }, reject => {
            console.log("saveUserSettings_reject", reject)
        })
    }
    componentDidMount() {
        this.getlocalsetting()
    }
    storLocalstate = async () => {
    }
    generateTimeString = (timeString) => {
        // var hoursString = _.split(timeString, ':')[0];
        // var minutesString = _.split(timeString, ':')[1];
        // console.log("hoursString", hoursString)
        // console.log("minutesString", minutesString)
        // var myDate = new Date();
        // const gethours = myDate.getHours();
        // const getminutes = myDate.getMinutes();
        // var prevalidString = _.replace(myDate, new RegExp( gethours), hoursString);
        // var valid = _.replace(myDate, new RegExp(getminutes), minutesString);
        var d = "01-01-2000 " + timeString;
        var valid = new Date(d);
        // console.log("valid", valid)
        return valid;
    }
    getlocalsetting = async () => {
        try {
            var Data = await AsyncStorage.getItem("localsetting")
            var filterData = await AsyncStorage.getItem("localfilter")

            // console.log("filterData", filterData)
            if (Data && typeof Data == "string" && filterData && typeof filterData == "string") {
                Data = JSON.parse(Data);
                filterData = JSON.parse(filterData);
                data = Data
                console.log("data.......", Data)
                console.log("filterData.......", filterData)
                const newArr = Data && Data.speeddatingSettings && Data.speeddatingSettings.timeSlot && Array.isArray(Data.speeddatingSettings.timeSlot) ? Data.speeddatingSettings.timeSlot.map(el => ({ ...el, ...{ isSelected: true } })) : [];
                let result = _.map(newArr, object => { return _.omit(object, ['fromTime', 'toTime']) })
                var mergedresult = _.unionBy(result, daysArray, "day");

                this.setState({
                    compatibilityPercentage: filterData && filterData.compatibilityPercentage ? [parseInt(filterData.compatibilityPercentage)] : [0],
                    newmatch: Data && Data.newMatchNotification ? Data.newMatchNotification : false,
                    newmsg: Data && Data.newMessageNotification ? Data.newMessageNotification : false,
                    newwink: Data && Data.newWinkNotification ? Data.newWinkNotification : false,
                    privateAccount: Data && Data.isAccountPrivate ? Data.isAccountPrivate : false,
                    daysArray: Data && Data.speeddatingSettings ? mergedresult : daysArray,
                    dateselect: Data && Data.speeddatingSettings.length ? true : false,
                    allopen: Data && Data.allOpen ? Data.allOpen : false,
                    fromTime: Data && Data.speeddatingSettings.length ? this.generateTimeString(Data.speeddatingSettings[0].fromTime)
                        // Data.speeddatingSettings[0].fromTime 
                        : '',
                    toTime: Data && Data.speeddatingSettings.length ? this.generateTimeString(Data.speeddatingSettings[0].toTime)
                        // Data.speeddatingSettings[0].toTime 
                        : ''
                })
                console.log("getlocalsetting===========>", mergedresult)
            }
        } catch (error) {
            console.log("error", error)
        }
    }
    newMatch(state) {
        data.newMatchNotification = state
        this.setState({ newmatch: state }, () => this.saveUserSettings())
    }
    newMessage(state) {
        data.newMessageNotification = state
        this.setState({ newmsg: state }, () => this.saveUserSettings())
    }
    newWink(state) {
        data.newWinkNotification = state
        this.setState({ newwink: state }, () => this.saveUserSettings())
    }
    accontSetting(state) {
        data.isAccountPrivate = state;
        this.setState({ privateAccount: state }, () => this.saveUserSettings())
    }
    allopenSetting(state) {
        data.speeddatingSettings = { allOpen :state};
        console.log("allopenSetting", data)
        this.setState({ allOpen: !this.state.allOpen }, () => this.saveUserSettings())
    }
    compatibilityPercentage(value) {
        localfilter.compatibilityPercentage = value.toString()
        console.log("compatibilityPercentage_localfilter", localfilter)
        this.setState({
            compatibilityPercentage: [value],
        }, () => this.saveUserSettings())
        // console.log("compatibilityPercentage", data)
    }
    selectedDays(value) {
        value.isSelected ? value.isSelected = false : value.isSelected = true;
        this.setState({
            daysArray: this.state.daysArray
        })
    }
    availableDays = () => {
        return this.state.daysArray.map((value, index) => {
            return <TouchableOpacity onPress={() => this.selectedDays(value)}
                style={{
                    height: 44,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTopColor: "#F5F5F5",
                    borderTopWidth: 1
                }} key={index}>
                <Text style={{ color: "#909096", fontFamily: "Avenir-Medium", fontSize: 17 }}>{value.day}</Text>
                <Image source={value.isSelected ? checked : unchecked}
                    style={{
                        width: 24, height: 24,
                    }}
                    resizeMethod='resize'
                    resizeMode="contain"
                />
            </TouchableOpacity>
        })
    }
    gettime(date) {
        var hour = date.getHours();
        var minutes = date.getMinutes();
        return hour + ":" + minutes

    }
    validation() {
        var { daysArray, fromTime, toTime } = this.state;
        var daysArray_length = _.size(_.filter(this.state.daysArray, obj => { return obj.isSelected === true }))

        //    console.log("daysArray", daysArray)
        //    console.log("daysArray_length", daysArray_length)
        //    console.log("fromTime", fromTime)
        //    console.log("toTime", toTime)

        if (daysArray && daysArray_length) {
            if (!fromTime) {
                console.log("i am not valid")
                return false
            } else if (!toTime) {
                return false
            } else {
                return true
            }

        } else {
            data.speeddatingSettings = [];
            this.saveUserSettings(success => {
                this.setState({
                    fromTime: '',
                    toTime: '',
                    speeddatingsettingsmodal: false
                })
            })
        }
        return true
    }
    saveSpeeddatingsettings() {
        console.log("validation", this.validation())
        console.log("validationof+toTime", this.state.toTime)
        if (!this.validation()) {
            return
        }
        var days = _.filter(this.state.daysArray, obj => { return obj.isSelected === true });

        let result = _.map(days, object => { return _.omit(object, ['isSelected']) })
        const newArr = result.map(el => ({ ...el, ...{ fromTime: this.gettime(this.state.fromTime), toTime: this.gettime(this.state.toTime) } }));
        data.speeddatingSettings = newArr;
        this.saveUserSettings(success => {
            if (success) {
                this.setState({
                    speeddatingsettingsmodal: false
                })
            }

        })
        console.log("saveSpeeddatingsettings", newArr)
    }
    formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {!this.state.speeddatingsettingsmodal ?
                    <ScrollView>
                        <View style={{ justifyContent: "flex-end", paddingHorizontal: 16, paddingTop: 16, paddingBottom: 4 }}>
                            <Text style={{ fontFamily: "Avenir-Medium", fontSize: 15, color: "#909096" }}>{i18n.t('notificationsettingsLabel')}</Text>
                        </View>
                        <View style={{ height: 58, backgroundColor: "rgba(255,255,255,100)", paddingHorizontal: 16, borderBottomColor: "rgba(245,245,245,100)", borderBottomWidth: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={{ fontFamily: "Avenir-Medium", fontSize: 17, color: "#3E3E47" }}>
                                New Matches</Text>
                            <Toggle
                                isOn={this.state.newmatch}
                                onToggle={state => this.newMatch(state)}
                            />
                        </View>
                        <View style={{ height: 58, backgroundColor: "rgba(255,255,255,100)", paddingHorizontal: 16, borderBottomColor: "rgba(245,245,245,100)", borderBottomWidth: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={{ fontFamily: "Avenir-Medium", fontSize: 17, color: "#3E3E47" }}>
                                New Message</Text>
                            <Toggle
                                isOn={this.state.newmsg}
                                onToggle={state => this.newMessage(state)}
                            />
                        </View>
                        <View style={{ height: 58, backgroundColor: "rgba(255,255,255,100)", paddingHorizontal: 16, borderBottomColor: "rgba(245,245,245,100)", borderBottomWidth: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={{ fontFamily: "Avenir-Medium", fontSize: 17, color: "#3E3E47" }}>
                                New Wink</Text>
                            <Toggle
                                isOn={this.state.newwink}
                                onToggle={state => this.newWink(state)}
                            />
                        </View>
                        <View style={{ justifyContent: "flex-end", paddingHorizontal: 16, paddingTop: 24, paddingBottom: 4 }}>
                            <Text style={{ fontFamily: "Avenir-Medium", fontSize: 15, color: "#909096" }}>{i18n.t('privacysettingsLabel')}</Text>
                        </View>
                        <View style={{ height: 58, backgroundColor: "rgba(255,255,255,100)", paddingHorizontal: 16, borderBottomColor: "rgba(245,245,245,100)", borderBottomWidth: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={{ fontFamily: "Avenir-Medium", fontSize: 17, color: "#3E3E47" }}>
                                Private Account</Text>
                            <Toggle
                                isOn={this.state.privateAccount}
                                onToggle={state => this.accontSetting(state)}
                            />
                        </View>
                        <View style={{ paddingHorizontal: 16, paddingTop: 9, paddingBottom: 4 }}>
                            <Text style={{ fontFamily: "Avenir-Medium", fontSize: 13, color: "#909096" }}>{i18n.t('warningmsg')}</Text>
                            <Text style={{ fontFamily: "Avenir-Medium", fontSize: 15, color: "#909096", marginTop: 24 }}>{i18n.t('accountsettings')}</Text>
                        </View>
                        <TouchableOpacity onPress={() => this.props.navigate("changepassword")}
                            style={{
                                height: 58,
                                backgroundColor: "rgba(255,255,255,100)",
                                paddingHorizontal: 16,
                                borderBottomColor: "rgba(245,245,245,100)",
                                borderBottomWidth: 1,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>
                            <Text style={{ fontFamily: "Avenir-Medium", fontSize: 17, color: "#3E3E47" }}>Change Password</Text>
                            <Image
                                source={require('../../images/icons/right-arrow.png')}
                                style={{ width: 25, height: 25 }}
                                resizeMethod="resize"
                                resizeMode="contain" />
                        </TouchableOpacity>
                        <View style={{ justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 16, paddingBottom: 4, flexDirection: "row" }}>
                            <Text style={{ fontFamily: "Avenir-Medium", fontSize: 15, color: "#909096" }}>{i18n.t('compatibilitypercentagelable')}</Text>
                            <Text style={{ fontFamily: "Avenir-Medium", fontSize: 15, color: "#000" }}>{this.state.compatibilityPercentage.toLocaleString()} %</Text>
                        </View>
                        <View style={{ height: 58, backgroundColor: "rgba(255,255,255,100)", paddingHorizontal: 16, borderBottomColor: "rgba(245,245,245,100)", borderBottomWidth: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <CustomSlider
                                trackStyle={{
                                    height: 7,
                                    borderRadius: 3,
                                    backgroundColor: '#EFEFEF',
                                }}
                                selectedStyle={{
                                    backgroundColor: '#D43C87',
                                }}
                                pressedMarkerStyle={{
                                    top: 3,
                                    width: 36,
                                    height: 36,
                                    borderRadius: 18,
                                    backgroundColor: "#D43C87",
                                    borderWidth: 4,
                                    borderColor: "#FFF"
                                }}
                                markerStyle={{
                                    top: 3,
                                    width: 36,
                                    height: 36,
                                    borderRadius: 18,
                                    backgroundColor: "#D43C87",
                                    borderWidth: 4,
                                    borderColor: "#FFF"
                                }}
                                values={[parseInt(this.state.compatibilityPercentage[0])]}
                                sliderLength={metrics.DEVICE_WIDTH * 0.9}
                                onValuesChange={(values) => this.compatibilityPercentage(values)}
                                min={0}
                                max={100}
                                step={1}
                                allowOverlap
                                snapped
                            />
                        </View>
                        <View style={{
                            height: 58,
                            backgroundColor: "rgba(255,255,255,100)",
                            paddingHorizontal: 16,
                            borderBottomColor: "rgba(245,245,245,100)",
                            borderBottomWidth: 1,
                            justifyContent: "center",
                            // alignItems: "center"
                        }}>
                            <TouchableOpacity onPress={() => this.setState({ speeddatingsettingsmodal: true })}
                                style={{
                                    // flex: 1, 
                                    flexDirection: "row",
                                    justifyContent: "space-between"
                                }}>
                                <Text style={{ fontFamily: "Avenir-Medium", fontSize: 15, color: "#909096" }}>{i18n.t('speeddatingsettingslabel')}</Text>
                                <Image
                                    source={require('../../images/icons/right-arrow.png')}
                                    style={{ width: 25, height: 25 }}
                                    resizeMethod="resize"
                                    resizeMode="contain" />
                            </TouchableOpacity>
                        </View>
                        {/* <View style={{
                        // height: 58, 
                        backgroundColor: "rgba(255,255,255,100)",
                        paddingHorizontal: 16,
                        borderBottomColor: "rgba(245,245,245,100)",
                        borderBottomWidth: 1,
                        // flexDirection: "row", 
                        justifyContent: "space-between",
                        // alignItems: "center" 
                    }}>
                    </View> */}
                        <View style={{ paddingHorizontal: 16, paddingTop: 25, paddingBottom: 25 }}>
                            <LinearGradient
                                colors={['#DB3D88', '#273174']}
                                start={{ x: 0, y: 1 }}
                                end={{ x: 1, y: 1 }}
                                style={{ borderRadius: 5, marginBottom: 25 }}>
                                <CustomButton
                                    text={i18n.t('signoutButton')}
                                    textStyle={{ fontFamily: "Avenir-Heavy", fontSize: 17, color: "#FFFFFF" }}
                                />
                            </LinearGradient>
                            <CustomButton
                                text={i18n.t('deleteaccountButton')}
                                textStyle={{ fontFamily: "Avenir-Heavy", fontSize: 17, color: "#D0021B" }}
                                buttonStyle={{ borderWidth: 0 }}
                            />
                        </View>
                    </ScrollView>
                    :
                    <View style={{ flex: 1 }}>
                        <View style={styles.header}>
                            <TouchableOpacity
                                onPress={() => this.setState({ speeddatingsettingsmodal: false })}
                                style={{
                                    width: "15%",
                                    backgroundColor: "transparent",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}>
                                <Image
                                    source={require('../../images/icons/downarrow.png')}
                                    style={{
                                        width: metrics.DEVICE_WIDTH * 0.0588,
                                        height: metrics.DEVICE_HEIGHT * 0.023
                                    }}
                                    resizeMethod="resize"
                                    resizeMode="contain" />
                            </TouchableOpacity>
                            <View style={{ width: "65%", backgroundColor: "transparent", alignItems: "center", justifyContent: "center" }}>
                                <Text style={{ fontFamily: "Avenir-Heavy", fontSize: 17, color: "#3E3E47" }}>{i18n.t('speeddatingsettingtitle')}</Text>
                            </View>
                            <TouchableOpacity onPress={() => this.saveSpeeddatingsettings()} style={{
                                width: "20%",
                                backgroundColor: "transparent",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <Text style={{ fontFamily: "Avenir-Medium", fontSize: 15, color: "#D43C87" }}>done</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={{ paddingHorizontal: 16 }}>
                            <View style={{ justifyContent: "space-between", height: 40, marginVertical: 8 }}>
                                <TouchableOpacity onPress={() => this.setState({ dateselect: !this.state.dateselect })}
                                    style={styles.pickerButton}>
                                    <Text style={{ fontFamily: "Avenir-Medium", fontSize: 17, color: "#909096" }}>Select Day</Text>
                                    <Image
                                        source={require('../../images/icons/downarrow.png')}
                                        style={
                                            this.state.dateselect ? {
                                                width: 25, height: 25, marginHorizontal: 10,
                                                transform: [{ rotate: '180deg' }]

                                            } : {
                                                    width: 25,
                                                    height: 25, marginHorizontal: 10,
                                                    transform: [{ rotate: '0deg' }]
                                                }
                                        }
                                        resizeMethod="resize"
                                        resizeMode="contain" />
                                </TouchableOpacity>
                            </View>
                            {
                                this.state.dateselect ?
                                    <>
                                        {this.availableDays()}
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", height: 40 }}>
                                            <TouchableOpacity style={styles.pickerButton} onPress={() => this._hideDateTimePicker("fromtime")}>
                                                <Text style={{ fontFamily: "Avenir-Medium", fontSize: 17, color: "#909096" }}>{this.state.fromTime ? this.formatAMPM(this.state.fromTime) : "from"}</Text>
                                                <Image
                                                    source={require('../../images/icons/downarrow.png')}
                                                    style={{ width: 25, height: 25 }}
                                                    resizeMethod="resize"
                                                    resizeMode="contain" />
                                            </TouchableOpacity>
                                            <View style={{ width: 8 }} />
                                            <TouchableOpacity style={styles.pickerButton} onPress={() => this._hideDateTimePicker("totime")}>
                                                <Text style={{ fontFamily: "Avenir-Medium", fontSize: 17, color: "#909096" }}> {this.state.toTime ? this.formatAMPM(this.state.toTime) : "To"}</Text>
                                                <Image
                                                    source={require('../../images/icons/downarrow.png')}
                                                    style={{ width: 25, height: 25 }}
                                                    resizeMethod="resize"
                                                    resizeMode="contain" />
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                    :
                                    <>
                                        <View style={{ justifyContent: "flex-end", paddingHorizontal: 10, paddingTop: 10, paddingBottom: 4 }}>
                                            <Text style={{ fontFamily: "Avenir-Medium", fontSize: 15, color: "#909096" }}>{i18n.t('allopenLabel')}</Text>
                                        </View>
                                        <View style={{ height: 54,borderRadius: 5 ,backgroundColor: "rgba(255,255,255,100)", paddingHorizontal: 10, borderBottomColor: "rgba(245,245,245,100)", borderBottomWidth: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                            <Text style={{ fontFamily: "Avenir-Medium", fontSize: 17, color: "#3E3E47" }}>
                                                All Open</Text>
                                                
                                            <Toggle
                                                isOn={this.state.allopen}
                                                onToggle={state => this.allopenSetting(state)}
                                            />
                                        </View>

                                    </>
                            }
                        </ScrollView>
                    </View>
                    // </Modal>
                }
                <DateTimePicker
                    titleIOS="select time"
                    mode="time"
                    minuteInterval={30}
                    is24Hour={true}
                    isVisible={this.state.fromTime_showPicker}
                    onConfirm={this._handleDatePicked.bind(this)}
                    onCancel={this._hideDateTimePicker.bind(this)}
                />
                {/* <Modal backdropOpacity={0.5}
                                isVisible={this.state.fromTime_showPicker}
                                onBackdropPress={() => this.setState({ fromTime_showPicker: false })}
                                onBackButtonPress={() => this.setState({ fromTime_showPicker: false })}
                                style={{ padding: 0, margin: 0 }}>
                                <View style={{ marginTop: "80%", backgroundColor: "#FFF", }}>
                                    <View style={{ backgroundColor: "#FFF", height: 200 }}>
                                        <Picker
                                            selectedValue={this.props.dynamicvalue}
                                            style={{ height: 50, width: IS_Android ? 80 : undefined }}
                                            onValueChange={(itemValue, itemIndex) => this.selecttime(itemValue, itemIndex, this.props.answer)}
                                            itemStyle={styles.answerTxt}
                                        >
                                            {
                                                this.renderPickeroption()
                                            }
                                        </Picker>
                                    </View>
                                    <View style={{ flexDirection: "row", height: 50, backgroundColor: "#FFF", borderTopWidth: 1 }}>
                                        <TouchableOpacity style={{ flex: 1, height: 50, justifyContent: "center", alignItems: "center" }} onPress={() => this.setState({ fromTime_showPicker: false })}>
                                            <Text>Cancel</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal> */}
            </View>
        );
    }
    _hideDateTimePicker(e) {
        console.log("_hideDateTimePicker", e)
        this.setState({
            fromTime_showPicker: !this.state.fromTime_showPicker,
            mutiSwitch: e
        })
    }
    _handleDatePicked(values) {
        // var timeString = values;
        // var timeString = new Date(values);
        // var hour = timeString.getHours();
        // var minutes = timeString.getMinutes();
        // this.state.mutiSwitch === 'fromtime' ?
        // data.speeddatingSettings = { fromTime: hour + ":" + minutes }
        // :
        // data.speeddatingSettings = { toTime: hour + ":" + minutes }
        this.state.mutiSwitch === 'fromtime' ?
            this.setState({
                fromTime: values // hour + ":" + minutes
            }) : this.setState({
                toTime: values //hour + ":" + minutes
            })
        this._hideDateTimePicker()
    }
    // renderPickeroption() {
    //     return this.state.daysArray.map((facility, i) => {
    //         return <Picker.Item key={i} value={facility.day} label={facility.day} />
    //     })
    // }
}

class Toggle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOn: this.props.isOn,
            animatedValue: new Animated.Value(this.props.isOn ? knobOffset : 3),
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.isOn !== this.props.isOn) {
            this.setState(
                { isOn: this.props.isOn },
                () => {
                    Animated.timing(
                        this.state.animatedValue,
                        {
                            toValue: this.state.isOn ? knobOffset : 3,
                            easing: Easing.elastic(0.7),
                            duration: 100,
                        }
                    ).start()
                }
            )
        }
    }
    handlePress() {
        this.setState(
            { isOn: !this.state.isOn },
            () => this.props.onToggle(this.state.isOn)
        )
    }
    render() {
        return (
            <>
                {
                    IS_Android ?
                        <TouchableOpacity
                            activeOpacity={0.5}
                            style={[{
                                backgroundColor: this.state.isOn ? "#D43C87" : "#fff",
                                width: 60,
                                height: 37,
                                borderRadius: 35,
                                paddingVertical: 2,
                            }, styles.elevated_shdow]}
                            onPress={() => this.handlePress()}
                        >
                            <Animated.View style={[{
                                width: 32,
                                height: 32,
                                borderRadius: 16,
                                backgroundColor: "#FFF",
                                transform: [{
                                    translateX: this.state.animatedValue,
                                }]
                            }, styles.elevated_shdow]}
                            />
                        </TouchableOpacity>
                        :
                        <Switch
                            value={this.state.isOn}
                            // thumbColor={"#fff"}
                            trackColor={{ true: "#D43C87" }}
                            onValueChange={() => this.handlePress()}
                        />
                }
            </>
        )
    }
}
const styles = {
    elevated_shdow: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 3,
        shadowColor: 'black',
    },
    header: {
        height: 64,
        flexDirection: "row",
        borderBottomColor: "#F5F5F5",
        borderBottomWidth: 1
    },
    pickerButton: {
        flexDirection: "row",
        backgroundColor: "#F5F5F5",
        justifyContent: "space-between",
        alignItems: "center",
        flex: 1,
        borderRadius: 5,
        paddingHorizontal: 6
    }
}

{/* <Modal
                    backdropOpacity={0.5}
                    isVisible={this.state.speeddatingsettingsmodal}
                    onBackdropPress={() => this.setState({ speeddatingsettingsmodal: false })}
                    onBackButtonPress={() => this.setState({ speeddatingsettingsmodal: false })}
                    style={{ padding: 0, margin: 0, backgroundColor: "#FFF" }}
                >*/}