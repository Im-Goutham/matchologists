import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    Text,
    FlatList
} from 'react-native';
import { connect } from 'react-redux'
import moment from 'moment'
import metrics from '../../config/metrics'
import { Calendar, LocaleConfig, Agenda } from 'react-native-calendars';
import Apirequest from '../../Components/Common/Apirequest'
import { View } from 'react-native-animatable';
import _ from 'lodash'

LocaleConfig.locales['en'] = {
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October ', 'November', 'December'],
    monthNamesShort: ['Jan', 'Fab', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
    dayNamesShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
};
LocaleConfig.defaultLocale = 'en';

let container_height = metrics.DEVICE_HEIGHT * 0.56;

class CalenderAgenda extends Component {
    constructor(props) {
        super(props);
        this.state = {
            markedDates: {},
            eventlistData: [],
            items: {},
            filterddata: [],
            // currentdate: moment.utc().add(-1 , 'days').format(),
            currentdate: moment.utc().format()
        };
        // this.onDayPress = this.onDayPress.bind(this);
    }
    dateFormat() {
        var dateobj = new Date();
        var month = dateobj.getMonth() + 1;
        var day = dateobj.getDate();
        var year = dateobj.getFullYear();
        var newVal = (month > 9) ? month : "0" + month;
        return year + "-" + newVal + "-" + day;
    }
    componentDidMount() {
        // this.loadItems()
    }

    loadItems(day) {
        var data = [];
        var token = this.props.token;
        // console.log("getSpeedDatingEvents_day", day)
        Apirequest.getSpeedDatingEvents(token, resolve => {
            // console.log("getSpeedDatingEvents", resolve)
            if (resolve.data) {
                let markedDates = {};
                var datasource = resolve.data.data;
                for (var i = 0; i < datasource.length; i++) {
                    let dataobject = {};
                    var date = datasource[i] && datasource[i].date ? datasource[i].date : '';
                    dataobject.date = datasource[i] && datasource[i].date ? datasource[i].date : '';
                    dataobject.eventId = datasource[i] && datasource[i].eventId ? datasource[i].eventId : '';
                    dataobject.eventName = datasource[i] && datasource[i].eventName ? datasource[i].eventName : '';
                    dataobject.inviteLink = datasource[i] && datasource[i].inviteLink ? datasource[i].inviteLink : '';
                    dataobject.isRsvped = datasource[i] && datasource[i].isRsvped ? datasource[i].isRsvped : false;
                    dataobject.status = datasource[i] && datasource[i].status ? datasource[i].status : '';
                    dataobject.time = datasource[i] && datasource[i].time ? datasource[i].time : '';
                    dataobject.isSpeedDating = true;

                    markedDates['' + this.timeToString(this.state.currentdate) + ''] = (this.datemodifier(date)===this.datemodifier(this.state.currentdate)) ? [{
                        marked: true,
                        eventName: datasource[i] && datasource[i].eventName ? datasource[i].eventName : '',
                        eventTime: datasource[i] && datasource[i].time ? datasource[i].time : '',
                        dotColor: '#909096',
                        disableTouchEvent: false
                    }] :[{ eventName: "No Event Found For Today" }]
                    markedDates['' + this.datemodifier(date) + ''] = [{
                        marked: true,
                        eventName: datasource[i] && datasource[i].eventName ? datasource[i].eventName : '',
                        eventTime: datasource[i] && datasource[i].time ? datasource[i].time : '',
                        dotColor: '#909096',
                        disableTouchEvent: false
                    }];
                    data.push(dataobject);
                }
                console.log("markedDates_data", markedDates)
                if (data && data.length) {
                    this.setState({
                        markedDates: markedDates,
                        eventlistData: data,
                        isloading: false
                    }, () => this.filterCurrentDateEvent())
                }
            }
        }, reject => {
            // console.log("getSpeedDatingEvents_reject", reject)
            if (reject && reject.message) {
                this.setState({
                    blockdmessage: reject && reject.message ? reject.message : "",
                    isloading: false
                })
            }
        })
    }
    filterCurrentDateEvent() {
        //    var newFilterobj = {};
        var filterddata = _.filter(this.state.eventlistData, (object, key) => { return this.datemodifier(object.date) === this.dateFormat() })
        console.log("filterddata", filterddata)
        this.setState({
            filterddata: filterddata,
        });
    }

    // loadItems(day) {
    //     setTimeout(() => {
    //         for (let i = -15; i < 85; i++) {

    //             const time = day.timestamp + i * 24 * 60 * 60 * 1000;

    //             const strTime = this.timeToString(time);

    //             if (!this.state.markedDates[strTime]) {

    //                 this.state.markedDates[strTime] = [];

    //                 const numItems = Math.floor(Math.random() * 5);

    //                 for (let j = 0; j < numItems; j++) {

    //                     this.state.markedDates[strTime].push({
    //                         eventName: 'Item for ' + strTime,
    //                         height: 101
    //                     });
    //                 }
    //             }
    //         }
    //         console.log("setTimeout",this.state.markedDates);
    //         const newItems = {};
    //         Object.keys(this.state.markedDates).forEach(key => { newItems[key] = this.state.items[key]; });
    //         this.setState({
    //             markedDates: newItems
    //         });
    //     }, 1000);
    //     // console.log(`Load Items for ${day.year}-${day.month}`);
    // }
    getTimeFormat(date) {
        var date1 = new Date(date);
        var date2 = new Date();
        // var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        // var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        // alert(diffDays);
        // console.log("date1",date1 )
        // console.log("date2", date2 )
        // console.log("getTimeFormat", moment(date1).from(moment(date2)) )
        // if (diffDays >= 1) {
            return moment(date1).from(moment(date2));
        // } else {
        //     return Math.ceil(timeDiff / (1000 * 3600)) + " " + "Hours Ago"
        // }
    }

    renderItem(item) {
        return (
            <View style={{ backgroundColor: "#FFF", height: 101, borderLeftWidth: 5, borderLeftColor: "#D43C87", flexDirection: "row", marginTop:2 }}>
                <View style={{ backgroundColor: "transparent", flex: 1, justifyContent: "space-around", paddingHorizontal: 15 }}>
                    <Text style={{ color: "#3E3E47", fontSize: 17, fontFamily: "Avenir-Heavy", lineHeight: 22 }}>{item.eventName}</Text>
                    {item && item.eventTime ?
                    <Text style={{ color: "#909096", fontSize: 15, fontFamily: "Avenir-Medium", lineHeight: 30 }}>{ this.getTimeFormat(item.eventTime)}</Text>
                    : undefined }
                </View>
            </View>
        );
    }
    renderEmptyDate() {
        return (
            <View style={styles.emptyDate}>
                <Text>There is no event for date!</Text>
            </View>
        );
    }
    rowHasChanged(r1, r2) {
        return r1.name !== r2.name;
    }
    timeToString(time) {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    }
    render() {
        console.log("markedDates++++++++++++",this.state.currentdate)
        return (
            <View style={styles.container}>
                <Agenda
                    items={this.state.markedDates}
                    loadItemsForMonth={this.loadItems.bind(this)}
                    selected={this.timeToString(this.state.currentdate)}
                    renderItem={this.renderItem.bind(this)}
                    renderEmptyDate={this.renderEmptyDate.bind(this)}
                    rowHasChanged={this.rowHasChanged.bind(this)}
                    monthFormat={'MM yyyy'}
                    minDate={moment().add(-1, 'M').format('YYYY-MM-DD')}
                    theme={{
                        calendarBackground: '#ffff',
                        agendaKnobColor: '#3E3E47',
                        agendaDayNumColor: '#3E3E47',
                        agendaTodayColor: '#DB3D88',
                        backgroundColor: '#ffffff',
                        textSectionTitleColor: '#3E3E47',
                        selectedDayBackgroundColor: '#273174',
                        selectedDayTextColor: '#ffffff',
                        // todayTextColor: '#DB3D88',
                        dayTextColor: '#3E3E47',
                        // textDisabledColor: '#fff',
                        textDisabledColor: '#d9e1e8',
                        // dotColor: '#00adf5',
                        selectedDotColor: '#ffffff',
                        // arrowColor: '#909096',
                        monthTextColor: '#3E3E47',
                        textDayFontFamily: 'Avenir-Heavy',
                        textMonthFontFamily: 'Avenir-Medium',
                        textDayHeaderFontFamily: 'Avenir-Light',
                        textMonthFontWeight: 'bold',
                        // textDayFontSize: 16,
                        textMonthFontSize: 16,
                        // textDayHeaderFontSize: 16

                    }}
                    onCalendarToggled={(calendarOpened) => { console.log("calendarOpened", calendarOpened) }}
                    // renderKnob={() => {return <View  style={{backgroundColor:"#009933", height:3 }}/>}}
                    // hideKnob={true}
                // renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
                />
            </View>
        );
    }

    datemodifier(str) {
        var newdateFormat = str.split("T");
        // console.log("newdateFormat", newdateFormat)
        return newdateFormat[0]
    }
    // onDayPress(day) {
    //     if (day && day.dateString) {
    //         var filterddata = _.filter(this.state.eventlistData, (object, key) => { return this.datemodifier(object.date) === day.dateString })
    //         console.log("filterddata", filterddata)
    //     }
    //     this.setState({
    //         filterddata: filterddata,
    //         selected: day.dateString
    //     });
    // }
}
const styles = StyleSheet.create({
    calendar: {
        borderTopWidth: 1,
        paddingTop: 5,
        borderBottomWidth: 1,
        borderColor: '#eee',
        height: 350
    },
    container: {
        flex: 1,
    },
    item: {
        backgroundColor: "#009933",
        justifyContent: "center",
        alignItems: "center"

    }
});
mapStateToProps = (state) => {
    return {
        language: state.language.defaultlanguage,
        data: state.auth.data,
        token: state.auth.token
    }
}
export default connect(mapStateToProps)(CalenderAgenda);