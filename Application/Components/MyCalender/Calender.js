import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    Text,
    FlatList
} from 'react-native';
import { connect } from 'react-redux'

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

class CalendarsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            markedDates: {},
            userblocked: false,
            blockdmessage: '',
            eventlistData: [],
            filterddata: []
        };
        this.onDayPress = this.onDayPress.bind(this);
    }
    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 5,
                    width: "100%",
                    backgroundColor: "#CED0CE",
                    // marginLeft: "14%"
                }}
            />
        );
    };
    dateFormat() {
        var dateobj = new Date();
        var month = dateobj.getMonth() + 1;
        var day = dateobj.getDate();
        var year = dateobj.getFullYear();
        var newVal = (month > 9) ? month : "0" + month;
        return year + "-" + newVal + "-" + day;
    }

    componentDidMount() {
        var data = [];
        var token = this.props.token;
        console.log("getSpeedDatingEvents_token", token)
        Apirequest.getSpeedDatingEvents(token, resolve => {
            console.log("getSpeedDatingEvents", resolve)
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
                    markedDates['' + this.datemodifier(date) + ''] = { marked: true, dotColor: '#909096', disableTouchEvent: false, };
                    data.push(dataobject);
                }
                // console.log("getSpeedDatingEvents_data", markedDates)

                if (data && data.length) {
                    this.setState({
                        markedDates: markedDates,
                        eventlistData: data,
                        // filterddata: data,
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
    render() {
        console.log("getSpeedDatingEvents_data", this.state.markedDates)
        var newmarkedDate = {
            [this.state.selected]: { selected: true, disableTouchEvent: false, selectedDotColor: 'orange' },
        }
        return (
            <ScrollView
                bounces={false}
                style={styles.container}>
                <View style={{}}>
                    <Calendar
                        onDayPress={this.onDayPress}
                        // style={{ height: container_height }}
                        markedDates={Object.assign(newmarkedDate, this.state.markedDates)}
                        // disabledByDefault={true}
                        hideArrows={false}
                        horizontal={true}
                        pagingEnabled={true}
                        calendarWidth={320}
                        theme={{
                            backgroundColor: '#ffffff',
                            calendarBackground: '#FFF',
                            textSectionTitleColor: '#3E3E47',
                            selectedDayBackgroundColor: '#273174',
                            selectedDayTextColor: '#ffffff',
                            todayTextColor: '#DB3D88',
                            dayTextColor: '#3E3E47',
                            // textDisabledColor: '#fff',
                            textDisabledColor: '#d9e1e8',
                            dotColor: '#00adf5',
                            selectedDotColor: '#ffffff',
                            arrowColor: '#909096',
                            monthTextColor: '#3E3E47',
                            textDayFontFamily: 'Avenir-Heavy',
                            textMonthFontFamily: 'Avenir-Medium',
                            textDayHeaderFontFamily: 'Avenir-Light',
                            textMonthFontWeight: 'bold',
                            textDayFontSize: 16,
                            textMonthFontSize: 16,
                            textDayHeaderFontSize: 16
                        }}
                    />
                    {/* <Agenda
                        items={
                            {
                                '2012-05-22': [{ text: 'item 1 - any js object' }],
                                '2012-05-23': [{ text: 'item 2 - any js object' }],
                                '2012-05-24': [],
                                '2012-05-25': [{ text: 'item 3 - any js object' }, { text: 'any js object' }],
                            }}
                        loadItemsForMonth={(month) => { console.log('trigger items loading') }}
                        onCalendarToggled={(calendarOpened) => { console.log(calendarOpened) }}
                        onDayPress={(day) => { console.log('day pressed') }}
                        onDayChange={(day) => { console.log('day changed') }}
                        selected={'2012-05-16'}
                        minDate={'2012-05-10'}
                        maxDate={'2012-05-30'}
                        pastScrollRange={50}
                        futureScrollRange={50}
                        renderItem={(item, firstItemInDay) => { this.renderRow(item) }}
                        renderDay={(day, item) => { return (<View />); }}
                        renderEmptyDate={() => { return (<View />); }}
                        renderKnob={() => { return (<View />); }}
                        renderEmptyData={() => { return (<View />); }}
                        rowHasChanged={(r1, r2) => { return r1.text !== r2.text }}
                        hideKnob={false}
                        markedDates={{
                            '2012-05-16': { selected: true, marked: true },
                            '2012-05-17': { marked: true },
                            '2012-05-18': { disabled: true }
                        }}
                        onRefresh={() => console.log('refreshing...')}
                        refreshing={false}
                        refreshControl={null}
                        theme={{
                            // ...calendarTheme,
                            agendaDayTextColor: 'yellow',
                            agendaDayNumColor: 'green',
                            agendaTodayColor: 'red',
                            agendaKnobColor: 'blue'
                        }}
                        style={{}}
                    /> */}
                </View>
                <FlatList
                    contentContainerStyle={{ padding: 10 }}
                    data={this.state.filterddata}
                    renderItem={({ item }) => this.renderRow(item)}
                    ItemSeparatorComponent={this.renderSeparator}
                    keyExtractor={(item, index) => index.toString()}
                />
            </ScrollView>
        );
    }
    renderRow(item) {
        if (!this.state.eventlistData.length) {
            return <Text> no Events For You</Text>
        }
        return (
            <View style={{ backgroundColor: "#FFF", height: 101, borderLeftWidth: 5, borderLeftColor: "#D43C87", flexDirection: "row" }}>
                <View style={{ backgroundColor: "transparent", flex: 1, justifyContent: "space-around", paddingHorizontal: 15 }}>
                    <Text style={{ color: "#3E3E47", fontSize: 17, fontFamily: "Avenir-Heavy", lineHeight: 22 }}>{item.eventName}</Text>
                    <Text style={{ color: "#909096", fontSize: 15, fontFamily: "Avenir-Medium", lineHeight: 30 }}>{item.time}</Text>
                </View>
                {
                    item.isSpeedDating
                        ?
                        undefined
                        :
                        <View style={{ backgroundColor: "transparent", flex: 1, justifyContent: "flex-end", alignItems: "flex-end", paddingHorizontal: 15 }}>
                            <Text style={{ color: "#D43C87", fontSize: 13, fontFamily: "Avenir-Heavy", lineHeight: 22 }}>See Details</Text>
                        </View>

                }
            </View>
        )
    }
    datemodifier(str) {
        var newdateFormat = str.split("T");
        console.log("newdateFormat", newdateFormat)
        return newdateFormat[0]

    }
    onDayPress(day) {
        console.log("markedDates", new Date(day.dateString))
        console.log("eventlistData", new Date(day.dateString))
        //    var newFilterobj = {};
        if (day && day.dateString) {
            var filterddata = _.filter(this.state.eventlistData, (object, key) => { return this.datemodifier(object.date) === day.dateString })
            console.log("filterddata", filterddata)
            //    for ( var i=0; i < filterddata.length; i++){
            //     newFilterobj[''+ day.dateString +''] = Object.assign({}, filterddata);
            //    }
        }
        // console.log("onDayPress", newFilterobj)      
        this.setState({
            filterddata: filterddata,
            selected: day.dateString
        });
    }
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
    }
});
mapStateToProps = (state) => {
    return {
        language: state.language.defaultlanguage,
        data: state.auth.data,
        token: state.auth.token
    }
}
export default connect(mapStateToProps)(CalendarsScreen);