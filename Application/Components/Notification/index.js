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
    TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient';
import i18n from 'react-native-i18n'
import Header from '../Common/Header'
import NotificationsList from './NotificationsList';
// import Loading from '../Loading/index'
import Apirequest from '../Common/Apirequest'
const IS_ANDROID = Platform.OS === 'android';
import metrics from '../../config/metrics';
const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.05;
const header_height = metrics.DEVICE_HEIGHT * 0.1;

class Notification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visibleModal: false,
            scrollOffset: '',
            notificationData: [],
            isloading: true
        }
    }
    componentDidMount() {
        let data = [];
        var token = this.props.token;
        Apirequest.getNotifications(token, resolve => {
            if (resolve.data) {
                // console.log("resolve", resolve.data.data)
                var datasource = resolve.data.data;
                for (var i = 0; i < datasource.length; i++) {
                    let dataobject = {};
                    dataobject._id = datasource[i] && datasource[i]._id ? datasource[i]._id : '';
                    dataobject.updatedAt = datasource[i] && datasource[i].updatedAt ? datasource[i].updatedAt : '';
                    dataobject.createdAt = datasource[i] && datasource[i].createdAt ? datasource[i].createdAt : '';
                    dataobject.senderId = datasource[i] && datasource[i].senderId && datasource[i].senderId._id ? datasource[i].senderId._id : '';
                    dataobject.uri = datasource[i] && datasource[i].senderId && datasource[i].senderId.profilePic ? datasource[i].senderId.profilePic : null;
                    dataobject.receiverId = datasource[i] && datasource[i].receiverId ? datasource[i].receiverId : '';
                    dataobject.notificationText = datasource[i] && datasource[i].notificationText ? datasource[i].notificationText : '';
                    dataobject.type = datasource[i] && datasource[i].type ? datasource[i].type : '';
                    dataobject.isSeen = datasource[i] && datasource[i].isSeen ? datasource[i].isSeen : false;
                    // console.log("getNotifications", dataobject)
                    data.push(dataobject)
                }
                console.log("getNotifications", data)
                this.setState({
                    notificationData: data,
                    isloading: false
                })
            }
        }, reject => {
            console.log("reject", reject)

        })
    }
    handleScrollTo = p => {
        if (this.scrollViewRef) {
            this.scrollViewRef.scrollTo(p);
        }
    };
    handleOnScroll = event => {
        console.log("event.nativeEvent.contentOffset.y");
        this.setState({
            scrollOffset: event.nativeEvent.contentOffset.y
        });
    };

    render() {
        const { notificationData, isloading } = this.state;
        const { navigate } = this.props.navigation;
        // if(isloading){
        //     return <Loading/>
        // }
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
                                    <Text style={{ fontFamily: "Avenir-Heavy", fontSize: 24, color: "#fff" }}> Notifications</Text>
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
                                </TouchableOpacity>
                            }
                        />
                    </SafeAreaView>
                </LinearGradient>
                <NotificationsList notificationData={notificationData} isloading={isloading} token={this.props.token} navigate={ navigate }/>
                <SafeAreaView />
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
        language: state.language.defaultlanguage,
        data: state.auth.data,
        token: state.auth.token
    }
}
export default connect(mapStateToProps)(Notification);