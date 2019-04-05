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
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient';
import i18n from 'react-native-i18n'
import Header from '../Common/Header'
import AllEventsList from './AllEventsList';
// import Loading from '../Loading/index'
import Apirequest from '../Common/Apirequest'
const IS_ANDROID = Platform.OS === 'android';
import metrics from '../../config/metrics';
import { reject } from 'rsvp';
const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.05;
const header_height = metrics.DEVICE_HEIGHT * 0.1;

class EventsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visibleModal: false,
            eventlistData: [],
            scrollOffset: '',
            isloading: true
        }
    }
    componentDidMount = async () => {
        this.getSpeedDatingEvents()
    }
    getSpeedDatingEvents() {
        let data = [];
        var token = this.props.token;
        Apirequest.getSpeedDatingEvents(token, resolve => {
            console.log("getSpeedDatingEvents_resolve", resolve)
            if (resolve.data) {
                var datasource = resolve.data.data;
                for (var i = 0; i < datasource.length; i++) {
                    let dataobject = {};
                    dataobject.date = datasource[i] && datasource[i].date ? datasource[i].date : '';
                    dataobject.eventId = datasource[i] && datasource[i].eventId ? datasource[i].eventId : '';
                    dataobject.eventName = datasource[i] && datasource[i].eventName ? datasource[i].eventName : '';
                    dataobject.inviteLink = datasource[i] && datasource[i].inviteLink ? datasource[i].inviteLink : '';
                    dataobject.isRsvped = datasource[i] && datasource[i].isRsvped ? datasource[i].isRsvped : false;
                    dataobject.status = datasource[i] && datasource[i].status ? datasource[i].status : '';
                    dataobject.time = datasource[i] && datasource[i].time ? datasource[i].time : '';
                    data.push(dataobject);
                }
                console.log("Apirequest_data", data)

                if (data && data.length) {
                    this.setState({
                        eventlistData: data,
                        isloading: false
                    })
                }else{
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

    // getSpeedDatingEvents() {
    //     let data = [];
    //     var token = this.props.token;
    //     Apirequest.getSpeedDatingEvents(token, resolve => {
    //         if (resolve.data) {
    //             var datasource = resolve.data.data;
    //             for (var i = 0; i < datasource.length; i++) {
    //                 let dataobject = {};
    //                let eventSchedule = datasource[i].dateAndTime ? datasource[i].dateAndTime : [];
    //                 for(var datetime = 0; datetime < eventSchedule.length; datetime++  ){
    //                     dataobject.row_id = i;
    //                     dataobject._id = datasource[i] && datasource[i]._id ? datasource[i]._id : '';
    //                     dataobject.updatedAt = datasource[i] && datasource[i].updatedAt ? datasource[i].updatedAt : '';
    //                     dataobject.themeName = datasource[i] && datasource[i].themeName ? datasource[i].themeName : '';
    //                     dataobject.status = datasource[i] && datasource[i].status ? datasource[i].status : '';
    //                     dataobject.isOpen = datasource[i] && datasource[i].isOpen ? datasource[i].isOpen : '';
    //                     dataobject.addedBy = datasource[i] && datasource[i].addedBy ? datasource[i].addedBy : '';
    //                     dataobject.eventdate = eventSchedule[datetime] && eventSchedule[datetime].date ? eventSchedule[datetime].date : '';
    //                     dataobject.eventtime = eventSchedule[datetime] && eventSchedule[datetime].time ? eventSchedule[datetime].time : '';
    //                     dataobject.announcementDateTime = datasource[i] && datasource[i].announcementDateTime ? datasource[i].announcementDateTime : '';
    //                     dataobject.announcementText = datasource[i] && datasource[i].announcementText ? datasource[i].announcementText : '';
    //                     dataobject.createdAt = datasource[i] && datasource[i].createdAt ? datasource[i].createdAt : '';
    //                     data.push(dataobject)    
    //                 }
    //             }
    //             this.setState({
    //                 eventlistData: data,
    //                 isloading: false
    //             })
    //         }
    //     }, reject => {
    //         this.setState({
    //             eventlistData: [],
    //             isloading: true
    //         })
    //         console.log("getSpeedDatingEvents_reject", reject)
    //     })
    // }
    rulesForRsvp=()=>{
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
                                    <Text style={{ fontFamily: "Avenir-Heavy", fontSize: 24, color: "#fff" }}> Events</Text>
                                </View>
                            }
                            right={
                                <TouchableOpacity
                                    onPress={() => alert("rsvp should be done before 48 hours of starting")}
                                    style={{
                                        width: "15%",
                                        backgroundColor: "transparent",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                    <Image source={require('../../images/icons/beware.png')}
                                        style={{
                                            width: metrics.DEVICE_WIDTH * 0.08,
                                            height: metrics.DEVICE_HEIGHT * 0.08
                                        }}
                                        resizeMethod="resize"
                                        resizeMode="contain" />
                                </TouchableOpacity>
                            }
                        />
                    </SafeAreaView>
                </LinearGradient>
                <AllEventsList
                    navigate={navigate}
                    isloading={this.state.isloading}
                    eventlistData={this.state.eventlistData}
                    token={this.props.token}
                    onRefresh = {this.getSpeedDatingEvents.bind(this)}
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
export default connect(mapStateToProps)(EventsList);