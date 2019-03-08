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
import { connect } from 'react-redux'
// import { OT } from 'opentok-react-native';
import Loading from '../Loading'
import LinearGradient from 'react-native-linear-gradient';
import i18n from 'react-native-i18n'
import Header from '../Common/Header'
import SearchBar from './SearchBar'
import ApiRequest from '../Common/Apirequest';

// import MonogamousList from './monogamous'
import { Userlist, OnlineUsers } from './userlist';
const IS_ANDROID = Platform.OS === 'android'
import metrics from '../../config/metrics';
const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.05
const header_height = metrics.DEVICE_HEIGHT * 0.1

class UserChatlist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allUserData : [],
            isLoading : true,
        }
    }
    componentDidMount = async () => {
        // console.log("enableLogs", OT.enableLogs(true))
        await this.sortAndFilterUsers()
    }
    sortAndFilterUsers = async () => {
        ApiRequest.sortAndFilterUsers(this.props.token, (resolve) => {
            var alluserData = resolve.data.data;
            // console.log("sortAndFilterUsers", alluserData);
            var new_array = [];
            if(resolve.data.data){
                for(var i=0; i< alluserData.length; i++ ){
                    var userObject={};
                    userObject._id = alluserData[i]._id ? alluserData[i]._id : '';
                    userObject.fullName = alluserData[i].fullName ? alluserData[i].fullName : '';
                    userObject.uri = alluserData[i].profilePic ? alluserData[i].profilePic : '';
                    userObject.isOnline = alluserData[i].isOnline ? alluserData[i].isOnline : false;
                    userObject.lastSeen = alluserData[i].lastSeen ? alluserData[i].lastSeen : undefined;
                    new_array.push(userObject);
                }
                this.setState({
                    allUserData: new_array,
                    isLoading : false
                })
            }
        }, (reject) => {
            console.log("sortAndFilterUsers_reject", reject)
        })

    }
    render() {
        if(this.state.isLoading){
            return <Loading/>
        }
        const { navigate } = this.props.navigation;
        // const opentokToken = this.props.data.opentokToken 
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
                            isSearcrchbar={true}
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
                                    <Text style={{ fontFamily: "Avenir-Heavy", fontSize: 24, color: "#fff" }}>{i18n.t('message_label')}</Text>
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
                                    }} />
                            }
                        />
                    </SafeAreaView>
                </LinearGradient>
                {/* <SearchBar /> */}
                <ScrollView contentContainerStyle={{ paddingVertical: 16, }} showsVerticalScrollIndicator={false}>
                    <View style={{ justifyContent: "center", borderBottomWidth: 10, borderBottomColor: "#F5F5F5" }}>
                        <View style={styles.elevationView}>
                            <Text style={{ fontFamily: "Avenir-Medium", fontSize: 15, color: "#C1C0C9", lineHeight: 40, paddingLeft: 16 }}>ALL MATCHES</Text>
                            <View style={{}}>
                                <OnlineUsers navigation={this.props.navigation} userdataList={this.state.allUserData} 
                                // opentokToken={opentokToken}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={styles.elevationView}>
                        <Userlist navigation={this.props.navigation} userdataList={this.state.allUserData} 
                        // opentokToken={opentokToken} 
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
        backgroundColor: 'rgba(255,255,255, 100)',
    },
    bottomModal: {
        justifyContent: "flex-end",
        margin: 0
    },
    elevationView: {
        backgroundColor: "#fff",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    }
});
mapStateToProps = (state) => {
    return {
        language: state.language.defaultlanguage,
        data: state.auth.data,
        token: state.auth.token
    }
}
export default connect(mapStateToProps)(UserChatlist);