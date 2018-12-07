import React, { Component } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import search_result from '../../images/search_result.png'
import search_result_2 from '../../images/search_result_2.png'
import search_result_3 from '../../images/search_result_3.png'
import search_result_4 from '../../images/search_result.png'
import search_result_5 from '../../images/search_result_4.png'
let data = [
    {
        'id': 1,
        "gender": "male",
        "name": {
            "first": "Danny",
            "last": "Rice"
        },
        "match": {
            "matchfound": 45
        },
        "picture": {
            "thumbnail": search_result
        }
    },
    {
        'id': 2,
        "gender": "male",
        "name": {
            "first": "Jane",
            "last": "Gibson"
        },
        "match": {
            "matchfound": 90
        },
        "picture": {
            "thumbnail": search_result_2
        }
    },
    {
        'id': 3,
        "gender": "male",
        "name": {
            "first": "Sean",
            "last": "Potter"
        },
        "match": {
            "matchfound": 87
        },
        "picture": {
            "thumbnail": search_result_3
        }
    },
    {
        'id': 4,
        "gender": "male",
        "name": {
            "first": "Betty",
            "last": "Schwartz"
        },
        "match": {
            "matchfound": 50
        },
        "picture": {
            "thumbnail": search_result_4
        }
    },
    {
        'id': 5,
        "gender": "male",
        "name": {
            "first": "Clara ",
            "last": "Griffin"
        },
        "match": {
            "matchfound": 22
        },
        "picture": {
            "thumbnail": search_result_5
        }
    },
    {
        'id': 6,
        "gender": "male",
        "name": {
            "first": "Clara ",
            "last": "Griffin"
        },
        "match": {
            "matchfound": 22
        },
        "picture": {
            "thumbnail": search_result_5
        }
    },
]



class SuggestionList extends Component {
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
    renderRow = (item) => {
        return (
            <View key={item.id}
                style={{
                    flex: 1,
                    flexDirection: "row",
                    // marginVertical: 20,
                    paddingVertical:16,
                    // backgroundColor:"#009933"
                }}>
                <View style={{
                    flex: 2,
                    alignItems: "center"
                }}>
                    <Image
                        style={{
                            width: 60, height: 60, borderRadius: 30
                        }}
                        source={item.picture.thumbnail}
                        resizeMethod="resize"
                        resizeMode="contain"
                    />
                </View>
                <View style={{
                    flex: 6,
                    paddingHorizontal: 10,
                    justifyContent: "space-around",
                }}>
                    <Text style={{ fontFamily: "Avenir-Heavy", fontSize: 17, color: "#3E3E47" }}>
                        {item.name.first + " " + item.name.last}</Text>
                    <Text style={{ fontFamily: "Avenir-Medium", fontSize: 15, color: "#909096" }}>
                        {item.match.matchfound}% match</Text>
                </View>
                <View style={{
                    flex: 2,
                    alignItems: "flex-end",
                    justifyContent: "center"
                }}>
                    <CustomRadioButton
                        buttonClick={this.handleClick}
                    />
                </View>
            </View>
        )
    }
    handleClick = () => {
    }
    render() {
        return (
            <FlatList
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 150,
                    backgroundColor: 'rgba(255,255,255, 100)',
                }}
                data={this.state.data}
                renderItem={({ item }) => this.renderRow(item)}
                keyExtractor={item => item.id}
                ItemSeparatorComponent={this.renderSeparator}
            />
        );
    }
}

class CustomRadioButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false
        }
    }
    handleClick = () => {
        this.setState({
            active: !this.state.active
        })
    }
    render() {
        return (
            <TouchableOpacity
                // onPress={this.props.buttonClick} 
                onPress={this.handleClick}
                style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderColor: "#D43C87",
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 1
                }} >
                {
                    this.state.active ? <View style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        borderColor: "#D43C87",
                        backgroundColor: "#D43C87",
                        borderWidth: 1
                    }} /> : undefined

                }
            </TouchableOpacity>
        )
    }
}

export default SuggestionList;