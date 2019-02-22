
import React, { Component } from "react";
import { View, Text, FlatList, Image, StyleSheet, TextInput, Platform, TouchableOpacity } from "react-native";
import metrics from '../../config/metrics';
// import Icons from 'react-native-vector-icons/Feather'
import {
    widthPercentageToDP,
    heightPercentageToDP,
} from 'react-native-responsive-screen';

import friends_1 from '../../images/user1.png'
import friends_2 from '../../images/user2.png'
import friends_3 from '../../images/user3.png'
import friends_4 from '../../images/user4.png'

const IS_ANDROID = Platform.OS === 'android'

const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.47
const IMAGE_HEIGHT = metrics.DEVICE_HEIGHT * 0.284

let mutualFriendList = [
    {
        "id": 1,
        "image": friends_1
    },
    {
        "id": 2,
        "image": friends_2
    },
    {
        "id": 3,
        "image": friends_3
    },
    {
        "id": 4,
        "image": friends_4
    },
    {
        "id": 5,
        "image": friends_3
    }
];
export default class MutualFriends extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: mutualFriendList,
            page: 1,
            seed: 1,
            error: null,
            refreshing: false,
        };
    }

    renderRow = (item) => {
        return (
            <View style={[styles.row, styles.elevated_shdow]} key={item.item}>
                <Image 
                source={item.image}
                    style={{
                        width: 64,
                        height: 64,
                    }}
                    resizeMethod="resize"
                    resizeMode="contain"
                />
            </View>
        )
    }
    render() {
        return (
            <FlatList contentContainerStyle ={{paddingHorizontal:8 }}
                horizontal={true}
                style={{ flexGrow: 1}}
                data={this.state.data}
                renderItem={({ item }) => this.renderRow(item)}
                keyExtractor={(item,index)=>index.toString()}
                showsHorizontalScrollIndicator={false}
            />
        );
    }
}
let styles = StyleSheet.create({
    row: {
        // margin:5,
        marginHorizontal:8,
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems:"center",
        justifyContent:"center",
        // backgroundColor: '#009966',
    },
    elevated_shdow: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 3,
        shadowColor: 'black',
    }
})
// module.exports = {
//     MutualFriends,
// };
