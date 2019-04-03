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
    Alert,
    TouchableOpacity,
    AsyncStorage
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import Loader from '../Loading/Loader';
import LinearGradient from 'react-native-linear-gradient';
import I18n from 'react-native-i18n';
import Header from '../Common/Header';
import io from 'socket.io-client'; // 2.0.4

import SearchBar from './SearchBar';
import ApiRequest from '../Common/Apirequest';
import { Userlist, OnlineUsers } from './userlist';
const IS_ANDROID = Platform.OS === 'android';
import metrics from '../../config/metrics';
const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.05
const header_height = metrics.DEVICE_HEIGHT * 0.1
import { baseurl as URL } from '../../../app.json';

class UserChatlist extends Component {
    constructor(props) {
        super(props);
        this.socket = io(URL);
        // this.socket.on("userConnected", data => {
        //     console.log("userConnected_socket", data)
        // })
        // this.socket.on("userDisconnected", data => {
        //     console.log("userDisconnected_socket", data)
        // })
        this.state = {
            allUserData: [],
            recentUserList: [],
            isLoading: true,
        }
    }
    getallsavedUser = async () => {
        const { navigate } = this.props.navigation;

        try {
            const value = await AsyncStorage.getItem('chatmessages');
            var userlist = []
            if (value !== null) {
                var chatmessages = JSON.parse(value);
                // console.log("AsyncStorage_value========>", chatmessages)
                for (var user = 0; user < chatmessages.length; user++) {
                    result = _.filter(chatmessages[user].data, function (item) { return item.data.currentUser === false });
                    // if (chatmessages[user].isUserFirstchat) {
                    userlist.push({ _id: chatmessages[user].userId, fullName: chatmessages[user].username, uri: chatmessages[user].image })

                    if (chatmessages[user].isUserFirstchat && result.length > 1) {
                        navigate("chatfeedback", { checkemitRequest: this.checkemitRequest.bind(this), data: { receiverId: chatmessages[user].userId }, token: this.props.token, invitationname: chatmessages[user].username, eventNamepoint: 'chatfeedback' })
                    }
                }
                this.setState({
                    recentUserList: userlist
                })
            }
        } catch (error) {
            console.log("error", error)
        }
    }
    // checkemitRequest = async () => {
    checkemitRequest = async (receiversId) => {
        // var receiversId = { profileUserId: "5c3441f89f9745033fd181a8" }
        try {
            const value = await AsyncStorage.getItem('chatmessages');
            if (value !== null) {
                var chatmessages = JSON.parse(value);
                var replacement = { isUserFirstchat: true };

                for (var user = 0; user < chatmessages.length; user++) {
                    if (chatmessages[user].userId === receiversId.profileUserId) {
                        replacement.data = chatmessages[user].data;
                        replacement.image = chatmessages[user].image;
                        replacement.isUserFirstchat = false;
                        replacement.userId = chatmessages[user].userId;
                        replacement.username = chatmessages[user].username;
                    }
                }
                _.replace = (collection, identity, replacement) => { var index = _.indexOf(collection, _.find(collection, identity)); collection.splice(index, 1, replacement) };
                _.replace(chatmessages, { userId: receiversId.profileUserId }, replacement);
                // console.log("normalisedUsers", chatmessages); 
                try {
                    await await AsyncStorage.setItem('chatmessages', JSON.stringify(chatmessages), (resolve) => {
                        console.log("AsyncStorageresolve", resolve)
                        this.getallsavedUser()
                    })
                } catch (error) {
                    console.log("checkemitRequest_array", error)
                }
            }
        } catch (error) {
            console.log("error", error)
        }
    }
    componentDidMount = async () => {
        await this.sortAndFilterUsers()
        this.getallsavedUser()
    }
    sortAndFilterUsers = async () => {
        ApiRequest.sortAndFilterUsers(this.props.token, (resolve) => {
            var alluserData = resolve.data.data;
            console.log("sortAndFilterUsers", alluserData);
            var new_array = [];
            if (resolve.data.data) {
                for (var i = 0; i < alluserData.length; i++) {
                    var userObject = {};
                    userObject._id = alluserData[i]._id ? alluserData[i]._id : '';
                    userObject.fullName = alluserData[i].fullName ? alluserData[i].fullName : '';
                    userObject.uri = alluserData[i].profilePic ? alluserData[i].profilePic : '';
                    userObject.isOnline = false; //alluserData[i].isOnline ? alluserData[i].isOnline : false;
                    userObject.lastSeen = alluserData[i].lastSeen ? alluserData[i].lastSeen : undefined;
                    new_array.push(userObject);
                }
                this.setState({
                    allUserData: new_array,
                    isLoading: false
                })
            }
        }, (reject) => {
            this.setState({
                allUserData: [],
                isLoading: false
            })
            console.log("sortAndFilterUsers_reject", reject)
        })
    }
    notValidFriend(userDetail) {
        const { navigate } = this.props.navigation;

        Alert.alert(
            I18n.t('appname'),
            I18n.t('notmatchlist'),
            [
                //   {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'OK', onPress: () => navigate("userprofile", { userId: userDetail._id }) },
            ],
            { cancelable: false },
        );
    }
    isUserFriend(userDetail) {
        const { navigate } = this.props.navigation;
        // console.log("userDetail===========>", userDetail)
        var data = {
            "profileUserId": userDetail._id

        }
        ApiRequest.isUserFriend(this.props.token, data, (resolve) => {
            if (resolve && resolve.data && !resolve.data.isFriend) {
                this.notValidFriend(userDetail)
                return
            }
            navigate('chatscreen', {
                userId: userDetail._id,
                fullName: userDetail.fullName,
                image: userDetail.uri
            })
        }, reject => {
            console.log("isUserFriend_reject", reject)

        })
    }

    render() {
        // if(this.state.isLoading){
        //     return <Loading/>
        // }
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
                                    <Text style={{ fontFamily: "Avenir-Heavy", fontSize: 24, color: "#fff" }}>{I18n.t('message_label')}</Text>
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
                                {
                                    this.state.isLoading ? <Loader /> :
                                        <OnlineUsers
                                            navigation={this.props.navigation}
                                            userdataList={this.state.allUserData}
                                            isUserFriend={this.isUserFriend.bind(this)} />
                                }
                            </View>
                        </View>
                    </View>
                    <View style={styles.elevationView}>
                        <Userlist 
                        navigation={this.props.navigation} 
                        userdataList={this.state.recentUserList} 
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