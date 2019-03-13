import React, { Component } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
// import search_result from '../../images/search_result.png'
// import search_result_2 from '../../images/search_result_2.png'
// import search_result_3 from '../../images/search_result_3.png'
// import search_result_4 from '../../images/search_result.png'
// import search_result_5 from '../../images/search_result_4.png'

class OnlineUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1, //StyleSheet.hairlineWidth,
                    width: "80%",
                    backgroundColor: "#EFEFEF",
                    marginLeft: "20%"
                }}
            />
        );
    };
    renderRow = this.props.userdataList.map((item, index) => {
        const { navigate } = this.props.navigation;
        return (
            <TouchableOpacity
                onPress={() => navigate('chatscreen', { 
                    userId: item._id, 
                    opentokToken: this.props.opentokToken, 
                    fullName: item.fullName ,
                    image : item.uri
                })}
                key={index}
                style={{ flex: 1, alignItems: "center", justifyContent: "space-around", paddingHorizontal: 8 }}>
                <View style={{ alignItems: "center",  shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                    elevation: 3, }}>
                    <View style={{ width: 60, height: 60, borderRadius: 30, overflow: "hidden",  shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                    elevation: 3, }}>
                        <Image
                            style={{ height: '100%', width: '100%', flex: 1 }}
                            source={item.uri ? { uri: item.uri } : require('../../images/applogo.png')}
                        // resizeMethod="resize"
                        // resizeMode="contain"
                        />
                    </View>
                    <View style={{
                        width: 12,
                        height: 12,
                        backgroundColor: "#38CA73",
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        borderRadius: 6,
                        borderWidth: 2,
                        borderColor: "#FFF"
                    }} />
                </View>
                <View style={{ justifyContent: "space-around" }}>
                    <Text style={{ fontFamily: "Avenir-Medium", fontSize: 15, color: "#3E3E47" }}>{item.fullName}</Text>
                </View>
            </TouchableOpacity>
        )
    })
    handleClick = () => { }
    render() {
        return (
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ height: 100, flexDirection: "row", paddingLeft: 8 }}>
                {this.renderRow}
            </ScrollView>
        );
    }
}
class Userlist extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "80%",
                    backgroundColor: "#EFEFEF",
                    marginLeft: "20%"
                }}
            />
        );
    };
    renderRow = (item, index) => {
        const { navigate } = this.props.navigation;
        console.log("chatscreen", item)
        return (
            <TouchableOpacity
                onPress={() => navigate('chatscreen', { 
                    userId: item._id, 
                    opentokToken: this.props.opentokToken, 
                    fullName: item.fullName,
                    image : item.uri
                })}
                key={index}
                style={{ flex: 1, flexDirection: "row", paddingVertical: 16 }}>
                <View style={{ flex: 2, alignItems: "center" }}>
                    <View style={{ width: 60, height: 60, borderRadius: 30, overflow: "hidden" }}>
                        <Image
                            style={{ height: '100%', width: '100%', flex: 1 }}
                            source={item.uri ? { uri: item.uri } : require('../../images/applogo.png')}
                        />
                    </View>
                    {/* <Badge /> */}
                </View>
                <View style={{
                    flex: 6,
                    paddingHorizontal: 10,
                    justifyContent: "space-around",
                }}>
                    <Text style={{ fontFamily: "Avenir-Heavy", fontSize: 17, color: "#3E3E47" }}>
                        {item.fullName}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    render() {
        return (
            <FlatList
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    backgroundColor: 'rgba(255,255,255, 100)',
                }}
                data={this.props.userdataList}
                renderItem={({ item }) => this.renderRow(item)}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={this.renderSeparator}
            />
        );
    }
}
class Badge extends Component {
    constructor() {
        super();
        this.state = {
            badgeCount: 1
        }
    }
    render() {
        return (
            <View style={{
                width: 20,
                height: 20,
                backgroundColor: "#DB3D88",
                position: "absolute",
                bottom: 5,
                right: 5,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#FFF"
            }}>
                <Text style={{ fontSize: 15, color: "#FFF" }}>{this.state.badgeCount}</Text>
            </View>
        )

    }
}
module.exports = {
    OnlineUsers,
    Userlist
}
// export default Userlist;