import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    Text,
    FlatList,
    View,
    Alert,
    Image,
    RefreshControl,
    TouchableOpacity
} from 'react-native';
import Apirequest from '../Common/Apirequest';
import Loading from '../Loading/index';
import LinearGradient from 'react-native-linear-gradient';
import _ from 'lodash'

export default class NotificationsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notificationData: [],
            isloading: true,
            isRefreshing: false, //for pull to refresh
        };
    }
    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "75%",
                    backgroundColor: "#CED0CE",
                    marginLeft: "25%"
                }}
            />
        );
    };
    checkemitRequest() {
        this.props.getNotifications()
    }
    componentDidMount() { }
    componentWillReceiveProps(nextProps, nextState) {
        this.setState({
            notificationData: nextProps.notificationData,
            isloading: nextProps.isloading,
            isRefreshing: false,
        })

    }
    updateNotificationStatus = (item) => {
        var token = this.props.token;
        var Data = {
            "notificationIds": [item._id]
        }
        Apirequest.updateNotificationStatus(token, Data, resolve => {
            console.log("updateNotificationStatus_resolve", resolve)
            this.props.navigate("livecall", { profileUserId: item.senderId })
        }, reject => {
            console.log("updateNotificationStatus_reject", reject)
        })
    }
    
    render() {
        const { notificationData, isloading } = this.state;
        if (isloading) {
            return <Loading />
        }
        if (!notificationData.length) {
            return <Text style={{ alignSelf: "center", marginTop: 50 }}> No Notification found </Text>
        }
        return (
            <FlatList
                contentContainerStyle={styles.container}
                data={notificationData}
                renderItem={({ item }) => this.renderRow(item)}
                ItemSeparatorComponent={this.renderSeparator}
                keyExtractor={(item, index) => index.toString()}
                refreshControl={
                    <RefreshControl
                    refreshing={this.state.isRefreshing}
                    onRefresh={this.props.onRefresh}
                    />
                }
            // ListHeaderComponent={<>}
            // getItemLayout={(data, index) => ({ length: 20, offset: 20 * index, index})}            
            />
        );
    }
    getTimeFormat(date) {
        var date1 = new Date(date);
        var date2 = new Date();
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        // alert(diffDays);
        if (diffDays >= 1) {
            return diffDays + " " + "day ago";
        } else {
            return Math.ceil(timeDiff / (1000 * 3600)) + " " + "Hours Ago"
        }
    }
    speedDatingRequest(item) {
        console.log("speedDatingRequest_item", item)
        return (
            <>
                <Text style={{ alignSelf: "flex-end" }} > {this.getTimeFormat(item.createdAt)}</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 5 }}>
                    <LinearGradient
                        colors={['#DB3D88', '#273174']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.answerBtn, { flex: 1, backgroundColor: 'white' }]}>
                        <TouchableOpacity
                            disabled={item.isSeen ? true : false}
                            style={{ paddingVertical: 5, paddingHorizontal: 10, borderRadius: 15, justifyContent: "center", alignItems: "center" }}
                            onPress={() => this.props.rsvpForSpeedDating(item)}>
                            <Text style={{ color: "#FFF" }}>{item && item.type === "speeddatingnotification" ? "RSVP" : "Accept"}   </Text>
                        </TouchableOpacity>
                    </LinearGradient>
                    <LinearGradient
                        colors={['#DB3D88', '#273174']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.answerBtn, { flex: 1, padding: 1 }]}>
                        <TouchableOpacity
                            disabled={item.isSeen ? true : false}
                            style={[{ flex: 1, backgroundColor: 'white', borderRadius: 15, justifyContent: "center", alignItems: "center" }]}
                            onPress={
                                item && item.type === "speeddatingnotification" ? console.log("")
                                    :
                                    () => this.props.navigate('friendrequestfeedback', {
                                        checkemitRequest: this.checkemitRequest.bind(this),
                                        data: item,
                                        token: this.props.token,
                                        invitationname: item.fullname,
                                        eventNamepoint: 'speeddatingInvitationRejectionFeedback'
                                    })
                            }>
                            <Text style={[styles.answerTxt, { color: '#313138', fontFamily: 'Avenir-Heavy' }]}> {item && item.type === "speeddatingnotification" ? "Not Now" : "Decline"}</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </>
        )
    }
    givePermissionforVideocall(item) {
        console.log("givePermissionforVideocall", item)
        Alert.alert(
            'Matchologists',
            item.notificationText,
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => this.props.respondToVideoCallPermission(item, true) },
            ],
            { cancelable: false },
        );
    }
    videocallpermission(item) {
        currenttime = new Date();
        notification_time = new Date(item.createdAt)
        return (
            <>
                {
                    (currenttime.getHours() - notification_time.getHours()) <= 0 ?
                        <Text style={{ alignSelf: "flex-end" }}> {currenttime.getMinutes() - notification_time.getMinutes()} min ago</Text>
                        :
                        <Text style={{ alignSelf: "flex-end" }}> {currenttime.getHours() - notification_time.getHours()} hour ago</Text>

                }
                <View style={{ flexDirection: "row", justifyContent: "space-between", height: 44 }}>
                    <LinearGradient
                        colors={['#DB3D88', '#273174']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.answerBtn, { flex: 1, backgroundColor: 'white', justifyContent: "center", alignItems: "center", }]}>
                        <TouchableOpacity
                            disabled={item.isSeen ? true : false}
                            style={{ paddingVertical: 5, justifyContent: "center", alignItems: "center", paddingHorizontal: 10, borderRadius: 22 }}
                            onPress={() => this.givePermissionforVideocall(item)}>
                            <Text style={{ color: "#FFF" }}> Accept</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                    <LinearGradient
                        colors={['#DB3D88', '#273174']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.answerBtn, { flex: 1, backgroundColor: 'white' }]}>
                        <TouchableOpacity disabled={item.isSeen ? true : false}
                            style={[{ flex: 1, backgroundColor: 'white', paddingVertical: 3.5, paddingHorizontal: 10, borderRadius: 22, justifyContent: "center", alignItems: "center", }]}
                            onPress={() => this.props.navigate('rejectionfeedback', { data: item })}>
                            <Text style={[styles.answerTxt, { color: '#313138', fontFamily: 'Avenir-Heavy' }]}> Denied</Text>
                        </TouchableOpacity>
                    </LinearGradient>

                </View>
            </>
        )
    }
    acceptFriendRequest(item) {
        currenttime = new Date();
        notification_time = new Date(item.createdAt)
        return (
            <>
                {
                    (currenttime.getHours() - notification_time.getHours()) <= 0 ?
                        <Text style={{ alignSelf: "flex-end" }}> {currenttime.getMinutes() - notification_time.getMinutes()} min ago</Text>
                        :
                        <Text style={{ alignSelf: "flex-end" }}> {currenttime.getHours() - notification_time.getHours()} hour ago</Text>

                }
                <View style={{ flexDirection: "row", justifyContent: "space-between", height: 44 }}>
                    <LinearGradient
                        colors={['#DB3D88', '#273174']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.answerBtn, { flex: 1, backgroundColor: 'white', justifyContent: "center", alignItems: "center", }]}>
                        <TouchableOpacity
                            disabled={item.isSeen ? true : false}
                            style={{ paddingVertical: 5, justifyContent: "center", alignItems: "center", paddingHorizontal: 10, borderRadius: 22 }}
                            // onPress={() => this.givePermissionforVideocall(item)}
                            onPress={() => this.props.navigate('friendrequestfeedback', {
                                checkemitRequest: this.checkemitRequest.bind(this),
                                data: item,
                                token: this.props.token,
                                invitationname: item.fullname,
                                eventNamepoint: 'invitefeedback'
                            })}
                        >
                            <Text style={{ color: "#FFF" }}> Accept</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                    <LinearGradient
                        colors={['#DB3D88', '#273174']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.answerBtn, { flex: 1, backgroundColor: 'white' }]}>
                        <TouchableOpacity disabled={item.isSeen ? true : false}
                            style={[{ flex: 1, backgroundColor: 'white', paddingVertical: 3.5, paddingHorizontal: 10, borderRadius: 22, justifyContent: "center", alignItems: "center", }]}
                            onPress={() => this.props.navigate('rejectionfeedback', { data: item })}>
                            <Text style={[styles.answerTxt, { color: '#313138', fontFamily: 'Avenir-Heavy' }]}> Denied</Text>
                        </TouchableOpacity>
                    </LinearGradient>

                </View>
            </>
        )
    }
    videocallEvents(item) {
        return (
            <>
                <Text style={{ alignSelf: "flex-end" }} > {this.getTimeFormat(item.createdAt)}</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 5 }}>
                    <LinearGradient
                        colors={['#DB3D88', '#273174']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.answerBtn, { flex: 1, backgroundColor: 'white' }]}>
                        <TouchableOpacity
                            disabled={item.isSeen ? true : false}
                            style={{ paddingVertical: 5, paddingHorizontal: 10, borderRadius: 15, justifyContent: "center", alignItems: "center" }}
                            // onPress={()=>this.props.navigate("livecall",{ profileUserId: item.senderId })}
                            onPress={() => this.updateNotificationStatus(item)}
                        >
                            <Text style={{ color: "#FFF" }}> Accept  </Text>
                        </TouchableOpacity>
                    </LinearGradient>
                    <LinearGradient
                        colors={['#DB3D88', '#273174']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.answerBtn, { flex: 1, padding: 1 }]}>
                        <TouchableOpacity
                            disabled={item.isSeen ? true : false}
                            style={[{ flex: 1, backgroundColor: 'white', borderRadius: 15, justifyContent: "center", alignItems: "center" }]}
                            onPress={() => console.log("video call rejected")}>
                            <Text style={[styles.answerTxt, { color: '#313138', fontFamily: 'Avenir-Heavy' }]}> Denied</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </>
        )
    }
    showtime(item) {
        currenttime = new Date();
        notification_time = new Date(item.createdAt)
        var timeDiff = Math.abs(currenttime.getTime() - notification_time.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return (
            <>
                {
                    diffDays > 1 ?
                        <Text style={{ alignSelf: "flex-end" }}> {diffDays} days ago</Text>
                        :
                        (currenttime.getHours() - notification_time.getHours()) <= 0 ?
                            <Text style={{ alignSelf: "flex-end" }}> {currenttime.getMinutes() - notification_time.getMinutes()} min ago</Text>
                            :
                            <Text style={{ alignSelf: "flex-end" }}> {currenttime.getHours() - notification_time.getHours()} hour ago</Text>
                }
            </>
        )
    }
    teamfeedback(item) {
        return (
            <TouchableOpacity style={{ paddingVertical: 8 }}
                onPress={() => this.props.navigate('friendrequestfeedback', {
                    checkemitRequest: this.checkemitRequest.bind(this),
                    data: item,
                    token: this.props.token,
                    invitationname: item.fullname,
                    eventNamepoint: 'invitefeedback'
                })}>
                <Text style={{ color: "#D43C87", fontSize: 12, fontFamily: "Avenir-Medium", lineHeight: 22 }}>FEEDBACK</Text>
            </TouchableOpacity>
        )
    }
    notification(item) {
        return <></>
    }
    speeddatingcall() {
        return <></>
    }
    renderRow(item) {
        return (
            <View style={{ backgroundColor: item.isSeen ? "#FFF" : "#F5F5F5", flexDirection: "row", paddingHorizontal: 15, paddingVertical: 16 }}>
                <View style={{ flex: 2, justifyContent: "center", alignItems: "center", backgroundColor: "transparent" }}>
                    <Image source={item.uri ? { uri: item.uri } : require('../../images/applogo.png')} style={{ width: 60, height: 60, borderRadius: 30 }} />
                </View>
                <View style={{
                    flex: 8, backgroundColor: "transparent", justifyContent: "center",
                    justifyContent: "center", paddingHorizontal: 15
                }}>
                    <Text style={{ color: "#3E3E47", fontSize: 17, fontFamily: "Avenir-Heavy", lineHeight: 22, }}>
                        {item.notificationText ? item.notificationText : ''}
                    </Text>
                    {
                        item && item.type === "videocallpermission" ? item && item.isSeen ? this.showtime(item) : this.videocallpermission(item)
                            :
                            item && item.type === 'friendrequest' ? item && item.isSeen ? this.showtime(item) : this.teamfeedback(item)
                                :
                                item && item.type === "videocall" ? item && item.isSeen ? this.showtime(item) : this.videocallEvents(item)
                                    :
                                    item && (item.type === "speeddatingnotification" || item.type === "speeddatingInvitation") ? item && item.isSeen ? this.showtime(item) : this.speedDatingRequest(item)
                                        :
                                        item && (item.type === "userfeedback" || item.type === "teamfeedback" || item.type === "speeddatingreminder" || item.type === "notification") ? this.showtime(item)
                                            :
                                            item && item.type === 'speeddatingcall' ? item && item.isSeen ? this.showtime(item) : this.speeddatingcall(item)
                                                :
                                                undefined


                    }
                </View>
            </View>
        )
    }
    onDayPress(day) {
        this.setState({
            selected: day.dateString
        });
    }
}
const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: "#FFF"
    },
    answerBtn: {
        overflow: "hidden",
        // height: 52,
        borderRadius: 22,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: 'rgb(233,233,234)',
        padding: 1,
        marginHorizontal: 3
    },
});