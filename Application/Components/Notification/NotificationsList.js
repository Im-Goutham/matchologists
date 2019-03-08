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
import Apirequest from '../Common/Apirequest'

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
        return (
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 5 }}>
                <LinearGradient
                    colors={['#DB3D88', '#273174']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.answerBtn, { backgroundColor: 'white' }]}>
                    <TouchableOpacity style={{ paddingVertical: 5, paddingHorizontal: 10, borderRadius: 15 }}>
                        <Text style={{ color: "#FFF" }}> Accept</Text>
                    </TouchableOpacity>
                </LinearGradient>
                <LinearGradient
                    colors={['#DB3D88', '#273174']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.answerBtn, { backgroundColor: 'white' }]}>
                    <TouchableOpacity style={[styles.answerBtn, {
                        backgroundColor: 'white', paddingVertical: 3.5, paddingHorizontal: 8.5, borderRadius: 15
                    }]}>
                        <Text style={[styles.answerTxt, { color: '#313138', fontFamily: 'Avenir-Heavy' }]}> Denied</Text>
                    </TouchableOpacity>
                </LinearGradient>
                <Text> 8 min ago</Text>
            </View>
        )
    }
    teamfeedback(item) {
        return (
            <TouchableOpacity style={{ paddingVertical: 8 }} onPress={() => this.props.navigate('friendrequestfeedback', { data: item, token : this.props.token, invitationname:"abhishek" })}>
                <Text style={{ color: "#D43C87", fontSize: 12, fontFamily: "Avenir-Medium", lineHeight: 22 }}>FEEDBACK</Text>
            </TouchableOpacity>
        )
    }
    notification(item) {
        return <></>
    }
    renderRow(item) {
        return (
            <View style={{ backgroundColor: item.isSeen ? "#FFF" : "#F5F5F5", height: 97, flexDirection: "row", paddingHorizontal: 15 }}>
                <View style={{ flex: 2, justifyContent: "center", alignItems: "center", backgroundColor: "transparent" }}>
                    <Image source={item.uri ? { uri: item.uri }: require('../../images/applogo.png')} style={{ width: 60, height: 60, borderRadius: 30 }} />
                </View>
                <View style={{
                    flex: 8, backgroundColor: "transparent", justifyContent: "center",
                    justifyContent: "center", paddingHorizontal: 15
                }}>
                    <Text style={{ color: "#3E3E47", fontSize: 17, fontFamily: "Avenir-Heavy", lineHeight: 22 }}>{item.notificationText}</Text>
                    {/* <Text style={{ fontSize: 15, fontFamily: "Avenir-Medium", lineHeight: 22 }}>{item.notificationText}</Text> */}
                    {
                        item.type === 'permission' ? this.friendRequest(item)
                            : (item.type === 'friendrequest' || 'notification') ? this.teamfeedback(item)
                                // : item.type === 'notification' ?this.notification(item)
                                // : item.type === 'teamfeedback' ?this.teamfeedback(item)
                                // : item.type === 'teamfeedback' ?this.teamfeedback(item)
                                : undefined
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