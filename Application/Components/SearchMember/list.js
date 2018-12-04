
import React, { Component } from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
// import { List, ListItem } from "react-native-elements";
import search_result from '../../images/search_result.png'
import search_result_2 from '../../images/search_result_2.png'
import search_result_3 from '../../images/search_result_3.png'
import search_result_4 from '../../images/search_result.png'
import search_result_5 from '../../images/search_result_4.png'
let data = [
    {
        "gender": "male",
        "name": {
            "first": "Danny",
            "last": "Rice"
        },
        "match":{
            "matchfound":45
        },
        "picture": {
            "thumbnail": search_result
        }
    },
    {
        "gender": "male",
        "name": {
            "first": "Jane",
            "last": "Gibson"
        },
        "match":{
            "matchfound":90
        },
        "picture": {
            "thumbnail": search_result_2
        }
    },
    {
        "gender": "male",
        "name": {
            "first": "Sean",
            "last": "Potter"
        },
        "match":{
            "matchfound":87
        },
        "picture": {
            "thumbnail":search_result_3
        }
    },
    {
        "gender": "male",
        "name": {
            "first": "Betty",
            "last": "Schwartz"
        },
        "match":{
            "matchfound":50
        },
        "picture": {
            "thumbnail": search_result_4
        }
    },
    {
        "gender": "male",
        "name": {
            "first": "Clara ",
            "last": "Griffin"
        },
        "match":{
            "matchfound":22
        },
        "picture": {
            "thumbnail": search_result_5
        }
    },
]



class FlatListDemo extends Component {
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
        const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
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
                    height: 1, //StyleSheet.hairlineWidth,
                    width: "80%",
                    backgroundColor: "#EFEFEF",
                    marginLeft: "20%"
                }}
            />
        );
    };
    renderRow(item) {
        return (
            <View style={{
                flex: 1,
                flexDirection: "row",
                marginVertical: 10,
            }}>
                <Image
                    style={{
                        // backgroundColor: "red",
                        width: 60, height: 60, borderRadius: 30
                    }}
                    source={item.picture.thumbnail}
                    resizeMethod="resize"
                    resizeMode="contain"
                />
                <View style={{ paddingHorizontal: 10, justifyContent: "space-around" }}>
                    <Text style={{ fontFamily: "Avenir-Heavy", fontSize: 17, color: "#3E3E47" }}>
                        {item.name.first + " " + item.name.last}</Text>
                        <Text style={{ fontFamily: "Avenir-Medium", fontSize: 15, color: "#909096" }}>
                        {item.match.matchfound}% match</Text> 

                </View>
                {/* <Text>{JSON.stringify(item.picture)}</Text> */}
            </View>
        )
    }
    render() {
        return (
            <FlatList
                contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 150 }}
                data={this.state.data}
                renderItem={({ item }) => this.renderRow(item)}
                keyExtractor={item => item.email}
                ItemSeparatorComponent={this.renderSeparator}
            />
        );
    }
}

export default FlatListDemo;