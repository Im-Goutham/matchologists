import React, { Component } from "react";
import { View, Text, FlatList, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import mono_1 from '../../images/mono_1.png'
import mono_2 from '../../images/mono_2.png'
import morebutton from '../../images/morebutton.png'
let data = [
    {
        name: "Joel",
        picture: mono_1
    },
    {
        name: "Harvey",
        picture: mono_2
    }];
export default class MonogamousList extends Component {
    render() {
        return (
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingEnd: 200,
                    height: 100,
                    backgroundColor: "rgba(255,255,255,100)",
                }}>
                {
                    data.map((value, index) => {
                        return <View key={index} style={{
                            // backgroundColor:"red",
                            width: '45%',
                            height: 100,
                            justifyContent:"space-between",
                            alignItems: "center",
                        }}>
                            <Image
                                source={value.picture}
                                style={{ width: 60, height: 60, borderRadius: 30 }}
                                resizeMethod="resize"
                                resizeMode="contain"
                            />
                            <View style={{ width:60, height:30, justifyContent:"center", alignItems:"center"}}>
                            <Text style={{ fontFamily: "Avenir-Medium", fontSize: 15, color: "#3E3E47", lineHeight: 22 }}>
                                {value.name}</Text>

                                </View>
                        </View>

                    })
                }
                <TouchableOpacity style={{
                    width: '45%',
                    height: 100,
                    justifyContent:"space-between",
                    alignItems: "center"
                }}>
                    <Image
                        source={morebutton}
                        style={{ width: 60, height: 60 }}
                        resizeMethod="resize"
                        resizeMode="contain"
                    />
                    
                        </TouchableOpacity>
            </ScrollView>
                )
            }
        }
