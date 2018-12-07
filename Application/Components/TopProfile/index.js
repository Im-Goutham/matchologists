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
import MonogamousList from './monogamous'
import SuggestionList from './list';
const IS_ANDROID = Platform.OS === 'android'
import metrics from '../../config/metrics';
const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.05
const header_height = metrics.DEVICE_HEIGHT * 0.1

export default class TopProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // visibleModal: false,
            // scrollOffset: ''
        }
    }
    // handleScrollTo = p => {
    //     if (this.scrollViewRef) {
    //         this.scrollViewRef.scrollTo(p);
    //     }
    // };
    // handleOnScroll = event => {
    //     console.log("event.nativeEvent.contentOffset.y");

    //     this.setState({
    //         scrollOffset: event.nativeEvent.contentOffset.y
    //     });
    // };

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
                                    <Text style={{ fontFamily: "Avenir-Heavy", fontSize: 24, color: "#fff" }}>Top 10</Text>
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
                                    }}>
                                    <Text style={{ fontFamily: "Avenir-Heavy", fontSize: 13, color: "rgba(255,255,255,100)" }}>Done</Text>
                                </TouchableOpacity>
                            }
                        />
                    </SafeAreaView>
                </LinearGradient>
                <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ marginTop: 15, padding: 16, backgroundColor: "rgba(255, 255,255,100)" }}>
                    <Text style={{ fontFamily: "Avenir-Medium", fontSize: 15, color: "#C1C0C9" }}>{i18n.t('monogamouslabel')}</Text>
                    <MonogamousList />
                </View>
                <View style={{height:54}}>
                <Text style={{ paddingHorizontal: 16, paddingVertical: 8, fontFamily: "Avenir-Medium", fontSize: 13, color: "rgba(144,144,150,100)" }}>{i18n.t('add_people_limit')}</Text>
                </View>
                <View style={{ backgroundColor: "transparent", }}>
                    <SuggestionList />
                </View>
                </ScrollView>
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
