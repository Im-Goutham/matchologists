
import React, { Component } from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import search_result from '../../images/search_result.png'
import search_result_2 from '../../images/search_result_2.png'
import search_result_3 from '../../images/search_result_3.png'
import search_result_4 from '../../images/search_result.png'
import search_result_5 from '../../images/search_result_4.png'
let data = [
    {
        "gender": "male",
        "fullName": "Danny",
        "picture":search_result_2
    },
    {
        "gender": "male",
        "fullName": "don",
        "picture":search_result_2
    },
]
class SearchUserList extends Component {
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
    componentWillReceiveProps(nextProps, nextState){
        console.log("nextProp",nextProps.userList)
        this.setState({ data: nextProps.userList})
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
                    source={item.picture}
                    resizeMethod="resize"
                    resizeMode="contain"
                />
                <View style={{ paddingHorizontal: 10, justifyContent: "space-around" }}>
                    <Text style={{ fontFamily: "Avenir-Heavy", fontSize: 17, color: "#3E3E47" }}>
                        {item.fullName}</Text>
                        <Text style={{ fontFamily: "Avenir-Medium", fontSize: 15, color: "#909096" }}>
                        {"5"}% match</Text> 
                </View>
            </View>
        )
    }
    render() {
        return (
            <FlatList
                contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 150 }}
                data={this.state.data}
                renderItem={({ item }) => this.renderRow(item)}
                keyExtractor = { (item, index) => index.toString()}
                ItemSeparatorComponent={this.renderSeparator}
            />
        );
    }
}

export default SearchUserList;