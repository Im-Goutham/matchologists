/**
 * Top-Profile page
 * Author :abhishekkalia
 */

import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    SafeAreaView,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { connect } from "react-redux";
import LinearGradient from 'react-native-linear-gradient';
import i18n from 'react-native-i18n';
import Header from '../Common/Header';
import MonogamousList from './monogamous';
import SuggestionList from './list';
import Apirequest from '../Common/Apirequest'
const IS_ANDROID = Platform.OS === 'android';
import metrics from '../../config/metrics';
const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.05
const header_height = metrics.DEVICE_HEIGHT * 0.1

class TopProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            monogamoususerDataList: [],
            dataSource: [],
            isloading: true
        }
    }
    componentDidMount = async () => {
        this.getFavouriteUsers()
    }
    getFavouriteUsers = () => {
        var token = this.props.token;
        Apirequest.getFavouriteUsers(token, '', resolve => {
            console.log("TopProfile_resolve", resolve)

            if (resolve.data) {
                var dataSource = [];
                var monogamousData = [];
                // console.log("TopProfile_resolve", resolve.data.data)
                var datasource = resolve.data.data;
                for (var i = 0; i < datasource.length; i++) {
                    let dataobject = {};
                    dataobject.fullName = datasource[i].fullName ? datasource[i].fullName : '';
                    dataobject.percentage = datasource[i].percentage ? datasource[i].percentage : '';
                    dataobject.uri = datasource[i].profilePic ? datasource[i].profilePic : '';
                    dataobject._id = datasource[i]._id ? datasource[i]._id : '';
                    dataobject.isMono = datasource[i].isMono ? datasource[i].isMono : false;
                    dataobject.isFavourate = true
                    dataSource.push(dataobject)
                    if (datasource[i] && datasource[i].isMono) {
                        var monogamousobj = {};
                        monogamousobj.fullName = datasource[i].fullName ? datasource[i].fullName : '';
                        monogamousobj.percentage = datasource[i].percentage ? datasource[i].percentage : '';
                        monogamousobj.uri = datasource[i].profilePic ? datasource[i].profilePic : '';
                        monogamousobj._id = datasource[i]._id ? datasource[i]._id : '';
                        monogamousData.push(monogamousobj)
                    }
                }
                this.setState({
                    monogamoususerDataList: monogamousData,
                    dataSource: dataSource,
                    isloading: false
                })
            }

        }, reject => {
            console.log("TopProfile_reject", reject)
        })
    }
    addFavouriteUserAsMonogamous = (cbdata) => {
        console.log("addFavouriteUserAsMonogamous", cbdata)
        var token = this.props.token;
        var data = {
            "profileUserId": cbdata._id
        };
        console.log("addFavouriteUserAsMonogamous_POst_data", data)
        Apirequest.addFavouriteUserAsMonogamous(token, data, resolve => {
            this.getFavouriteUsers()
            console.log("resolve", resolve)
        }, reject => {
            console.log("reject", reject)
        })

    }
    removeFavouriteUser = (cbdata) => {
        console.log("removeFavouriteUser", cbdata._id)
        var token = this.props.token;
        var data = {
            "profileUserId": cbdata._id
        };
        console.log("removeFavouriteUser_POst_token", token)
        console.log("removeFavouriteUser_POst_data", data)

        Apirequest.removeFavouriteUser(token, data, (resolve) => {
            this.getFavouriteUsers()
            console.log("resolve", resolve)
        }, (reject) => {
            console.log("reject", reject)
        }
        )
    }
    removeMonogamousUser = (cbdata) => {
        console.log("removeMonogamousUser", cbdata._id)
        var token = this.props.token;
        var data = {
            "profileUserId": cbdata._id
        };
        Apirequest.removeMonogamousUser(token, data, (resolve) => {
            this.getFavouriteUsers()
            console.log("resolve", resolve)
        }, (reject) => {
            console.log("reject", reject)
        }
        )

    }
    render() {
        console.log("devices are", Platform)
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={['#DB3D88', '#273174']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        // marginBottom : IS_ANDROID ? 30 :20
                    }}>
                    <SafeAreaView>
                        <Header
                            isSearcrchbar={false}
                            left={
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.openDrawer()}
                                    style={{
                                        width: "15%",
                                        backgroundColor: "transparent",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                    <Image
                                        source={require('../../images/menu.png')}
                                        style={{
                                            width: metrics.DEVICE_WIDTH * 0.0588,
                                            height: metrics.DEVICE_HEIGHT * 0.023
                                        }}
                                        resizeMethod="resize"
                                        resizeMode="contain" />
                                </TouchableOpacity>
                            }
                            middle={
                                <View style={{ width: "70%", backgroundColor: "transparent", alignItems: "center", justifyContent: "center" }}>
                                    <Text style={{ fontFamily: "Avenir-Heavy", fontSize: 24, color: "#fff" }}>Top 10</Text>
                                </View>
                            }
                            right={
                                <TouchableOpacity
                                    onPress={() => this.setState({ visibleModal: true })}
                                    style={{
                                        width: "15%",
                                        backgroundColor: "transparent",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                    <Text style={{ fontFamily: "Avenir-Heavy", fontSize: 13, color: "rgba(255,255,255,100)" }}>Done</Text>
                                </TouchableOpacity>
                            }
                        />
                    </SafeAreaView>
                </LinearGradient>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ marginTop: 15, padding: 16, backgroundColor: "rgba(255, 255,255,100)" }}>
                        <Text style={{ fontFamily: "Avenir-Medium", fontSize: 15, color: "#C1C0C9", marginBottom: 16 }}>{i18n.t('monogamouslabel')}</Text>
                        <MonogamousList monogamoususerDataList={this.state.monogamoususerDataList} removeMonogamousUser={this.removeMonogamousUser.bind(this)} />
                    </View>
                    <View style={{ height: 54 }}>
                        <Text style={{ paddingHorizontal: 16, paddingVertical: 8, fontFamily: "Avenir-Medium", fontSize: 13, color: "rgba(144,144,150,100)" }}>{i18n.t('add_people_limit')}</Text>
                    </View>
                    <View style={{ backgroundColor: "transparent", }}>
                        <SuggestionList
                            dataSource={this.state.dataSource}
                            isloading={this.state.isloading}
                            addFavouriteUserAsMonogamous={this.addFavouriteUserAsMonogamous.bind(this)}
                            removeFavouriteUser={this.removeFavouriteUser.bind(this)}
                            removeMonogamousUser={this.removeMonogamousUser.bind(this)}
                        />
                    </View>
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        // backgroundColor: "#009933" //'rgba(255,255,255, 100)',
    },
    bottomModal: {
        justifyContent: "flex-end",
        margin: 0
    },
});
mapStateToProps = (state) => {
    return {
        data: state.auth.data,
        token: state.auth.token,
        profileimage: state.auth.profileimage,
        language: state.language.defaultlanguage
    }
}

export default connect(mapStateToProps)(TopProfile);
