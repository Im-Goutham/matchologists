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
    TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import i18n from 'react-native-i18n'
import Header from '../Common/Header'
import CalendarsScreen from './Calender'
const IS_ANDROID = Platform.OS === 'android'
import metrics from '../../config/metrics';
const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.05
const header_height = metrics.DEVICE_HEIGHT * 0.1

export default class MyCalender extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visibleModal: false,
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

    render() {
        console.log("devices are", Platform)
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
                        isSearcrchbar={false}
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
                                    <Text style={{ fontFamily: "Avenir-Heavy", fontSize: 24, color: "#fff" }}>My Calender</Text>
                                </View>
                            }
                            right={
                                <TouchableOpacity 
                                onPress={()=>this.setState({visibleModal: true})}
                                style={{
                                    width: "15%",
                                    backgroundColor: "transparent",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}>
                                </TouchableOpacity>
                            }
                        />
                    </SafeAreaView>
                </LinearGradient>
                <CalendarsScreen/>
                <SafeAreaView/>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        // backgroundColor: "#009933" //'rgba(255,255,255, 100)',
    },
    bottomModal: {
        justifyContent: "flex-end",
        margin: 0
    },
});
