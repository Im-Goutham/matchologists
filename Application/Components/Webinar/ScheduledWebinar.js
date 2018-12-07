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
    TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import i18n from 'react-native-i18n'
import Header from '../Common/Header'
import AllWebinarsList from './AllWebinarsList'
const IS_ANDROID = Platform.OS === 'android'
import metrics from '../../config/metrics';
const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.05;
const header_height = metrics.DEVICE_HEIGHT * 0.1;

let tabOptions = ['Upcoming', 'All']

export default class ScheduledWebinar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabindex: 1
        }
    }
    changeTab(key) {
        this.setState({
            tabindex: key
        })
    }
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={['#DB3D88', '#273174']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        // marginBottom : IS_ANDROID ? 30 :20
                    }}>
                    <SafeAreaView>
                        <Header
                            isSearcrchbar={true}
                            is_tabbar={true}
                            left={
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.openDrawer()}
                                    style={{
                                        width: "15%",
                                        backgroundColor: "transparent",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                    <Image
                                        source={require('../../images/menu.png')}
                                        style={{
                                            width: metrics.DEVICE_WIDTH * 0.0588,
                                            height: metrics.DEVICE_HEIGHT * 0.023
                                        }}
                                        resizeMethod="resize"
                                        resizeMode="contain" />
                                </TouchableOpacity>
                            }
                            middle={
                                <View style={{ width: "70%", backgroundColor: "transparent", alignItems: "center", justifyContent: "center" }}>
                                    <Text style={{ fontFamily: "Avenir-Heavy", fontSize: 24, color: "#fff" }}>Webinar</Text>
                                </View>
                            }
                            right={
                                <TouchableOpacity
                                    onPress={() => this.setState({ visibleModal: true })}
                                    style={{
                                        width: "15%",
                                        backgroundColor: "transparent",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }} />
                            }
                            tabbar={
                                <View style={{ flexDirection: "row", justifyContent: "space-between", height: 30 }}>
                                    {
                                        tabOptions.map((data, index) => {
                                            return (
                                                <TouchableOpacity
                                                    onPress={() => this.changeTab(index)}
                                                    style={{
                                                        borderBottomColor: this.state.tabindex === index ? "#FFF": "rgba(255,255,255, 0)",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        // backgroundColor:"#000",
                                                        flex: 1,
                                                        borderBottomWidth: this.state.tabindex === index ? 3 : 3
                                                    }}>
                                                    <Text style={{ fontFamily: "Avenir-Heavy", fontSize: 17, lineHeight: 22, color: this.state.tabindex === index ? "#fff" : "rgba(255,255,255, 0.5)" }}>{data}</Text>
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                </View>
                            }
                        />
                    </SafeAreaView>
                </LinearGradient>
                <View style={{ paddingTop: 10}}>
                {
                    this.state.tabindex === 1 ? <AllWebinarsList /> : undefined
                }
                </View>

            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
