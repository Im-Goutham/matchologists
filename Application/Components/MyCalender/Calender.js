import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    Text,
    FlatList
} from 'react-native';
import metrics from '../../config/metrics'
import { Calendar, LocaleConfig, } from 'react-native-calendars';
import { View } from 'react-native-animatable';

LocaleConfig.locales['en'] = {
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October ', 'November', 'December'],
    monthNamesShort: ['Jan', 'Fab', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
    dayNamesShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
};
LocaleConfig.defaultLocale = 'en';
let container_height = metrics.DEVICE_HEIGHT * 0.56;
let data = [
    {
        "id": 1,
        "event_name": "Webinar Name 1",
        "time": "6:00 PM to 7:00 PM",
    },
    {
        "id": 2,
        "event_name": "Webinar Name 2",
        "time": "6:00 PM to 7:00 PM",
    },
    {
        "id": 3,
        "event_name": "Webinar Name 3",
        "time": "6:00 PM to 7:00 PM",
    },
    {
        "id": 4,
        "event_name": "Webinar Name 4",
        "time": "6:00 PM to 7:00 PM",
    }
];
export default class CalendarsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {};
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
    render() {
        return (
            <ScrollView
                bounces={false}
                style={styles.container}>
                <View>
                    <Calendar
                        onDayPress={this.onDayPress}
                        style={{ height: container_height }}
                        markedDates={{
                            [this.state.selected]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' },
                            '2018-12-25': { marked: true, dotColor: '#909096' },
                            '2018-12-26': { marked: true, dotColor: '#909096' },
                        }}
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
                </View>
                <FlatList
                    contentContainerStyle={{ padding: 10 }}
                    data={data}
                    renderItem={({ item }) => this.renderRow(item)}
                    ItemSeparatorComponent={this.renderSeparator}
                />

            </ScrollView>
        );
    }
    renderRow(item) {
        return (
            <View style={{ backgroundColor: "#FFF", height: 101, borderLeftWidth: 5, borderLeftColor: "#D43C87", flexDirection: "row" }}>
                <View style={{ backgroundColor: "transparent", flex: 1, justifyContent:"space-around", paddingHorizontal:15 }}>
                    <Text style={{ color: "#3E3E47", fontSize: 17, fontFamily: "Avenir-Heavy", lineHeight: 22 }}>{item.event_name}</Text>
                    <Text style={{ color: "#909096", fontSize: 15, fontFamily: "Avenir-Medium", lineHeight: 30 }}>{item.time}</Text>
                </View>
                <View style={{ backgroundColor: "transparent", flex: 1, justifyContent: "flex-end", alignItems: "flex-end", paddingHorizontal:15 }}>
                    <Text style={{ color: "#D43C87", fontSize: 13, fontFamily: "Avenir-Heavy", lineHeight: 22 }}>See Details</Text>
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
    // calendar: {
    //     borderTopWidth: 1,
    //     paddingTop: 5,
    //     borderBottomWidth: 1,
    //     borderColor: '#eee',
    //     height: 350
    // },
    // text: {
    //     textAlign: 'center',
    //     borderColor: '#bbb',
    //     padding: 10,
    //     backgroundColor: '#eee'
    // },
    container: {
        flex: 1,
    }
});