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
import SearchBar from './SearchBar'

// import MonogamousList from './monogamous'
import { Userlist, OnlineUsers } from './userlist';
const IS_ANDROID = Platform.OS === 'android'
import metrics from '../../config/metrics';
const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.05
const header_height = metrics.DEVICE_HEIGHT * 0.1

export default class UserChatlist extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
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
                                    <Text style={{ fontFamily: "Avenir-Heavy", fontSize: 24, color: "#fff" }}>{i18n.t('message_label')}</Text>
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
                        />
                    </SafeAreaView>
                </LinearGradient>
                <SearchBar />
                <ScrollView contentContainerStyle={{ paddingVertical: 20, }} showsVerticalScrollIndicator={false}>
                    <View style={{ height: 175, justifyContent:"center", paddingLeft:15, borderBottomWidth:10, borderBottomColor:"#F5F5F5" }}>
                        <Text style={{ fontFamily: "Avenir-Medium", fontSize: 15, color: "#C1C0C9", lineHeight: 40,  }}>ALL MATCHES</Text>
                        <View style={{  }}>
                            <OnlineUsers navigation={this.props.navigation} />
                        </View>

                    </View>
                    <View style={{ backgroundColor: "red", }}>
                        <Userlist navigation={this.props.navigation} />
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
        backgroundColor: 'rgba(255,255,255, 100)',
    },
    bottomModal: {
        justifyContent: "flex-end",
        margin: 0
    },
});
