import React, { Component } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Easing } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import i18n from 'react-native-i18n'
import CustomButton from '../CustomButton'

const knobOffset = 25
export default class SettingsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            refreshing: false,
            newmatch: true,
            newmsg: true,
            newwink: true,
            privateAccount: true
        };
    }
    newMatch(state) {
        this.setState({ newmatch: state })
    }
    newMessage(state) {
        this.setState({ newmsg: state })
    }
    newWink(state) {
        this.setState({ newwink: state })
    }
    accontSetting(state) {
        this.setState({ privateAccount: state })
    }
    render() {
        let { fadeAnim } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ flex: 1, }}>
                    <View style={{ height: 40, justifyContent: "flex-end", paddingHorizontal:15 }}>
                        <Text style={{ fontFamily: "Avenir-Medium", lineHeight: 30, fontSize: 15, color: "#909096" }}>{i18n.t('notificationsettingsLabel')}</Text>
                    </View>
                    <View style={{ height: 58, backgroundColor: "rgba(255,255,255,100)", paddingHorizontal: 15, borderBottomColor: "rgba(245,245,245,100)", borderBottomWidth: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{ fontFamily: "Avenir-Medium", fontSize: 17, color: "#3E3E47" }}>
                            New Matches</Text>
                        <Toggle
                            isOn={this.state.newmatch}
                            onToggle={state => this.newMatch(state)}
                        />
                    </View>
                    <View style={{ height: 58, backgroundColor: "rgba(255,255,255,100)", paddingHorizontal: 15, borderBottomColor: "rgba(245,245,245,100)", borderBottomWidth: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{ fontFamily: "Avenir-Medium", fontSize: 17, color: "#3E3E47" }}>
                            New Message</Text>
                        <Toggle
                            isOn={this.state.newmsg}
                            onToggle={state => this.newMessage(state)}
                        />
                    </View>
                    <View style={{ height: 58, backgroundColor: "rgba(255,255,255,100)", paddingHorizontal: 15, borderBottomColor: "rgba(245,245,245,100)", borderBottomWidth: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{ fontFamily: "Avenir-Medium", fontSize: 17, color: "#3E3E47" }}>
                            New Wink</Text>
                        <Toggle
                            isOn={this.state.newwink}
                            onToggle={state => this.newWink(state)}
                        />
                    </View>
                    <View style={{ height: 45, justifyContent: "flex-end", paddingHorizontal:15 }}>
                        <Text style={{ fontFamily: "Avenir-Medium", fontSize: 15, color: "#909096" }}>{i18n.t('privacysettingsLabel')}</Text>

                    </View>
                    <View style={{ height: 58, backgroundColor: "rgba(255,255,255,100)", paddingHorizontal: 15, borderBottomColor: "rgba(245,245,245,100)", borderBottomWidth: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{ fontFamily: "Avenir-Medium", fontSize: 17, color: "#3E3E47" }}>
                            Private Account</Text>
                        <Toggle
                            isOn={this.state.privateAccount}
                            onToggle={state => this.accontSetting(state)}
                        />
                    </View>
                    <View style={{ paddingHorizontal:15, height:80, justifyContent:"space-between"}}>
                    <Text style={{ fontFamily: "Avenir-Medium", lineHeight: 19,fontSize: 13, color: "#909096" }}>{i18n.t('warningmsg')}</Text>
                    <Text style={{ fontFamily: "Avenir-Medium", lineHeight: 25, fontSize: 15, color: "#909096" }}>{i18n.t('accountsettings')}</Text>
                        </View>
                    
                    <View style={{ height: 58, backgroundColor: "rgba(255,255,255,100)", paddingHorizontal: 10, borderBottomColor: "rgba(245,245,245,100)", borderBottomWidth: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{ fontFamily: "Avenir-Medium", fontSize: 17, color: "#3E3E47" }}>
                            Change Password</Text>
                        </View>
                </ScrollView>
                <View style={{
                    height: '20%',
                    // backgroundColor:"#009933",
                    bottom: 0,
                    justifyContent: "space-around"
                }}>
                    <LinearGradient
                        colors={['#DB3D88', '#273174']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        style={{ width: '80%', alignSelf: "center", borderRadius:5 }}>
                        <CustomButton
                            text={i18n.t('signoutButton')}
                            textStyle={{ fontFamily: "Avenir-Heavy", fontSize: 17, color: "#FFFFFF"}}

                        />
                    </LinearGradient>
                    <CustomButton
                        text={i18n.t('deleteaccountButton')}
                        textStyle={{ fontFamily: "Avenir-Heavy", fontSize: 17, color: "#D0021B" }}
                        buttonStyle={{ width: '80%', alignSelf: "center", borderWidth: 0 }}
                    />
                </View>
            </View>
        );
    }
}

class Toggle extends React.Component {
    static defaultProps = {
        isOn: false,
    }

    state = {
        isOn: this.props.isOn,
        animatedValue: new Animated.Value(this.props.isOn ? knobOffset : 3),
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
                    // borderWidth:1,
                    // borderColor:"#696969"
                }, styles.elevated_shdow]}
                onPress={() => this.handlePress()}
            >
                <Animated.View style={[{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: "#FFF",
                    // borderColor:"#696969",
                    // borderWidth:1,
                    transform: [{
                        translateX: this.state.animatedValue,
                    }]
                }, styles.elevated_shdow]}
                />
            </TouchableOpacity>
        )
    }
}
const styles= {
    elevated_shdow: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 3,
        shadowColor: 'black',
    }
}