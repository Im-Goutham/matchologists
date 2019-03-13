import React, { Component } from "react";
import { View, Text, FlatList, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import mono_1 from '../../images/mono_1.png'
import mono_2 from '../../images/mono_2.png'
import morebutton from '../../images/morebutton.png'

export default class MonogamousList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            monogamoususerDataList: []
        }
    }
    componentDidMount() {
        this.setState({
            monogamoususerDataList: this.props.monogamoususerDataList
        })
    }
    componentWillReceiveProps = (nextProps, nextState) => {
        this.setState({
            monogamoususerDataList: nextProps.monogamoususerDataList
        })
    }
    removeMonogamousUser = (value) => {
        console.log("value", value)
        Alert.alert(
            'Remove From Monogamous',
            `Are You like to Remove ${value.fullName} from your Monogamous List`,
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => this.props.removeMonogamousUser(value) },
            ],
            { cancelable: false },
        );
    }
    render() {
        return (
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    // paddingEnd: 200,
                    height: 100,
                    backgroundColor: "rgba(255,255,255,100)",
                }}>
                {
                    this.state.monogamoususerDataList.map((value, index) => {
                        return <TouchableOpacity
                            onLongPress={() => this.removeMonogamousUser(value)}
                            key={index}
                            style={
                                [{
                                    marginRight: 16,
                                    height: 100,
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }]
                            }>
                            <View style={[{ width: 60, height: 60, borderRadius: 30, overflow: "hidden" }, styles.elevationView]}>
                                <Image
                                    source={value.uri ? { uri: value.uri } : require('../../images/applogo.png')}
                                    style={{ width: '100%', height: '100%', }}
                                    resizeMethod="resize"
                                />
                            </View>
                            <View style={{ width: 60, height: 30, justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ fontFamily: "Avenir-Medium", fontSize: 15, color: "#3E3E47", lineHeight: 22 }} numberOfLines={1}>{value.fullName}</Text>
                            </View>
                        </TouchableOpacity>

                    })
                }
                <TouchableOpacity style={{
                    width: 60, height: 60,
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <Image
                        source={morebutton}
                        style={{ width: '100%', height: '100%' }}
                        resizeMethod="resize"
                        resizeMode="contain"
                    />

                </TouchableOpacity>
            </ScrollView>
        )
    }
}
var styles = {
    elevationView: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    }
}
