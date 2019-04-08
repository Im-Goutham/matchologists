import React, { Component } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import PopupMenu from "../Userprofile/options";
import search_result from '../../images/search_result.png'
import search_result_2 from '../../images/search_result_2.png'
import search_result_3 from '../../images/search_result_3.png'
import search_result_4 from '../../images/search_result.png'
import search_result_5 from '../../images/search_result_4.png'
import moreoptions from '../../images/icons/moreoptions.png';

class SuggestionList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
            page: 1,
            seed: 1,
            error: null,
            refreshing: false,
        };
    }
    componentDidMount() {
        this.setState({
            data: this.props.dataSource,
            isloading: this.props.isloading
        })
    }
    componentWillReceiveProps = (nextProps, nextState) => {
        this.setState({
            data: nextProps.dataSource,
            isloading: nextProps.isloading
        })
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
    addFavouriteUserAsMonogamous(item) {
        this.props.addFavouriteUserAsMonogamous(item)
    }
    removeFavouriteUser(item){
        this.props.removeFavouriteUser(item)
    }
    removeMonogamousUser(item){
        this.props.removeMonogamousUser(item)
    }
    cancel() { }
    renderRow = (item) => {
        return (
            <>
                {/* <View style={{ alignItems: "flex-end", paddingVertical: 8, paddingHorizontal: 8 }}>
                    <PopupMenu
                        button={moreoptions}
                        buttonStyle={styles.popupmenu}
                        destructiveIndex={1}
                        options={["Add To Monogamous", " Remove Favourite", "Cancel"]}
                        actions={[this.addFavouriteUserAsMonogamous.bind(this, item), this.removeFavouriteUser.bind(this, item), this.cancel]}
                    />
                </View> */}
                <TouchableOpacity key={item.id} onPress={() => this.handleClick(item)}
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        paddingVertical: 16,
                        // paddingBottom: 16,
                        paddingHorizontal: 16
                    }}>
                    <View style={[ styles.elevationView, { width: 60, height: 60, borderRadius: 30, alignItems: "center", overflow: "hidden" }]}>
                        <Image
                            style={{
                                width: '100%', height: '100%'
                            }}
                            source={item.uri  ? { uri: item.uri }: require('../../images/applogo.png') }
                            resizeMethod="resize"
                        // resizeMode="contain"
                        />
                    </View>
                    <View style={{
                        flex: 6,
                        paddingHorizontal: 10,
                        justifyContent: "space-around",
                    }}>
                        <Text style={{ fontFamily: "Avenir-Heavy", fontSize: 17, color: "#3E3E47" }}>
                            {item.fullName}</Text>
                        <Text style={{ fontFamily: "Avenir-Medium", fontSize: 15, color: "#909096" }}>
                            {item.percentage}% match</Text>
                    </View>
                    <View style={{
                        flex: 2,
                        alignItems: "flex-end",
                        justifyContent: "center"
                    }}>
                    <PopupMenu
                        button={moreoptions}
                        buttonStyle={styles.popupmenu}
                        destructiveIndex={1}
                        options={[item.isMono ? "Remove monogamous" : "Add To Monogamous", " Remove Favourite",  "Cancel"]}
                        actions={[item.isMono ?  this.removeMonogamousUser.bind(this, item) : this.addFavouriteUserAsMonogamous.bind(this, item), this.removeFavouriteUser.bind(this, item),   this.cancel]}
                    />
                        {/* <View
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
                                item.isFavourate ? <View style={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: 6,
                                    borderColor: "#D43C87",
                                    backgroundColor: "#D43C87",
                                    borderWidth: 1
                                }} /> : undefined

                            }
                        </View> */}
                    </View>
                </TouchableOpacity>
            </>
        )
    }
    handleClick = (item) => {
        item.isFavourate = item && item.isFavourate ? false : true
        this.setState({
            data: this.state.data
        })

    }
    render() {
        return (
            <FlatList
                contentContainerStyle={{
                    // paddingHorizontal: 16,
                    // paddingBottom: 150,
                    backgroundColor: 'rgba(255,255,255, 100)',
                }}
                data={this.state.data}
                renderItem={({ item }) => this.renderRow(item)}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={this.renderSeparator}
            />
        );
    }
}

// class CustomRadioButton extends Component {
// constructor(props) {
//     super(props);
//     this.state = {
//         active: false
//     }
// }    
// handleClick = () => {
//     this.setState({
//         active: !this.state.active
//     })
// }
//     render() {
//         return (
//             <TouchableOpacity
//                 onPress={this.props.buttonClick}
//                 // onPress={this.handleClick}
//                 style={{
//                     width: 20,
//                     height: 20,
//                     borderRadius: 10,
//                     borderColor: "#D43C87",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     borderWidth: 1
//                 }} >
//                 {
//                     this.state.active ? <View style={{
//                         width: 12,
//                         height: 12,
//                         borderRadius: 6,
//                         borderColor: "#D43C87",
//                         backgroundColor: "#D43C87",
//                         borderWidth: 1
//                     }} /> : undefined

//                 }
//             </TouchableOpacity>
//         )
//     }
// }
var styles = {
    popupmenu: {
        width: 20,
        height: 20,
        margin: 7.5,
        resizeMode: "contain"
    },
    elevationView: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    }
}

export default SuggestionList;