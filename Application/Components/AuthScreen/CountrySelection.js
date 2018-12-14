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
    Text,
    Image
} from 'react-native'
import Modal from 'react-native-modal';
import Flag from 'react-native-flags';
const arr_list = [
    {
        c_name: "AFGHANISTAN",
        flag: "AF",
        code: "+91"
    },
    {
        c_name: "ALBANIA",
        flag: "AL",
        code: "+91"
    },
    {
        c_name: "ALGERIA",
        flag: "DZ",
        code: "+91"
    },
    {
        c_name: "ANDORRA",
        flag: "AD",
        code: "+91"
    },
    {
        c_name: "ANGOLA",
        flag: "AO",
        code: "+91"
    },
    {
        c_name: "ANTIGUA & BARBUDA",
        flag: "AG",
        code: "+91"
    },
    {
        c_name: "ARGENTINA",
        flag: "AR",
        code: "+91"
    },
    {
        c_name: "ARMENIA",
        flag: "AM",
        code: "+91"
    },
    {
        c_name: "AUSTRALIA",
        flag: "AU",
        code: "+91"
    },
    {
        c_name: "AUSTRIA",
        flag: "AT",
        code: "+91"
    },
    {
        c_name: "AZERBAIJAN",
        flag: "AZ",
        code: "+91"
    },
    {
        c_name: "BAHAMAS, THE",
        flag: "BS",
        code: "+91"
    },
    {
        c_name: "BAHRAIN",
        flag: "BH",
        code: "+91"
    },
    {
        c_name: "BANGLADESH",
        flag: "BD",
        code: "+91"
    },
    {
        c_name: "BARBADOS",
        flag: "BB",
        code: "+91"
    },
    {
        c_name: "BELARUS",
        flag: "BY",
        code: "+91"
    },
    {
        c_name: "BELGIUM",
        flag: "BE",
        code: "+91"
    },
    {
        c_name: "BELIZE",
        flag: "BZ",
        code: "+91"
    },
    {
        c_name: "BENIN",
        flag: "BJ",
        code: "+91"
    },
    {
        c_name: "BHUTAN",
        flag: "BT",
        code: "+7898411321"
    },
    {
        c_name: "BOLIVIA",
        flag: "BO",
        code: "+91"
    },
    {
        c_name: "BOSNIA & HERZEGOVINA",
        flag: "BA",
        code: "+91"
    },
    {
        c_name: "BOTSWANA",
        flag: "BW",
        code: "+91"
    },
    {
        c_name: "BRAZIL",
        flag: "BR",
        code: "+91"
    },
    {
        c_name: "BRUNEI",
        flag: "BN",
        code: "+91"
    },
    {
        c_name: "BULGARIA",
        flag: "BG",
        code: "+91"
    },
    {
        c_name: "BURKINA FASO",
        flag: "BF",
        code: "+7898411321"
    },
    {
        c_name: "BURUNDI",
        flag: "BL",
        code: "+7898411321"
    }
];
export default class CountrySelection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            country_name: '',
            countryList: arr_list,
            error: null,
        }
    }

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

    renderRow(item) {
        return (
            <TouchableOpacity style={styles.selectcountry} onPress={() => this.props.selectCode(item)}>
                <View style={styles.titlebox}>
                    <View style={{
                        width: 80,
                        height: 40,
                        // borderRadius: 20, 
                        overflow: "hidden",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <Flag
                            type={'flat'}
                            code={item.flag}
                            size={32}
                        />
                    </View>
                    <Text style={styles.label}>{item.c_name}</Text>
                </View>
                {/* <View style={styles.code}>
                    <Text style={styles.label}>{item.code}</Text>
                </View> */}
            </TouchableOpacity>
        )
    }
    searchFilterFunction = text => {
        const newData = arr_list.filter(item => {
            const itemData = `${item.c_name.toUpperCase()}   
          ${item.c_name.toUpperCase()} ${item.c_name.toUpperCase()}`;
            const textData = this.state.country_name.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        this.setState({
            country_name: text,
            countryList: newData
        });
    };
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <View style={styles.contryContainer}>
                        <FlatList
                            contentContainerStyle={styles.countryScroll}
                            data={this.state.countryList}
                            renderItem={({ item }) => this.renderRow(item)}
                            // ItemSeparatorComponent={this.renderSeparator}
                            ListHeaderComponent={
                                <View style={{
                                    paddingHorizontal: 10,
                                    height: 40,
                                }}>
                                    <View style={{
                                        flex: 1,
                                        borderWidth: 1,
                                        borderRadius: 5,
                                        borderColor: '#909096',
                                        alignItems: "center",
                                        flexDirection: "row"
                                    }}>
                                        <Image
                                            source={require('../../images/icons/search.png')}
                                            style={{
                                                width: 25,
                                                height: 25,
                                                marginHorizontal: 10,
                                            }}
                                        />
                                        <TextInput
                                            placeholder="Search here ...."
                                            underlineColorAndroid="transparent"
                                            value={this.state.country_name}
                                            lightTheme
                                            round
                                            onChangeText={text => this.searchFilterFunction(text)}
                                            autoCorrect={false}
                                            // onChange={(val)=>this.setState({country_name:val})}
                                            style={{
                                                // paddingHorizontal: 10,
                                                // backgroundColor: "#009933",
                                                height: 40,
                                                flex: 1
                                            }}
                                        />
                                        <Text onPress={()=>this.setState({
                                            country_name:''
                                        })}
                                        style={{ 
                                            // height:"100%", 
                                            paddingHorizontal: 10, 
                                            // backgroundColor:"red",
                                            alignSelf:"center"
                                        }}>Cancel </Text>
                                    </View>

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
        backgroundColor: 'rgba(255, 255, 255, 100)',
        // paddingHorizontal: 15,
        justifyContent: "space-between"
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
        height: 60,
        // borderRadius: 25,
        backgroundColor: "#FFF",
        // marginVertical: 3,
        flexDirection: "row",
        alignItems: "center"

    },
    cancelButton: {
        // marginVertical: '3%',
        justifyContent: "center",
        alignItems: "center",
        height: 54,
        // backgroundColor: "#009933",
        borderRadius: 5
    }
}