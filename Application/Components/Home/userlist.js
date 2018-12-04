
import React, { Component } from "react";
import { View, Text, FlatList, Image, StyleSheet, TextInput, Platform, TouchableOpacity } from "react-native";
import metrics from '../../config/metrics';
import Icons from 'react-native-vector-icons/Feather'
import {
    widthPercentageToDP,
    heightPercentageToDP,
} from 'react-native-responsive-screen';
import userImage from '../../images/Rectangle.png'
import userImage2 from '../../images/Rectangle_2.png'
import userImage3 from '../../images/Rectangle_3.png'
import userImage4 from '../../images/Rectangle_4.png'
import CustomTextInput from '../CustomTextInput'
const IS_ANDROID = Platform.OS === 'android'

const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.47
const IMAGE_HEIGHT = metrics.DEVICE_HEIGHT * 0.284

let data = [
    {
        "id":1,
        "name": "Bettie Fleming",
        "age": "Age, 29",
        "image": userImage
    },
    {
        "id":2,
        "name": "Marie Watts",
        "age": "Age, 29",
        "image": userImage2
    },
    {
        "id":3,
        "name": "Ellen Miles",
        "age": "Age, 29",
        "image": userImage3
    },
    {
        "id":4,
        "name": "Louise Marshall",
        "age": "Age, 29",
        "image": userImage4
    },
    {
        "id":5,
        "name": "Bettie Fleming",
        "age": "Age, 29",
        "image": userImage
    },
    {
        "id":6,
        "name": "Marie Watts",
        "age": "Age, 29",
        "image": userImage2
    },
    {
        "id":7,
        "name": "Ellen Miles",
        "age": "Age, 29",
        "image": userImage3
    },
    {
        "id":8,
        "name": "Louise Marshall",
        "age": "Age, 29",
        "image": userImage4
    }
]
export default class Userlist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: data,
            page: 1,
            seed: 1,
            error: null,
            refreshing: false,
        };
    }
    componentDidMount() {
        // this.makeRemoteRequest();
    }
    makeRemoteRequest = () => {
        const { page, seed } = this.state;
        const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=4`;
        this.setState({ loading: true });
        fetch(url)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    data: page === 1 ? res.results : [...this.state.data, ...res.results],
                    error: res.error || null,
                    loading: false,
                    refreshing: false
                });
            })
            .catch(error => {
                this.setState({ error, loading: false });
            });
    };
    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "86%",
                    backgroundColor: "#CED0CE",
                    marginLeft: "14%"
                }}
            />
        );
    };
    renderRow = (item) => {
        // let {navigate } = this.props.navigation
        return (
            <View style={{
                flex: 1,
                justifyContent: 'flex-start',
                marginHorizontal: '1.5%',
                marginVertical: '3%',
                borderRadius: 5,
                height: IS_ANDROID ? heightPercentageToDP('38%') : metrics.DEVICE_HEIGHT * 0.351,
                backgroundColor: '#FFFF',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
                elevation: 3,
                overflow:"hidden"
            }}>

                <TouchableOpacity 
                onPress={()=>this.props.navigation.navigate('userprofile')}
                 style={{flex: 7, backgroundColor:"transparent", flexBasis:50 }}>
                    <Image source={item.image} 
                    style={{
                        flex: 1,
                        width: null,
                        height: null,
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5,
                        // resizeMode: 'contain',
                        // aspectRatio: metrics.DEVICE_WIDTH/metrics.DEVICE_WIDTH *0.89,
                        // width: IMAGE_WIDTH,
                        // backgroundColor:"red", 
                        height: metrics.DEVICE_WIDTH  //IMAGE_HEIGHT
                    }}
                        resizeMethod="resize"
                    // resizeMode="stretch"
                    />

                </TouchableOpacity>
                <View style={{
                    flex:3,
                    // height: 55,
                    // backgroundColor:"red", 
                    justifyContent: "space-around", paddingHorizontal: 10
                }}>
                    <Text style={{ color: "#3E3E47", fontSize: 15, fontFamily: "Avenir-Heavy", lineHeight: 30 }}>{item.name}</Text>
                    <Text style={{ color: "#909096", fontSize: 13, fontFamily: "Avenir-Book", lineHeight: 26 }}>{item.age}</Text>
                </View>
            </View>
        )
    }
    render() {
        return (

            <FlatList
            contentContainerStyle={{ paddingBottom: 150}}
                // contentContainerStyle={styles.list}
                data={this.state.data}
                numColumns={2}
                renderItem={({ item }) => this.renderRow(item)}
                keyExtractor={item => item.id}
            // ItemSeparatorComponent={this.renderSeparator}
            // ListHeaderComponent={<Header />}
            // ListFooterComponent={<Footer />}
            // onEndReached={() => dispatchFetchPage()}
            />
        );
    }
}
let styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: "#009933",
        borderColor: '#CCC',
    },
    list: {
    }
})
// module.exports = {
//     Userlist,
//     SearchHeader
// };