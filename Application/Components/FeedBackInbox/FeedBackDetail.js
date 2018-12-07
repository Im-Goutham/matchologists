
import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    Text,
    FlatList,
    View,
    Image,
    TouchableOpacity,
    SafeAreaView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import metrics from '../../config/metrics';
import photo_1 from '../../images/search_result.png';
import avatar from '../../images/avatar.png'

let data = {
    "id": 1,
    "tag": "Great job",
    "name": "Danny Rice",
    "message": "enjoyed your interaction, keep it up",
    "picture": photo_1,
}
export default class FeedBackDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data : data
        };
    }
    render() {
        const { navigation } = this.props;

        const { goBack } = this.props.navigation;
        console.log("params", navigation.getParam("params"))
        let data = navigation.getParam("params")
        console.log("data", data)
        // const {data} = this.state;
        return (
            <View style={styles.container}>

                <SafeAreaView>
                    <View style={{ height: 64, justifyContent: "space-between", flexDirection: "row" }}>
                        <TouchableOpacity
                            onPress={() => goBack()}
                            style={{
                                width: "15%",
                                // backgroundColor: "red",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                            <Image
                                source={require('../../images/icons/backbutton_gradient.png')}
                                style={{
                                    width: 24,
                                    height: 16
                                }}
                                resizeMethod="resize"
                                resizeMode="contain" />
                        </TouchableOpacity>
                        <View style={{
                            width: "70%",
                            // backgroundColor: "blue", 
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <Text style={{ fontFamily: "Avenir-Heavy", fontSize: 24, color: "#000" }}> {}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => this.setState({ visibleModal: true })}
                            style={{
                                width: "15%",
                                // backgroundColor: "#009933",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                        </TouchableOpacity>
                    </View>
                    <View style={{ backgroundColor: "#FFF", height: 97, flexDirection: "row", paddingHorizontal: 15 }}>
                    <View style={{ flex: 2, justifyContent: "center", alignItems: "center", backgroundColor: "transparent" }}>
                    <LinearGradient
                        colors={['#DB3D88', '#273174']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        style={{ width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center" }}>
                        <Image source={data.picture ? data.picture : avatar} style={{ width: data.picture ? 60 : 21, height: data.picture ? 60 : 29 }} resizeMode="contain" resizeMethod="resize" />
                    </LinearGradient>
                </View>
                <View style={{
                    flex: 8, backgroundColor: "transparent", justifyContent: "center",
                    justifyContent: "center", paddingHorizontal: 15
                }}>
                    <Text style={{ fontSize: 15, fontFamily: "Avenir-Medium", lineHeight: 22 }}>{data.tag? data.tag + ',' : null}
                        <Text style={{ color: "#3E3E47", fontSize: 17, fontFamily: "Avenir-Heavy" }}>{data.name? data.name + ' ' : null}</Text>{data.message}
                    </Text>
                </View>

                    </View>
                </SafeAreaView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF"
    }
});