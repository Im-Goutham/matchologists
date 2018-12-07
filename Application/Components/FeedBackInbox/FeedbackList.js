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
import avatar from '../../images/avatar.png'
let data = [
    {
        "id": 1,
        "tag": "Great job",
        "name": "Danny Rice",
        "message": "enjoyed your interaction, keep it up",
        "picture": photo_1,
    },
    {
        "id": 2,
        "tag": "Great job",
        "name": "Elizabeth Turner",
        "message": "enjoyed your interaction, keep it up",
        "picture": Photo_7,
    },
    {
        "id": 3,
        "tag": "",
        "name": "",
        "message": "It happens to the best of us, not to worry because we can help",
        "picture": '',
    },
    {
        "id": 4,
        "tag": "Great job",
        "name": "Gilbert Smith",
        "message": "enjoyed your interaction, keep it up",
        "picture": Photo_9,
    },
    {
        "id": 5,
        "tag": "Great job",
        "name": "Clara Griffin",
        "message": "enjoyed your interaction, keep it up",
        "picture": Photo_10,
    },
    {
        "id": 6,
        "tag": "",
        "name": "",
        "message": "It happens to the best of us, not to worry because we can help",
        "picture": '',
    },
    {
        "id": 7,
        "tag": "Great job",
        "name": "Daniel Manner",
        "message": "enjoyed your interaction, keep it up",
        "picture": Photo_12,
    },
    {
        "id": 8,
        "tag": "Great job",
        "name": "Paul Rosse ",
        "message": "enjoyed your interaction, keep it up",
        "picture": Photo_11,
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
            <TouchableOpacity onPress={() => this.props.navigation.navigate('feedbackdetail', { "params" :item})}
            style={{ backgroundColor: "#FFF", height: 97, flexDirection: "row", paddingHorizontal: 15 }}>
                <View style={{ flex: 2, justifyContent: "center", alignItems: "center", backgroundColor: "transparent" }}>
                    <LinearGradient
                        colors={['#DB3D88', '#273174']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        style={{ width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center" }}>
                        <Image source={item.picture ? item.picture : avatar} style={{ width: item.picture ? 60 : 21, height: item.picture ? 60 : 29 }} resizeMode="contain" resizeMethod="resize" />
                    </LinearGradient>
                </View>
                <View style={{
                    flex: 8, backgroundColor: "transparent", justifyContent: "center",
                    justifyContent: "center", paddingHorizontal: 15
                }}>
                    <Text style={{ fontSize: 15, fontFamily: "Avenir-Medium", lineHeight: 22 }}>{item.tag? item.tag + ',' : null}
                        <Text style={{ color: "#3E3E47", fontSize: 17, fontFamily: "Avenir-Heavy" }}>{item.name? item.name + ' ' : null}</Text>{item.message}
                    </Text>
                </View>

            </TouchableOpacity>
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