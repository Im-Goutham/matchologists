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
    Alert,
} from 'react-native';
import io from 'socket.io-client'; // 2.0.4
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient';
import i18n from 'react-native-i18n'
import Header from '../Common/Header'
import SpeedDatingUser from './SpeedDatingUser';
import Apirequest from '../Common/Apirequest'
const IS_ANDROID = Platform.OS === 'android';
import metrics from '../../config/metrics';
const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.05;
const header_height = metrics.DEVICE_HEIGHT * 0.1;
import { baseurl as URL } from '../../../app.json';

class SpeedDating extends Component {
    constructor(props) {
        super(props);
        this.socket = io(URL);
        this.socket.on("speedDatingEventStarted", data => {
            console.log("userConnect_speedDatingEventStarted", data)
            if (data && data.speedDatingEventDayId) {

                this.getUsersPairForSpeedDating(data.speedDatingEventDayId)
                
                // alert("hello speed dating start")
            }
        }
        );
        this.state = {
            visibleModal: false,
            speedDatingUser: [],
            scrollOffset: '',
            isloading: true
        }
    }
    componentDidMount = async () => {
        var  data = "5ca19973992b010533f3cd91";
        this.getUsersPairForSpeedDating(data)
    }
    getUsersPairForSpeedDating(speedDatingEventDayId) {
        let data = {
            "speedDatingEventDayId": speedDatingEventDayId
        }
        console.log("getUsersPairForSpeedDating", data)
        var token = this.props.token;
        var speedDatingUsers = []
        Apirequest.getUsersPairForSpeedDating(token, data, resolve => {
            if (resolve.data) {
                console.log("getUsersPairForSpeedDating_resolve", resolve)
                var datasource = resolve.data;
                for (var i = 0; i < datasource.length; i++) {
                    let dataobject = {};
                    dataobject.userId = datasource[i] && datasource[i].userId ? datasource[i].userId : '';
                    dataobject.fullName = datasource[i] && datasource[i].fullName ? datasource[i].fullName : '';
                    dataobject.age = datasource[i] && datasource[i].age ? datasource[i].age : '';
                    dataobject.profilePic = datasource[i] && datasource[i].profilePic ? datasource[i].profilePic : '';
                    speedDatingUsers.push(dataobject);
                }
                console.log("speedDatingUser", speedDatingUsers)
                if (speedDatingUsers && speedDatingUsers.length) {
                    this.setState({
                        speedDatingUser: speedDatingUsers,
                        isloading: false
                    })
                } else {
                    this.setState({
                        eventlistData: [],
                        isloading: false
                    })
                }
            }
        }, reject => {
            this.setState({
                eventlistData: [],
                isloading: false
            })
            console.log("getSpeedDatingEvents_reject", reject)
        })
    }
    rulesForRsvp = () => {
        Alert.alert({
        })
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
                                    <Text style={{ fontFamily: "Avenir-Heavy", fontSize: 24, color: "#fff" }}> Speed Dating</Text>
                                </View>
                            }
                            right={
                                <TouchableOpacity
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
                <SpeedDatingUser
                    navigate={navigate}
                    isloading={this.state.isloading}
                    token={this.props.token}
                    speedDatingUser={this.state.speedDatingUser}
                />
                <SafeAreaView />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    bottomModal: {
        justifyContent: "flex-end",
        margin: 0
    },
});
mapStateToProps = (state) => {
    return {
        language: state.language.defaultlanguage,
        data: state.auth.data,
        token: state.auth.token
    }
}
export default connect(mapStateToProps)(SpeedDating);