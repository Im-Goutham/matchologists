import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    Text,
    FlatList,
    View,
    Alert,
    Image,
    TouchableOpacity
} from 'react-native';
import Loading from '../Loading/index';
import Apirequest from '../Common/Apirequest';
import moment from 'moment'
import LinearGradient from 'react-native-linear-gradient';
import BaseFormComponent from '../Common/BaseFormComponent'
import Header from '../Common/Header'
import Swipeout from 'react-native-swipeout';
import Modal from 'react-native-modal';
import * as app from '../../../app.json'
import * as global from '../../../global.json'
import _ from 'lodash';
import backbutton from '../../images/icons/backbutton_gradient.png'
import backbuttonwhite from '../../images/icons/backbutton.png'
import metrics from '../../config/metrics';
import checked from '../../../assets/icons/checked.png';
import unchecked from '../../../assets/icons/unchecked.png';

export default class AllEventsList extends BaseFormComponent {
    constructor(props) {
        super(props);
        this.state = {
            eventlistData: [],
            isloading: true,
            sectionID: '',
            invitefriendView: false,
            speedDatingEventDayId: ''
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
    componentDidMount = () => {
        console.log("props", this.props)
        this.setState({
            eventlistData: this.props.eventlistData,
            isloading: this.props.isloading

        })
    }
    componentWillReceiveProps = (nextProps, nextState) => {
        console.log("nextProps", nextProps)
        this.setState({
            eventlistData: nextProps.eventlistData,
            isloading: nextProps.isloading
        })

    }
    closeinviteuserScreen = () => {
        this.setState({
            invitefriendView: false,
            speedDatingEventDayId: ''
        })
    }

    render() {
        const { eventlistData, isloading } = this.state;
        if (isloading) {
            return <Loading />
        }
        if (!eventlistData && !eventlistData.length) {
            return <Text style={{ alignSelf: "center", marginTop: 50 }}> No Events found </Text>
        }
        console.log("eventlistData", eventlistData)
        return (
            <>
                <FlatList
                    contentContainerStyle={styles.container}
                    data={eventlistData}
                    renderItem={({ item }) => this.renderRow(item)}
                    ItemSeparatorComponent={this.renderSeparator}
                    keyExtractor={(item, index) => index.toString()}
                />
                {
                    this.state.invitefriendView ?
                        <InviteUsers
                            closeinviteuserScreen={this.closeinviteuserScreen.bind(this)}
                            token={this.props.token}
                            speedDatingEventDayId={this.state.speedDatingEventDayId}
                        /> : undefined
                }
            </>
        );
    }
    closebutton = () => {
        alert("close me")
    }
    confirmJoinFroRsvp = (speedDatingEventObj) => {
        var dateObj = new Date(speedDatingEventObj.date);
        var month = dateObj.getUTCMonth() + 1;
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();

        console.log("speedDatingEventObj", speedDatingEventObj)
        Alert.alert(
            "Matchologists",
            `Are you sure you want to join ${speedDatingEventObj.eventName} event at dated ${day + "/" + month + "/" + year} ${speedDatingEventObj.time}`,
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => this.rsvpForSpeedDating(speedDatingEventObj) },
            ],
            { cancelable: false },
        );
    }
    rsvpForSpeedDating = (speedDatingEventObj) => {
        console.log("speedDatingEventObj", speedDatingEventObj)
        var token = this.props.token;
        var Data = {
            "speedDatingEventDayId": speedDatingEventObj.eventId,
            "linkThroughRSVP": speedDatingEventObj.inviteLink
        }
        this.setState({ is_loading: true })
        Apirequest.rsvpForSpeedDating(token, Data, resolve => {
            console.log("rsvpForSpeedDating", resolve)
            if (resolve.message) {
                this.showSimpleMessage("", { backgroundColor: global.gradientsecondry }, '', resolve.message)
                speedDatingEventObj.isRsvped = true;
                this.setState({
                    eventlistData: this.state.eventlistData,
                    is_loading: false,
                })
            }
        }, reject => {
            console.log("getMatchPercentage_reject", reject)
            if (reject.message) {
                this.showSimpleMessage("", { backgroundColor: global.gradientsecondry }, '', reject.message)
                this.setState({
                    is_loading: false,
                })
            }
        })
    }
    cancelspeedDating(speedDatingEventObj) {
        console.log("speedDatingEventObj", speedDatingEventObj)
        var token = this.props.token;
        var Data = {
            "speedDatingEventDayId": speedDatingEventObj.eventId,
        }
        Apirequest.cancleRSVPForSpeedDatingEvent(token, Data, resolve => {
            if (resolve.message) {
                this.showSimpleMessage("", { backgroundColor: global.gradientsecondry }, '', resolve.message)
            }
        }, reject => {
            console.log("getMatchPercentage_reject", reject)
        })
    }
    getTimeFormat(date) {
        var date1 = new Date(date);
        var date2 = new Date();
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        // alert(diffDays);
        if (diffDays >= 1) {
            console.log("date=========>", date1 );
            console.log("moment=========>", moment(date1).format('hh:mm A') );
            return diffDays + " " + "day ago";
        } else {
            return Math.ceil(timeDiff / (1000 * 3600)) + " " + "Hours Ago"
        }
    }
    speedDatingRequest =(item)=> {
        console.log("speedDatingRequest_item", item)
        return <>
                <Text style={{ alignSelf: "flex-end" }} > {this.getTimeFormat(item.date)}</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 5 }}>
                    <LinearGradient
                        colors={['#DB3D88', '#273174']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.answerBtn, { flex: 1, backgroundColor: 'white' }]}>
                        <TouchableOpacity
                            // disabled={item.isRsvped ? true : false} 
                            style={{ paddingVertical: 5, paddingHorizontal: 10, borderRadius: 15, justifyContent: "center", alignItems: "center" }}
                            onPress={() => this.confirmJoinFroRsvp(item)}>
                            <Text style={{ color: "#FFF" }}> RSVP </Text>
                        </TouchableOpacity>
                    </LinearGradient>
                    <LinearGradient
                        colors={['#DB3D88', '#273174']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.answerBtn, { flex: 1, padding: 1 }]}>
                        <TouchableOpacity
                            // disabled={item.isRsvped ? true : false}
                            style={[{ flex: 1, backgroundColor: 'white', borderRadius: 15, justifyContent: "center", alignItems: "center" }]}
                            onPress={() =>  this.confirmJoinFroRsvp(item)}>
                            <Text style={[styles.answerTxt, { color: '#313138', fontFamily: 'Avenir-Heavy' }]}> Not Now</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </>
        
    }

    renderRow(item) {
        var dateObj = new Date(item.date);
        var month = dateObj.getUTCMonth()+1;
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();

        var q = new Date();
        var m = q.getMonth() + 1;
        var d = q.getDay();
        var y = q.getFullYear();
        var date = new Date(y + "-" + m + "-" + d);

        var mydate = new Date(year + "-" + month + "-" + day);
        console.log('month=', month);
        console.log('day=', day);
        console.log('year=', year);
        console.log('mydate=', mydate);
        
        console.log('m=', m);
        console.log('d=', d);
        console.log('y=', y);
        console.log('date=', date);
        // console.log("row_id", item.row_id)
        var btnsTypes = [
            {
                text: "Invite Friends", onPress: () => this.setState({
                    speedDatingEventDayId: item.eventId,
                    invitefriendView: true
                }),
                color: "#fff",
                backgroundColor: global.gradientprimary

            },
            {
                text: "Cancel RSVP", onPress: () => this.cancelspeedDating(item),
                color: "#fff",
                backgroundColor: global.gradientsecondry
            }
        ];
        console.log('cond',  item && item.isRsvped );
                    console.log('cond',  date < mydate);
        return (
            <>
                {
                    
                    item && item.isRsvped && date < mydate ?
                        <Swipeout
                            autoClose={true}
                            close={!(this.state.sectionID === item.row_id)}
                            right={btnsTypes}
                            rowID={item.row_id}
                            sectionID={item.row_id}
                            buttonWidth={100}
                            backgroundColor={"#FFF"}
                            onOpen={
                                () => this.setState({ sectionID: item.row_id })
                            }
                            // onClose = {console.log('===close')}
                            // scroll={event => this.setState({ sectionID: item.row_id }) }
                            scroll={event => { console.log('scroll event', event) }}
                        >
                            <View style={{ backgroundColor: item.isOpen ? "#FFF" : "#F5F5F5", flexDirection: "row", paddingHorizontal: 15, paddingVertical: 16 }}>
                                <View style={{ flex: 2, justifyContent: "center", alignItems: "center", backgroundColor: "transparent" }}>
                                    <Image
                                        source={item.uri ? { uri: item.uri } : require('../../images/applogo.png')}
                                        style={{ width: 60, height: 60, borderRadius: 30 }}
                                        resizeMethod="resize"
                                        resizeMode="contain"
                                    />
                                </View>
                                <View style={{
                                    flex: 8, backgroundColor: "transparent", justifyContent: "center",
                                    justifyContent: "center", paddingHorizontal: 15
                                }}>
                                    <Text style={{ color: "#3E3E47", fontSize: 17, fontFamily: "Avenir-Heavy", lineHeight: 22, }}>{item.eventName ? item.eventName : 'Matchologist'}</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ color: "#3E3E47", fontSize: 17, fontFamily: "Avenir-Heavy", lineHeight: 22, }}>{day + "/" + month + "/" + year + " " + item.time} </Text>
                                        <Text style={{ color: "#D43C87", fontSize: 12, fontFamily: "Avenir-Medium", lineHeight: 22 }}>{date < mydate ? item.status : "past Event"}</Text>
                                    </View>
                                </View>
                            </View>
                        </Swipeout>
                        :
                        item && !item.isRsvped && item.status ==='upcoming' ?
                            <>
                                <View  style={{ backgroundColor: item.isOpen ? "#FFF" : "#F5F5F5", flexDirection: "row", paddingHorizontal: 15, paddingVertical: 16 }}>
                                    <View style={{ flex: 2, justifyContent: "center", alignItems: "center", backgroundColor: "transparent" }}>
                                        <Image source={item.uri ? { uri: item.uri } : require('../../images/applogo.png')} style={{ width: 60, height: 60, borderRadius: 30 }} />
                                    </View>
                                    <View style={{ flex: 8, backgroundColor: "transparent", justifyContent: "center", justifyContent: "center", paddingHorizontal: 15 }}>
                                        <Text style={{ color: "#3E3E47", fontSize: 17, fontFamily: "Avenir-Heavy", lineHeight: 22, }}>{item.eventName ? item.eventName : 'Matchologist'}</Text>
                                        <View style={{ justifyContent: 'space-between' }}>
                                            <Text style={{ color: "#3E3E47", fontSize: 17, fontFamily: "Avenir-Heavy", lineHeight: 22, }}>{day + "/" + month + "/" + year + " " + item.time} </Text>
                                            <Text style={{ color: "#D43C87", fontSize: 12, fontFamily: "Avenir-Medium", lineHeight: 22 }}>{
                                                // date < mydate ? 
                                                item.status 
                                                // : "past Event"
                                                }</Text>
                                        </View>
                                        {
                                            this.speedDatingRequest(item)
                                        }
                                    </View>
                                </View>

                            </>
                            :
                            item && item.isRsvped ?
                                <View style={{ backgroundColor: item.isOpen ? "#FFF" : "#F5F5F5", flexDirection: "row", paddingHorizontal: 15, paddingVertical: 16 }}>
                                    <View style={{ flex: 2, justifyContent: "center", alignItems: "center", backgroundColor: "transparent" }}>
                                        <Image source={item.uri ? { uri: item.uri } : require('../../images/applogo.png')} style={{ width: 60, height: 60, borderRadius: 30 }} />
                                    </View>
                                    <View style={{
                                        flex: 8, backgroundColor: "transparent", justifyContent: "center",
                                        justifyContent: "center", paddingHorizontal: 15
                                    }}>
                                        <Text style={{ color: "#3E3E47", fontSize: 17, fontFamily: "Avenir-Heavy", lineHeight: 22, }}>{item.eventName ? item.eventName : 'Matchologist'}</Text>
                                        <View style={{ justifyContent: 'space-between' }}>
                                            {/* <Text style={{ color: "#3E3E47", fontSize: 17, fontFamily: "Avenir-Heavy", lineHeight: 22, }}>{day + "/" + month + "/" + year + " " + item.time} </Text> */}
                                            <Text style={{ color: "#D43C87", fontSize: 12, fontFamily: "Avenir-Medium", lineHeight: 22 }}>{
                                                // date < mydate ? 
                                                item.status 
                                                // : "past Event"
                                                }</Text>
                                        </View>
                                        <Text style={{ alignSelf: "flex-end" }} > {this.getTimeFormat(item.date)}</Text>
                                    </View>
                                </View>
                                : 
                                <View style={{ backgroundColor: item.isOpen ? "#FFF" : "#F5F5F5", flexDirection: "row", paddingHorizontal: 15, paddingVertical: 16 }}>
                                <View style={{ flex: 2, justifyContent: "center", alignItems: "center", backgroundColor: "transparent" }}>
                                    <Image source={item.uri ? { uri: item.uri } : require('../../images/applogo.png')} style={{ width: 60, height: 60, borderRadius: 30 }} />
                                </View>
                                <View style={{
                                    flex: 8, backgroundColor: "transparent", justifyContent: "center",
                                    justifyContent: "center", paddingHorizontal: 15
                                }}>
                                    <Text style={{ color: "#3E3E47", fontSize: 17, fontFamily: "Avenir-Heavy", lineHeight: 22, }}>{item.eventName ? item.eventName : 'Matchologist'}</Text>
                                    <View style={{ justifyContent: 'space-between' }}>
                                        {/* <Text style={{ color: "#3E3E47", fontSize: 17, fontFamily: "Avenir-Heavy", lineHeight: 22, }}>{day + "/" + month + "/" + year + " " + item.time} </Text> */}
                                        <Text style={{ color: "#D43C87", fontSize: 12, fontFamily: "Avenir-Medium", lineHeight: 22 }}>{
                                            // date < mydate ? 
                                            item.status 
                                            // : "past Event"
                                            }</Text>
                                    </View>
                                    <Text style={{ alignSelf: "flex-end" }} > {this.getTimeFormat(item.date)}</Text>
                                </View>
                            </View>
                }
            </>
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
        borderRadius: 15,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: 'rgb(233,233,234)',
        padding: 1,
        marginLeft: 3
    },
});
class InviteUsers extends BaseFormComponent {
    constructor(props) {
        super(props);
        this.state = {
            invitefriendView: false,
            matchpercentData: [],
        }
    }
    getMatchPercentage = async () => {
        var token = this.props.token;
        Apirequest.getMatchPercentage(token, resolve => {
            let newData = [];
            console.log("newData", resolve.data.data)
            let responseData = resolve.data.data
            for (let i = 0; i < responseData.length; i++) {
                newObj = {};
                newObj.uri = "";
                let galeryLength = responseData[i].gallery;
                if (responseData[i].profilePic) {
                    newObj.uri = responseData[i].profilePic;
                } else {
                    let filteredGallery = _.filter(galeryLength, (image) => {
                        return _.includes(image.url, 'jpg') || _.includes(image.url, 'png') || _.includes(image.url, 'jpeg')
                    })
                    if (filteredGallery && filteredGallery.length) {
                        newObj.uri = filteredGallery[0].url;
                    }
                }
                newObj._id = responseData[i]._id;
                newObj.fullName = responseData[i].fullName;
                newObj.age = responseData[i].age;
                newObj.isSelected = false;
                newData.push(newObj)
            }
            console.log("matchpercentData", newData)
            this.setState({
                matchpercentData: newData,
                is_loading: false,
            })
            // console.log("getMatchPercentage_resolve", resolve)
        }, reject => {
            console.log("getMatchPercentage_reject", reject)

        })

    }
    componentDidMount() {
        this.getMatchPercentage()
        console.log("componentWillReceiveProps", this.props)

    }
    componentWillReceiveProps(nextProps, nextState) {
        console.log("componentWillReceiveProps", nextProps)
    }
    selectforInvite(itemobj) {
        itemobj.isSelected ? itemobj.isSelected = false : itemobj.isSelected = true;
        console.log("selectforInvite_itemobj", itemobj)
        this.setState({ matchpercentData: this.state.matchpercentData })
    }
    renderRow() {
        return this.state.matchpercentData.map((item, index) => {
            return (
                <TouchableOpacity key={index} onPress={() => this.selectforInvite(item)} style={{ backgroundColor: item.isOpen ? "#FFF" : "#F5F5F5", flexDirection: "row", paddingHorizontal: 15, paddingVertical: 16 }}>
                    <View style={{ flex: 2, justifyContent: "center", alignItems: "center", backgroundColor: "transparent" }}>
                        <Image source={item.uri ? { uri: item.uri } : require('../../images/applogo.png')} style={{ width: 60, height: 60, borderRadius: 30 }} />
                    </View>
                    <View style={{
                        flex: 6, backgroundColor: "transparent", justifyContent: "center",
                        justifyContent: "center", paddingHorizontal: 15
                    }}>
                        <Text style={{ color: "#3E3E47", fontSize: 17, fontFamily: "Avenir-Heavy", lineHeight: 22, }}>{item.fullName ? item.fullName : ""}</Text>
                    </View>
                    <View style={{ flex: 2, justifyContent: "center", alignItems: "center", backgroundColor: "transparent" }}>
                        <Image source={item.isSelected ? checked : unchecked}
                            style={{
                                width: 24, height: 24,
                            }}
                            resizeMethod='resize'
                            resizeMode="contain"
                        />
                    </View>
                </TouchableOpacity>
            )
        })
    }
    sendInviteationForSpeedDating() {
        console.log("this.state.matchpercentData", this.state.matchpercentData)
        var Selectedusers = _.map(_.filter(this.state.matchpercentData, obj => { return obj.isSelected === true }), _.property('_id'));

        var Data = {
            "speedDatingEventDayId": this.props.speedDatingEventDayId,
            "invitedUserIds": Selectedusers
        }
        Apirequest.inviteUserForSpeedDatingEvent(this.props.token, Data, resolve => {
            if (resolve.message) {
                this.showSimpleMessage("", { backgroundColor: global.gradientsecondry }, '', resolve.message)
                this.props.closeinviteuserScreen()
            }
            console.log("resolve", resolve)
        }, reject => {
            console.log("resolve", reject)

        })

    }
    render() {
        // console.log("matchpercentData", this.state.matchpercentData)
        return (
            <Modal
                backdropOpacity={0.5}
                isVisible={true}
                onBackdropPress={() => this.props.closeinviteuserScreen()}
                // onBackdropPress={() => this.setState({ invitefriendView: false })}
                // onBackButtonPress={() => this.setState({ invitefriendView: false })}
                style={{ padding: 0, margin: 0, backgroundColor: "#FFF" }}
            >
                <View style={{ flex: 1 }}>
                    <Header
                        isSearcrchbar={false}
                        left={
                            <TouchableOpacity
                                onPress={() => this.props.closeinviteuserScreen()}
                                style={{
                                    width: "15%",
                                    backgroundColor: "transparent",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}>
                                <Image
                                    source={backbuttonwhite}
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
                                <Text style={{ fontFamily: "Avenir-Heavy", fontSize: 24, color: "#fff" }}> Invite Friends</Text>
                            </View>
                        }
                        right={<TouchableOpacity
                            onPress={() => this.sendInviteationForSpeedDating()}
                            // onPress={() => this.setState({ visibleModal: true })}
                            style={{
                                width: "15%",
                                backgroundColor: "transparent",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                            <Text style={{ fontFamily: "Avenir-Heavy", fontSize: 14, color: "#fff" }}> Send</Text>
                        </TouchableOpacity>
                        }
                    />
                    <ScrollView>
                        {this.renderRow()}
                    </ScrollView>
                    {/* <FlatList
                        contentContainerStyle={styles.container}
                        data={this.state.matchpercentData}
                        renderItem={({ item }) => this.renderRow(item)}
                        ItemSeparatorComponent={this.renderSeparator}
                        keyExtractor={(item, index) => index.toString()}
                    /> */}
                </View>
            </Modal>
        )
    }
}