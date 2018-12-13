import React, { Component, PropTypes } from 'react'
import {
    Platform,
    StyleSheet,
    TextInput,
    FlatList,
    View,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Text
} from 'react-native'
import Modal from 'react-native-modal';
import Flag from 'react-native-flags';
const arr_list = [
    {
        c_name: "INDIA",
        flag: "IN",
        code: "+91"
    },
    {
        c_name: "USA",
        flag: "US",
        code: "+91"
    },
    {
        c_name: "UAE",
        flag: "UA",
        code: "+91"
    },
    {
        c_name: "Zimbabe",
        flag: "ZA",
        code: "+91"
    },
    {
        c_name: "INDIA",
        flag: "IN",
        code: "+91"
    },
    {
        c_name: "USA",
        flag: "US",
        code: "+91"
    },
    {
        c_name: "UAE",
        flag: "UA",
        code: "+91"
    },
    {
        c_name: "Zimbabe",
        flag: "ZA",
        code: "+91"
    },
    {
        c_name: "INDIA",
        flag: "IN",
        code: "+91"
    },
    {
        c_name: "USA",
        flag: "US",
        code: "+91"
    },
    {
        c_name: "UAE",
        flag: "UA",
        code: "+91"
    },
    {
        c_name: "Zimbabe",
        flag: "ZA",
        code: "+91"
    },
    {
        c_name: "INDIA",
        flag: "IN",
        code: "+91"
    },
    {
        c_name: "USA",
        flag: "US",
        code: "+91"
    },
    {
        c_name: "UAE",
        flag: "UA",
        code: "+91"
    },
    {
        c_name: "Zimbabe",
        flag: "ZA",
        code: "+91"
    },
    {
        c_name: "INDIA",
        flag: "IN",
        code: "+91"
    },
    {
        c_name: "USA",
        flag: "US",
        code: "+91"
    },
    {
        c_name: "UAE",
        flag: "UA",
        code: "+91"
    },
    {
        c_name: "Zimbabe",
        flag: "ZA",
        code: "+7898411321"
    }
];
export default class CountrySelection extends Component {

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 10,
                    // backgroundColor: "#CED0CE",
                }}
            />
        );
    };

    renderRow(item) {
        return (
            <TouchableOpacity style={styles.selectcountry} onPress={()=>this.props.selectCode(item)}>
                <View style={styles.titlebox}>
                    <View style={{ width: 40, height: 40, borderRadius: 20, overflow: "hidden", justifyContent: "center", alignItems: "center" }}>
                        <Flag
                            type={'flat'}
                            code={item.flag}
                            size={64}
                        />
                    </View>
                    <Text style={styles.label}>{item.c_name}</Text>
                </View>
                <View style={styles.code}>
                    <Text style={styles.label}>{item.code}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <View style={styles.contryContainer}>
                        <FlatList
                            contentContainerStyle={styles.countryScroll}
                            data={arr_list}
                            renderItem={({ item }) => this.renderRow(item)}
                            ItemSeparatorComponent={this.renderSeparator}
                            ListHeaderComponent={
                                <View style={{
                                    height: 40,
                                    borderRadius: 20,
                                    backgroundColor: "#FFF",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginBottom: 10,
                                }}>
                                    <Text style={{ color: "#000" }}> Select Country</Text>
                                </View>
                            }
                        />
                    </View>
                    <TouchableOpacity style={styles.cancelButton} onPress={this.props.onSwipe}>
                        <Text style={[styles.label]}>Cancel </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }
}
const styles = {
    container: {
        flex: 1,
        // backgroundColor: 'rgba(255, 255, 255, 100)',
        paddingHorizontal: 15,
        justifyContent:"space-between"
    },
    contryContainer: {
        height: '90%',
        // backgroundColor: "#fff",

    },
    countryScroll: {
        // paddingHorizontal: 15,
        borderRadius: 5
    },
    titlebox: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center"
    },
    label: {
        color: "#000",
        fontSize: 17,
        fontFamily: "Avenir-Heavy",
        lineHeight: 22,
        marginHorizontal: 10
    },
    code: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingHorizontal: 15,
        alignItems: "center",
    },
    selectcountry: {
        height: 40,
        borderRadius: 25,
        backgroundColor: "#F5F5F5",
        // marginVertical: 3,
        flexDirection: "row",
        alignItems: "center"

    },
    cancelButton: {
        // marginVertical: '3%',
        justifyContent: "center",
        alignItems: "center",
        height: 54,
        backgroundColor: "#FFF",
        borderRadius: 5
    }
}