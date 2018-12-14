/**
 * home page
 * Author :abhishekkalia
 */

import React, { Component } from 'react';
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
import Icons from 'react-native-vector-icons/AntDesign'
import I18n from 'react-native-i18n';
import metrics from '../../config/metrics'
import styles from './style'

const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.3
const IMAGE_HEIGHT = metrics.DEVICE_HEIGHT * 0.15
let IS_ANDROID = Platform.OS === 'android',
    menu_array = [
        {
            "label": "discover_label",
            "action_Page": "Home"
        },
        {
            "label": "match_label",
            "action_Page": "match_label"
        },
        {
            "label": "top_label",
            "action_Page": "topprofile"
        },
        {
            "label": "mycalender_label",
            "action_Page": "calender"
        },
        {
            "label": "notification_label",
            "action_Page": "notification"
        },
        // {
        //     "label": "feedback_label",
        //     "action_Page": "feedback"
        // },
        {
            "label": "setting_label",
            "action_Page": "setting"
        },
        {
            "label": "webinar_label",
            "action_Page": "webinar"
        }

    ]

export default class Sidebar extends Component {
    render() {
        const { navigate } = this.props.navigation;
        // console.log("this.props.navigation", this.props.navigation.state.routes)
        return (
            <LinearGradient
                colors={['#DB3D88', '#273174']}
                // start={{ x: 0, y: 1 }}
                // end={{ x: 1, y: 1 }}
                style={{ flex: 1 }}
            >
                <SafeAreaView style={{ flex: 1 }}>
                    <StatusBar barStyle="light-content" backgroundColor={IS_ANDROID ? "#DB3D88" : undefined} />
                    <View style={styles.container}>
                        <ScrollView >
                            {/* contentContainerStyle={styles.container}> */}
                            <View style={styles.profile}>
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.closeDrawer()}
                                    style={{ height: 50, alignSelf: "flex-start", justifyContent: "flex-end" }}>
                                    <Icons
                                        name="close"
                                        size={30}
                                        color="#fff"
                                        style={{
                                            alignSelf: 'flex-start',
                                            paddingHorizontal: 15
                                        }}
                                    />
                                </TouchableOpacity>
                                <View style={{ flex: 1, alignItems: "center", backgroundColor: "transparent", justifyContent: "space-around" }}>
                                    <Image
                                        source={require('../../images/Oval.png')}
                                        style={{
                                            width: 100, //IMAGE_WIDTH, 
                                            height: 100,//IMAGE_HEIGHT,
                                            // height :"44%",
                                            borderRadius: 50,
                                            // backgroundColor:"#fff"
                                        }}
                                        resizeMethod="resize"
                                        resizeMode="contain" />
                                    <Text style={styles.usertitle}>Addie Olson</Text>

                                </View>

                            </View>
                            <View style={styles.menu}>
                                {
                                    menu_array.map((item, index) => {
                                        return <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate(item.action_Page)} >
                                            <Text style={styles.label}>{I18n.t(item.label)}</Text>
                                        </TouchableOpacity>
                                    })
                                }
                            </View>
                        </ScrollView>
                        <View style={styles.logout}>
                            <Text style={[styles.label, { color: "rgba(255, 255, 255, 0.4)", }]}>{I18n.t('logout_label')}</Text>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

        );
    }
}
