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
import LinearGradient from 'react-native-linear-gradient';
import photo_1 from '../../images/search_result.png'
import Photo_7 from '../../images/Photo_7.png'
import Photo_8 from '../../images/Photo_8.png'
import Photo_9 from '../../images/Photo_9.png'
import Photo_10 from '../../images/Photo_10.png'
import Photo_11 from '../../images/Photo_11.png'
import Photo_12 from '../../images/Photo_12.png'
import noun_live from '../../images/icons/noun_live.png'
let data = [
    {
        "id": 1,
        "title": "Webinar Name 1",
        "date": "Date: Oct 12, 2018",
        "time": "Duration: 2:30 Hours",
        "picture": photo_1,
        "is_live": true,
        "status": true
    },
    {
        "id": 2,
        "title": "Webinar Name 2",
        "date": "Date: Oct 12, 2018",
        "time": "Duration: 2:30 Hours",
        "picture": Photo_7,
        "is_live": false,
        "status": false
    },
    {
        "id": 3,
        "title": "Webinar Name 3",
        "date": "Date: Oct 12, 2018",
        "time": "Duration: 2:30 Hours",
        "picture": Photo_8,
        "is_live": false,
        "status": true
    },
    {
        "id": 4,
        "title": "Webinar Name 4",
        "date": "Date: Oct 12, 2018",
        "time": "Duration: 2:30 Hours",
        "picture": Photo_9,
        "is_live": false,
        "status": true
    },
    {
        "id": 5,
        "title": "Webinar Name 5",
        "date": "Date: Oct 12, 2018",
        "time": "Duration: 2:30 Hours",
        "picture": Photo_10,
        "is_live": false,
        "status": true
    },
    {
        "id": 6,
        "title": "Webinar Name 6",
        "date": "Date: Oct 12, 2018",
        "time": "Duration: 2:30 Hours",
        "picture": Photo_11,
        "is_live": false,
        "status": true
    },
    {
        "id": 7,
        "title": "Webinar Name 7",
        "date": "Date: Oct 12, 2018",
        "time": "Duration: 2:30 Hours",
        "picture": Photo_12,
        "is_live": false,
        "status": true
    },
    {
        "id": 8,
        "title": "Webinar Name 8",
        "date": "Date: Oct 12, 2018",
        "time": "Duration: 2:30 Hours",
        "picture": Photo_11,
        "is_live": false,
        "status": true
    }
];
export default class AllWebinarsList extends Component {
    constructor(props) {
        super(props);
        this.state = {};
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
    render() {
        return (
            <FlatList
                contentContainerStyle={styles.container}
                data={data}
                renderItem={({ item }) => this.renderRow(item)}
                ItemSeparatorComponent={this.renderSeparator}
            // ListHeaderComponent={<>}
            // getItemLayout={(data, index) => ({ length: 20, offset: 20 * index, index})}            
            />
        );
    }
    renderRow(item) {
        return (
            <View style={{ backgroundColor: "#FFF", height: 97, flexDirection: "row", paddingHorizontal: 10 }}>
                <View style={{ flex: 2.1, justifyContent: "center", alignItems: "center", backgroundColor: "transparent" }}>
                    <Image source={item.picture} style={{ width: 60, height: 60, borderRadius: 30 }} />
                </View>
                <View style={{
                    flex: 8, backgroundColor: "transparent", justifyContent: "center",
                    justifyContent: "center",
                    // paddingHorizontal: 15
                }}>
                    <Text style={{ color: "#3E3E47", fontSize: 17, fontFamily: "Avenir-Heavy", lineHeight: 22 }}>{item.title}
                        {
                           item.is_live 
                           ?<Image source={noun_live} style={{ width: 22, height: 19 , alignSelf:"flex-end"}} /> 
                           : item.status ? undefined  
                           : <Text style={{ color: "#FE8E9B", fontSize: 15, fontFamily: "Avenir-Medium", lineHeight: 22 }}>CANCELLED</Text>
                        }
                    </Text>
                    <Text style={{ color: "#909096", fontSize: 15, fontFamily: "Avenir-Medium", lineHeight: 22 }}>{item.date + " | " + item.time}</Text>
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
        backgroundColor: "#FFF"
    },
    answerBtn: {
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(233,233,234)',
        padding: 1
    },
});