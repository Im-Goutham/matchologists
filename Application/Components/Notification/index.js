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
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient';
import i18n from 'react-native-i18n'
import Header from '../Common/Header';
import BaseFormComponent from '../Common/BaseFormComponent'
import NotificationsList from './NotificationsList';
// import Loading from '../Loading/index'
import Apirequest from '../Common/Apirequest'
const IS_ANDROID = Platform.OS === 'android';
import metrics from '../../config/metrics';
const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.05;
const header_height = metrics.DEVICE_HEIGHT * 0.1;

class Notification extends BaseFormComponent {
    constructor(props) {
        super(props);
        this.state = {
            visibleModal: false,
            scrollOffset: '',
            notificationData: [],
            isloading: true
        }
    }
    
    componentDidMount = async () => {
        this.getNotifications()
    }
    getChatSessionId(callback){
        this.setState({
            isloading: true
        })
        const { navigate } = this.props.navigation;
        let userid = callback.senderId;
        console.log("callback_senderId", userid)
        Apirequest.getChatSessionId(this.props.token, userid, (resolve) => {
            console.log("getChatSessionId_resolve", resolve.session)
            this.setState({
                isloading: false
            },()=> navigate('livecall', { 
                profileUserId: userid,
                sessionId : resolve.data && resolve.data.session ? resolve.data.session : '', 
                token : resolve.data && resolve.data.token ? resolve.data.token : ''
            }))
        }, (reject) => {
            console.log("getChatSessionId_reject", reject)
        })
    }
    rsvpForSpeedDating = (speedDatingEventObj) => {
        console.log("speedDatingEventObj", speedDatingEventObj)
        var token = this.props.token;
        var Data = {
            "speedDatingEventDayId": speedDatingEventObj.eventInfo.eventDayId,
            "linkThroughRSVP": speedDatingEventObj.eventInfo.inviteLink,
            "invitedByUserId": speedDatingEventObj.senderId
        }
        console.log("rsvpForSpeedDating_Data", Data)
        this.setState({ is_loading: true })
        Apirequest.rsvpForSpeedDating(token, Data, resolve => {
            console.log("rsvpForSpeedDating", resolve)
            if (resolve.message) {
                this.showSimpleMessage("", { backgroundColor: global.gradientsecondry }, '', resolve.message)
                speedDatingEventObj.isSeen = true;
                this.setState({
                    notificationData: this.state.notificationData,
                    is_loading: false,
                },()=>this.updateNotificationStatus(speedDatingEventObj._id))              
            }
        }, reject => {
            console.log("rsvpForSpeedDating_reject", reject)
            if (reject.message) {
                this.showSimpleMessage("", { backgroundColor: global.gradientsecondry }, '', reject.message)
                this.setState({
                    is_loading: false,
                })
            }
        })

    }
    getNotifications() {
        let data = [];
        var token = this.props.token;
        Apirequest.getNotifications(token, resolve => {
            if (resolve.data) {
                console.log("getNotificationsresolveers", resolve.data.data)
                var datasource = resolve.data.data;
                for (var i = 0; i < datasource.length; i++) {
                    let dataobject = {};
                    dataobject._id = datasource[i] && datasource[i]._id ? datasource[i]._id : '';
                    dataobject.eventInfo = datasource[i] && datasource[i].eventInfo ? datasource[i].eventInfo : {};
                    dataobject.updatedAt = datasource[i] && datasource[i].updatedAt ? datasource[i].updatedAt : '';
                    dataobject.createdAt = datasource[i] && datasource[i].createdAt ? datasource[i].createdAt : '';
                    dataobject.senderId = datasource[i] && datasource[i].senderId && datasource[i].senderId._id ? datasource[i].senderId._id : ''; dataobject.senderId = datasource[i] && datasource[i].senderId && datasource[i].senderId._id ? datasource[i].senderId._id : '';
                    dataobject.fullname = datasource[i] && datasource[i].senderId && datasource[i].senderId.fullName ? datasource[i].senderId.fullName : '';
                    dataobject.uri = datasource[i] && datasource[i].senderId && datasource[i].senderId.profilePic ? datasource[i].senderId.profilePic : null;
                    dataobject.receiverId = datasource[i] && datasource[i].receiverId ? datasource[i].receiverId : '';
                    dataobject.notificationText = datasource[i] && datasource[i].notificationText ? datasource[i].notificationText : '';
                    dataobject.type = datasource[i] && datasource[i].type ? datasource[i].type : '';
                    dataobject.isSeen = datasource[i] && datasource[i].isSeen ? datasource[i].isSeen : false;
                    data.push(dataobject)
                }
                console.log("getNotifications", data)
                this.setState({
                    notificationData: data,
                    isloading: false
                })
            }
        }, reject => {
            this.setState({
                notificationData: [],
                isloading: true
            })
            console.log("reject", reject)
        })
    }

    respondToVideoCallPermission(callback, accepttype) {
        console.log("respondToVideoCallPermission", callback)
        const { navigate } = this.props.navigation;
        var data = {
            "permissionRequesterId": callback.senderId,
            "isAccept": accepttype
        }
        Apirequest.respondToVideoCallPermission(this.props.token, data, resolve => {
            this.updateNotificationStatus(callback)
            this.getChatSessionId(callback)
            // navigate("livecall")

        }, reject => {
            console.log("respondToVideoCallPermission_resolve", reject)
        })
    }
    updateNotificationStatus = (callback) => {
        var token = this.props.token;
        var data = {
            "notificationIds": [callback._id]
        }
        Apirequest.updateNotificationStatus(token, data, resolve => {
            console.log("updateNotificationStatus", resolve)
        }, reject => {
            console.log(reject)
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
    onRefresh=()=>{
        this.setState({ 
            isRefreshing: true
        },()=> this.getNotifications());
    }
    render() {
        const { notificationData, isloading } = this.state;
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
                                    <Text style={{ fontFamily: "Avenir-Heavy", fontSize: 24, color: "#fff" }}> Notifications</Text>
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
                                </TouchableOpacity>
                            }
                        />
                    </SafeAreaView>
                </LinearGradient>
                <NotificationsList
                    notificationData={notificationData}
                    isloading={isloading}
                    getNotifications={this.getNotifications.bind(this)}
                    token={this.props.token}
                    navigate={navigate}
                    respondToVideoCallPermission={this.respondToVideoCallPermission.bind(this)}
                    rsvpForSpeedDating={this.rsvpForSpeedDating.bind(this)}
                    onRefresh={this.onRefresh.bind(this)}
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
export default connect(mapStateToProps)(Notification);