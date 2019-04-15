import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
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
import moment from 'moment'
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
            allOpen: false,
            fromTime: '',
            toTime: '',
            is_changeLanguage: false
        };
    }
    saveUserSettings = async (success) => {
        var token = this.props.token;
        await AsyncStorage.setItem("localsetting", JSON.stringify(data))
        await AsyncStorage.setItem("localfilter", JSON.stringify(localfilter))
        var postData = Object.assign({}, data, localfilter)
        console.log("saveUserSettings_data", postData)

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
                console.log("speeddatingSettings", Data && Data.speeddatingSettings)
                if (Data && Data.speeddatingSettings && Data.speeddatingSettings && Array.isArray(Data.speeddatingSettings.timeSlot)) {
                    console.log("daysArray", daysArray)

                    if (Data.speeddatingSettings.timeSlot) {
                        daysArray.map((day) => {
                            let isExist = _.filter(Data.speeddatingSettings.timeSlot, (timeslot) => {
                                return _.isEqual(timeslot.day.toLowerCase(), day.day.toLowerCase());
                            });
                            console.log("isExist", isExist)
                            if (isExist && Array.isArray(isExist) && isExist.length) {
                                day['isSelected'] = true;
                            }
                        });
                    }
                    console.log("daysArray", daysArray)
                }
                this.setState({
                    compatibilityPercentage: filterData && filterData.compatibilityPercentage ? [parseInt(filterData.compatibilityPercentage)] : [0],
                    newmatch: Data && Data.newMatchNotification ? Data.newMatchNotification : false,
                    newmsg: Data && Data.newMessageNotification ? Data.newMessageNotification : false,
                    newwink: Data && Data.newWinkNotification ? Data.newWinkNotification : false,
                    privateAccount: Data && Data.isAccountPrivate ? Data.isAccountPrivate : false,
                    daysArray: daysArray,
                    dateselect: Data && Data.speeddatingSettings && Data.speeddatingSettings.timeSlot && Data.speeddatingSettings.timeSlot.length ? true : false,

                    allOpen: Data && Data.speeddatingSettings && Data.speeddatingSettings.allOpen ? Data.speeddatingSettings.allOpen : false,

                    fromTime: Data && Data.speeddatingSettings && Data.speeddatingSettings.timeSlot && Data.speeddatingSettings.timeSlot.length && Data.speeddatingSettings.timeSlot[0].fromTime ? this.generateTimeString(Data.speeddatingSettings.timeSlot[0].fromTime)
                        // Data.speeddatingSettings[0].fromTime 
                        : '',
                    toTime: Data && Data.speeddatingSettings && Data.speeddatingSettings.timeSlot && Data.speeddatingSettings.timeSlot.length && Data.speeddatingSettings.timeSlot[0].toTime ? this.generateTimeString(Data.speeddatingSettings.timeSlot[0].toTime)
                        // Data.speeddatingSettings[0].toTime 
                        : ''
                })
            }
        } catch (error) {
            console.log("getlocalsetting_error", error)
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
        daysArray = _.map(daysArray, obj=> { return {...obj, isSelected:false }})
        console.log("allopenSetting_daysArray", daysArray)
        this.setState({ 
            allOpen: state,
            daysArray: daysArray
        })
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
            daysArray: this.state.daysArray,
            allOpen: false
        })
    }
    availableDays = () => {
        return this.state.daysArray ? this.state.daysArray.map((value, index) => {
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
            : undefined
    }
    gettime(date) {
        console.log("gettime", date)
        var hour = date.getHours();
        var minutes = date.getMinutes();
        return moment(date).format("HH:mm")
        // return hour + ":" + minutes

    }
    validation() {
        var { daysArray, fromTime, toTime } = this.state;
        var daysArray_length = _.size(_.filter(this.state.daysArray, obj => { return obj.isSelected === true }))
        if (daysArray && daysArray_length) {
            // if (!fromTime) {
            //     console.log("i am not valid")
            //     return false
            // } else if (!toTime) {
            //     return false
            // } else {
            //     return true
            // }

        } else {
            // data.speeddatingSettings = [];
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
        var newArr 
        var days = _.filter(this.state.daysArray, obj => { return obj.isSelected === true });
        console.log("saveSpeeddatingsettings_days", days)
        if(this.state.allOpen){
            data.speeddatingSettings = { allOpen: true };

        }else if (days && Array.isArray(days) && days.length) {
            let result = _.map(days, object => { return _.omit(object, ['isSelected']) })
            this.state.fromTime && this.state.toTime ?
            newArr  = result.map(el => ({ day : el.day.toLowerCase(), ...{ fromTime:  this.gettime(this.state.fromTime), toTime: this.gettime(this.state.toTime) } }))
            :    
            newArr = result.map(el => ({ day : el.day.toLowerCase() }));                
            
            data.speeddatingSettings = { allOpen: false, timeSlot: newArr };;
            console.log("saveSpeeddatingsettings_result", result)
            console.log("saveSpeeddatingsettings", newArr)
        } else {
            data.speeddatingSettings = { allOpen: this.state.allOpen };
            // console.log("allopenSetting", data)
        }
        console.log("allopenSetting", data)

        this.saveUserSettings(success => {
            if (success) {
                this.setState({
                    speeddatingsettingsmodal: false
                })
            }
        })
    }
    formatAMPM(date) {
        // console.log("formatAMPM", date)
        // console.log( moment(date, 'ddd DD-MMM-YYYY, hh:mm A').format('hh:mm A') );

        // var hours = date.getHours();
        // var minutes = date.getMinutes();
        // var ampm = hours >= 12 ? 'PM' : 'AM';
        // hours = hours % 12;
        // hours = hours ? hours : 12; // the hour '0' should be '12'
        // minutes = minutes < 10 ? '0' + minutes : minutes;
        // var strTime = hours + ':' + minutes + ' ' + ampm;
        // console.log("strTime", strTime)
        return moment(date, 'ddd DD-MMM-YYYY, hh:mm A').format('hh:mm A');
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {!this.state.speeddatingsettingsmodal ?
                    <ScrollView>
                        <View style={{ justifyContent: "flex-end", paddingHorizontal: 16, paddingTop: 16, paddingBottom: 4 }}>
                            <Text style={{ fontFamily: "Avenir-Medium", fontSize: 15, color: "#909096" }}>{i18n.t('languagesettingslabel')}</Text>
                        </View>
                        <TouchableOpacity onPress={() => this.setState({ is_changeLanguage: true })} style={{ height: 58, backgroundColor: "rgba(255,255,255,100)", paddingHorizontal: 16, borderBottomColor: "rgba(245,245,245,100)", borderBottomWidth: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={{ fontFamily: "Avenir-Medium", fontSize: 17, color: "#3E3E47" }}>
                                Language</Text>
                            <Text>{i18n.translations[this.props.language].id}</Text>
                        </TouchableOpacity>

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
                                <Text style={{ fontFamily: "Avenir-Medium", fontSize: 15, color: "#D43C87" }}>{i18n.t('donelabel')}</Text>
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
                                        <View onPress={() => this.allopenSetting()}
                                            style={{ height: 54, borderRadius: 5, backgroundColor: "rgba(255,255,255,100)", paddingHorizontal: 10, borderBottomColor: "rgba(245,245,245,100)", borderBottomWidth: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                            <Text style={{ fontFamily: "Avenir-Medium", fontSize: 17, color: "#3E3E47" }}>
                                                All Open</Text>

                                            {/* <View style={{ backgroundColor: "transparent" }}>
                                                <Image source={ this.state && this.state.allOpen ? checked : unchecked}
                                                    style={{
                                                        width: 24, height: 24,
                                                    }}
                                                    resizeMethod='resize'
                                                    resizeMode="contain"
                                                />
                                            </View> */}
                                            <Toggle
                                                isOn={this.state.allOpen}
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
                <Modal
                    backdropOpacity={0.3}
                    isVisible={this.state.is_changeLanguage}
                    onSwipe={() => this.setState({ is_changeLanguage: false })}
                    swipeDirection="down"
                    // scrollTo={this.handleScrollTo}
                    style={{ margin: 0, }}>
                    <View style={{ flex: 1 }} />
                    <View style={{ flex: 0, backgroundColor: "#FFF" }}>
                        <Text style={{ color: global.gradientprimary, fontFamily: "Avenir-Medium", fontSize: 14, marginVertical: 10, textAlign: "center" }}>{i18n.t('selectlanguage')}  </Text>
                        <View style={{ backgroundColor: "#909096", height: 1 }} />
                        {this.renderLanguage()}
                        <View style={{ backgroundColor: "#909096", height: 1 }} />
                        <TouchableOpacity style={{ width: '100%', alignItems: "center", justifyContent: "center" }} onPress={() => this.setState({ is_changeLanguage: false})}>
                            <Text style={{ color: global.gradientsecondry, fontFamily: "Avenir-Heavy", fontSize: 20, marginVertical: 10 }} > {i18n.t('cancel')} </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height:30}} />
                </Modal>
            </View>
        );
    }
    changeMyLocalLanguage(item) {
        this.setState({
            is_changeLanguage: !this.state.is_changeLanguage
        }, this.props.savelocallanguage(item))
    }
    renderLanguage() {
        const { language } = this.props;
        console.log("language12346546579879", language)
        return Object.keys(i18n.translations).map((item, index) => {
            console.log("language12346546579879_afetr", item);
            return (
                <TouchableOpacity onPress={() => this.changeMyLocalLanguage(item)} style={[styles.language_button, { backgroundColor: item === language ? 'rgba(39, 49, 116, 50)' : "#FFF" }]} key={index}>
                    <Text style={{ color: item === language ? "#FFF" : global.gradientsecondry, fontFamily: "Avenir-Heavy", fontSize: 17 }}>{i18n.translations[item].id}</Text>
                </TouchableOpacity>
            )
        })
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
        if (prevProps && prevProps.isOn !== this.props.isOn) {
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
    },
    language_button: {
        height: 45,
        alignItems: "center",
        justifyContent: "center",
    },

}

{/* <Modal
                    backdropOpacity={0.5}
                    isVisible={this.state.speeddatingsettingsmodal}
                    onBackdropPress={() => this.setState({ speeddatingsettingsmodal: false })}
                    onBackButtonPress={() => this.setState({ speeddatingsettingsmodal: false })}
                    style={{ padding: 0, margin: 0, backgroundColor: "#FFF" }}
                >*/}