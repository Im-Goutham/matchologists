import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    Text,
    FlatList,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import Loading from '../Loading/index';
import LinearGradient from 'react-native-linear-gradient';
import _ from 'lodash'

export default class NotificationsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notificationData: [],
            isloading: true
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
    checkemitRequest(){
        this.props.getNotifications()
    }
    componentDidMount() {
        // this.setState({
        // notificationData: this.props.notificationData,
        // isloading: this.props.isloading
        // })
    }
    componentWillReceiveProps(nextProps, nextState) {
        this.setState({
            notificationData: nextProps.notificationData,
            isloading: nextProps.isloading
        })

    }
    render() {
        const { notificationData, isloading } = this.state;
        if (isloading) {
            return <Loading />
        }
        if(!notificationData.length){
            return <Text style={{ alignSelf:"center", marginTop:50}}> No Notification found </Text>
        }
        return (
            <FlatList
                contentContainerStyle={styles.container}
                data={notificationData}
                renderItem={({ item }) => this.renderRow(item)}
                ItemSeparatorComponent={this.renderSeparator}
                keyExtractor={(item, index) => index.toString()}
            // ListHeaderComponent={<>}
            // getItemLayout={(data, index) => ({ length: 20, offset: 20 * index, index})}            
            />
        );
    }
    friendRequest(item) {
        currenttime = new Date();
        notification_time = new Date(item.createdAt)
        console.log("friendRequest_item", currenttime.getHours() - notification_time.getHours())
        // console.log("friendRequest_item", currenttime.getTime() - notification_time.getTime())
        return (
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 5 }}>
                <LinearGradient
                    colors={['#DB3D88', '#273174']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.answerBtn, { backgroundColor: 'white' }]}>
                    <TouchableOpacity disabled={item.isSeen ? true : false} style={{ paddingVertical: 5, paddingHorizontal: 10, borderRadius: 15 }} 
                    onPress={() => this.props.respondToVideoCallPermission(item, true)}>
                        <Text style={{ color: "#FFF" }}> Accept</Text>
                    </TouchableOpacity>
                </LinearGradient>
                <LinearGradient
                    colors={['#DB3D88', '#273174']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.answerBtn, { backgroundColor: 'white' }]}>
                    <TouchableOpacity disabled={item.isSeen ? true : false} style={[styles.answerBtn, {
                        backgroundColor: 'white', paddingVertical: 3.5, paddingHorizontal: 8.5, borderRadius: 15
                    }]} onPress={() => this.props.respondToVideoCallPermission(item, false)}>
                        <Text style={[styles.answerTxt, { color: '#313138', fontFamily: 'Avenir-Heavy' }]}> Denied</Text>
                    </TouchableOpacity>
                </LinearGradient>
                {
                    (currenttime.getHours() - notification_time.getHours()) <= 0 ?
                        <Text> {currenttime.getMinutes() - notification_time.getMinutes()} min ago</Text>
                        :
                        <Text> {currenttime.getHours() - notification_time.getHours()} hour ago</Text>

                }
            </View>
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
            <TouchableOpacity style={{ paddingVertical: 8 }} onPress={() => this.props.navigate('friendrequestfeedback', {checkemitRequest: this.checkemitRequest.bind(this), data: item, token: this.props.token, invitationname: item.fullname })}>
                <Text style={{ color: "#D43C87", fontSize: 12, fontFamily: "Avenir-Medium", lineHeight: 22 }}>FEEDBACK</Text>
            </TouchableOpacity>
        )
    }
    notification(item) {
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
                    {/* { _.replace(item.notificationText, new RegExp(item.fullname), item.fullname) ? _.replace(item.notificationText, new RegExp(item.fullname), item.fullname) : item.fullname + " " + item.notificationText} */}
                    {item.notificationText ? item.notificationText : ''}
                    </Text>
                    {
                        item.type === "videocallpermission" ? !item.isSeen ? this.friendRequest(item) : this.showtime(item)
                            :
                            item.type === "feedback" ? this.showtime(item) :
                            (item.type === 'friendrequest' || 'notification') ? !item.isSeen ? this.teamfeedback(item) :
                                this.showtime(item) : undefined
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
        // height: 52,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(233,233,234)',
        padding: 1
        // margin: 1
    },
});