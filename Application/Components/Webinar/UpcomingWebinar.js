/**
 * Top-Profile page
 * Author :abhishekkalia
 */

import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    SafeAreaView,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import i18n from 'react-native-i18n';
import CustomButton from '../CustomButton'
const IS_ANDROID = Platform.OS === 'android'
import metrics from '../../config/metrics';
const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.05;
const header_height = metrics.DEVICE_HEIGHT * 0.41;
import backbutton from '../../images/icons/backbutton.png'

let tabOptions = ['Upcoming', 'All']

export default class UpcomingWebinar extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        const { goBack , navigate} = this.props.navigation;
        return (
            // <SafeAreaView 
            // style={{ flex: 1, backgroundColor:"#FFF"}}
            // >
            <ScrollView
                bounces={false}
                contentContainerStyle={styles.container}>
                <View style={{ height: header_height }}>
                    <TouchableOpacity
                        onPress={() => goBack()}
                        style={styles.backicon}
                    >
                        <Image
                            source={backbutton}
                            style={{
                                width: 22,
                                height: 16,
                            }}
                            resizeMethod="resize"
                            resizeMode="contain" />
                    </TouchableOpacity>

                    <Image source={require('../../images/webinar_video.png')}
                        style={{ flex: 1, height: 250, width: null }} resizeMethod="resize" />
                </View>
                <View style={{ height: '50%', paddingHorizontal: 15 }}>
                    <View style={styles.headertitle}>
                        <Text style={styles.title_text}>Webinar Name 1</Text>
                        <Text style={styles.type_text}>UPCOMING</Text>
                    </View>
                    <View style={styles.time_detail}>
                        <View style={styles.dateandduration}>
                            <Text style={styles.label_text}>DATE</Text>
                            <Text style={styles.label}>Oct 12, 2018</Text>
                        </View>
                        <View style={styles.dateandduration}>
                            <Text style={styles.label_text}>DURATION</Text>
                            <Text style={styles.label}>2:30 hours</Text>
                        </View>
                    </View>
                    <View style={styles.time_info}>
                        <Text style={styles.label_text}>TIMINGS</Text>
                        <Text style={styles.label}>16:00 - 18:30 IST</Text>
                    </View>
                    <View style={styles.description}>
                        <Text style={styles.label_text}>DESCRIPTION</Text>
                        <Text style={[styles.label, { color: "#3E3E47" }]}>When choosing a static caravan you will probably look for the holiday park which meets your requirements and then move onto the caravan.</Text>
                    </View>
                    <View style={styles.footer}>
                        <LinearGradient
                            colors={['#DB3D88', '#273174']}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.buttonStyle}>
                            <CustomButton
                            onPress={()=>navigate('subscribe')}
                                text={"ATTEND"}
                                buttonStyle={styles.buttonStyle}
                                textStyle={styles.buttonText}
                            />
                        </LinearGradient>
                    </View>
                </View>
            </ScrollView>
            // </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: "#FFF"
    },
    headertitle: {
        height: 80,
        // backgroundColor: "red",
        justifyContent: 'center'
    },
    title_text: {
        fontFamily: "Avenir-Heavy",
        fontSize: 24,
        color: "#3E3E47",
        lineHeight: 33
    },
    backicon: {
        width: 22,
        height: 16,
        position: "absolute",
        zIndex: 1,
        top: 50,
        left: 20
    },
    type_text: {
        fontFamily: "Avenir-Heavy",
        fontSize: 17,
        color: "#909096",
        lineHeight: 23
    },
    dateandduration: {
        flex: 1
    },
    label_text: {
        fontFamily: "Avenir-Medium",
        fontSize: 11,
        lineHeight: 15,
        color: "#D43C87"
    },
    label: {
        fontFamily: "Avenir-Medium",
        fontSize: 17,
        color: "#909096"
    },
    time_detail: {
        height: 60,
        // justifyContent:"center",
        alignItems: "center",
        flexDirection: "row",
        // backgroundColor:"#009933"
    },
    time_info: {
        height: 70,
        justifyContent: "center",
        // backgroundColor:"blue"
    },
    description: {
        height: 120,
        justifyContent: "space-between",
        // backgroundColor:"#696969"
    },
    footer: {
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor:"#009933",
        height: 100
    },
    buttonStyle: {
        width: '80%',
        alignSelf: "center",
        borderRadius: 5
    },
    buttonText: {
        fontFamily: "Avenir-Heavy",
        fontSize: 17,
        color: "#FFF"
    }
});
