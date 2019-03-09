import React, { Component } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Easing, AsyncStorage } from "react-native";
import CustomSlider from 'react-native-custom-slider';
import LinearGradient from 'react-native-linear-gradient';
import i18n from 'react-native-i18n'
import CustomButton from '../CustomButton';
import Apirequest from '../Common/Apirequest'
import metrics from '../../config/metrics';

const knobOffset = 25;
var data = {};
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
            privateAccount: true
        };
    }
    saveUserSettings = async ()=> {
        var token = this.props.token;
        await AsyncStorage.setItem("localsetting", JSON.stringify(data))
        await Apirequest.saveUserSettings(token, data, resolve => {
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
    getlocalsetting = async () => {
        try {
            var Data = await AsyncStorage.getItem("localsetting")
            if (Data && typeof Data == "string") {
                Data = JSON.parse(Data);
                // console.log('Data', Data);
            }
            console.log('Data', Data);

        } catch (error) {
            console.log("error", error)
        }
    }
    newMatch(state) {
        data.newMatchNotification = state
        this.setState({ newmatch: state })
    }
    newMessage(state) {
        data.newMessageNotification = state
        this.setState({ newmsg: state })
    }
    newWink(state) {
        data.newWinkNotification = state
        this.setState({ newwink: state })
    }
    accontSetting(state) {
        data.isAccountPrivate = state;
        this.setState({ privateAccount: state })
    }
    compatibilityPercentage(value) {
        data.compatibilityPercentage = value.toString()
        this.setState({
            compatibilityPercentage: [value],
        })
        console.log("compatibilityPercentage", data)
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <ScrollView>
                    <View style={{ justifyContent: "flex-end", paddingHorizontal: 16, paddingTop: 16, paddingBottom: 4 }}>
                        <Text style={{ fontFamily: "Avenir-Medium", lineHeight: 15, fontSize: 15, color: "#909096" }}>{i18n.t('notificationsettingsLabel')}</Text>
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
                        <Text style={{ fontFamily: "Avenir-Medium", lineHeight: 19, fontSize: 13, color: "#909096" }}>{i18n.t('warningmsg')}</Text>
                        <Text style={{ fontFamily: "Avenir-Medium", lineHeight: 25, fontSize: 15, color: "#909096", marginTop: 24 }}>{i18n.t('accountsettings')}</Text>
                    </View>
                    <View style={{ height: 58, backgroundColor: "rgba(255,255,255,100)", paddingHorizontal: 16, borderBottomColor: "rgba(245,245,245,100)", borderBottomWidth: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{ fontFamily: "Avenir-Medium", fontSize: 17, color: "#3E3E47" }}>Change Password</Text>
                    </View>
                    <View style={{ justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 16, paddingBottom: 4, flexDirection: "row" }}>
                        <Text style={{ fontFamily: "Avenir-Medium", lineHeight: 15, fontSize: 15, color: "#909096" }}>{i18n.t('compatibilitypercentagelable')}</Text>
                        <Text style={{ fontFamily: "Avenir-Medium", lineHeight: 15, fontSize: 15, color: "#909096" }}>{this.state.compatibilityPercentage.toLocaleString()}</Text>
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
                            values={[this.state.compatibilityPercentage[0]]}
                            sliderLength={metrics.DEVICE_WIDTH * 0.9}
                            onValuesChange={(values) => this.compatibilityPercentage(values)}
                            min={0}
                            max={100}
                            step={1}
                            allowOverlap
                            snapped
                        />
                    </View>
                    <View style={{ paddingHorizontal: 16, paddingTop: 80, paddingBottom: 25 }}>
                        <LinearGradient
                            colors={['#DB3D88', '#273174']}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 1 }}
                            style={{ borderRadius: 5, marginBottom: 32 }}>
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
            </View>
        );
    }
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
    }
}