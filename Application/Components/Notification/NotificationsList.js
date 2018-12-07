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
let data = [
    {
        "id": 1,
        "name": "Danny Rice",
        "message": "sent you a friend request",
        "action": "FEEDBACK",
        "picture": photo_1,
        "is_permission": false
    },
    {
        "id": 2,
        "name": "Elizabeth Turner",
        "message": "Want your permission to make call",
        "action": "FEEDBACK",
        "picture": Photo_7,
        "is_permission": true
    },
    {
        "id": 3,
        "name": "David Jones",
        "message": "sent you a friend request",
        "action": "FEEDBACK",
        "picture": Photo_8,
        "is_permission": false
    },
    {
        "id": 4,
        "name": "Mick James",
        "message": "sent you a friend request",
        "action": "FEEDBACK",
        "picture": Photo_9,
        "is_permission": false
    },
    {
        "id": 5,
        "name": "Harry Jonas ",
        "message": "sent you a friend request",
        "action": "FEEDBACK",
        "picture": Photo_10,
        "is_permission": false
    },
    {
        "id": 6,
        "name": "Michelle Cox",
        "message": "sent you a friend request",
        "action": "FEEDBACK",
        "picture": Photo_11,
        "is_permission": false
    },
    {
        "id": 7,
        "name": "Daniel Manner",
        "message": "sent you a friend request",
        "action": "FEEDBACK",
        "picture": Photo_12,
        "is_permission": false
    },
    {
        "id": 8,
        "name": "Paul Rosse ",
        "message": "sent you a friend request",
        "action": "FEEDBACK",
        "picture": Photo_11,
        "is_permission": false
    }
];
export default class NotificationsList extends Component {
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
            <View style={{ backgroundColor: "#FFF", height: 97, flexDirection: "row", paddingHorizontal: 15 }}>
                <View style={{ flex: 2, justifyContent: "center", alignItems: "center", backgroundColor:"transparent" }}>
                    <Image source={item.picture} style={{ width: 60, height: 60, borderRadius: 30 }} />
                </View>
                <View style={{
                    flex: 8, backgroundColor: "transparent", justifyContent: "center",
                    justifyContent: "center", paddingHorizontal: 15
                }}>
                    <Text style={{ color: "#3E3E47", fontSize: 17, fontFamily: "Avenir-Heavy", lineHeight: 22 }}>{item.name}  <Text style={{ fontSize: 15, fontFamily: "Avenir-Medium", lineHeight: 22 }}>{item.message}</Text></Text>
                    {
                        item.is_permission ? <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 5 }}>
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
                            :
                            <Text style={{ color: "#D43C87", fontSize: 12, fontFamily: "Avenir-Medium", lineHeight: 22 }}>{item.action}</Text>
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