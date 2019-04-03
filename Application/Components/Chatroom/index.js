import React, { Component } from 'react';
import { connect } from 'react-redux'
import {
    View,
    Button,
    SafeAreaView,
    TextInput,
    StyleSheet,
    Animated,
    FlatList,
    Text,
    Image,
    Dimensions,
    Keyboard,
    TouchableOpacity,
    Platform,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    AsyncStorage,
    DeviceEventEmitter,
    Alert
} from 'react-native';
import moment from "moment";
import { OTSession } from 'opentok-react-native';
import LinearGradient from 'react-native-linear-gradient';
import PopupMenu from '../Userprofile/options';
import CustomTextInput from '../CustomTextInput'
import ApiRequest from '../Common/Apirequest';
import ChatHeader from './ChatHeader';
import KeyboardSpacer from './KeyboardSpacer'
import * as global from '../../../global.json'
import moreoptions from '../../images/icons/vertical-dot.png';
import metrics from '../../config/metrics'
import BaseFormComponent from "../Common/BaseFormComponent";
let IS_ANDROID = Platform.OS === 'android';

var { width, height } = Dimensions.get('window')

class Chatroom extends BaseFormComponent {
    constructor(props) {
        super(props);
        // this.apiKey = '46244942',
        this.state = {
            data: {},
            loading: true,
            signal: {
                data: '',
                type: '',
            },
            sessionId: '',
            token: '',
            text: '',
            messages: [],
            savetoLocalStore:{},
            keyboardHeightAnim: new Animated.Value(0)
        };
        this.sessionEventHandlers = {
            error: event => {
                this.showSimpleMessage("info", { backgroundColor: global.gradientsecondry }, JSON.stringify(event), '')

                console.log("sessionEventHandlers_error", event)
            },
            signal: (event) => {
                console.log("sessionEventHandlers ========>", event)
                if (event.data) {
                    const myConnectionId = this.session.getSessionInfo().connection.connectionId;
                    const oldMessages = this.state.messages;
                    const messages = event.connectionId === myConnectionId ? [...oldMessages,
                    {
                        data: {
                            msg: event.data,
                            time: new Date(),
                            // connectionId : event.connectionId,
                            currentUser: true
                        }
                    }
                    ] : [...oldMessages,
                    {
                        data: {
                            msg: event.data,
                            time: new Date(),
                            // connectionId : event.connectionId,
                            currentUser: false
                        }
                    }
                        ];
                    this.saveMessages(messages)
                    this.getMessages()
                    // this.setState({
                    //     messages,
                    // });
                }
            },
        };
    }
    // componentWillMount() {
    // this._registerEvents();
    // }
    _registerEvents() {
        // this._keyboardDidShowSubscription = DeviceEventEmitter.addListener("keyboardDidShow", e => this._keyboardDidShow(e));
        // this._keyboardDidHideSubscription = DeviceEventEmitter.addListener("keyboardDidHide", e => this._keyboardDidHide(e));
        this._keyboardDidShowSubscription = Keyboard.addListener('keyboardDidShow', e => this._keyboardDidShow(e));
        this._keyboardDidHideSubscription = Keyboard.addListener('keyboardDidHide', e => this._keyboardDidHide(e));
    }
    _unRegisterEvents() {
        this._keyboardDidShowSubscription.remove();
        this._keyboardDidHideSubscription.remove();
    }
    _keyboardDidShow(e) {
        console.log("_keyboardDidShow", e)
        Animated.spring(this.state.keyboardHeightAnim, { toValue: e.endCoordinates.height }).start();
    }
    _keyboardDidHide() {
        console.log("_keyboardDidHide")
        Animated.spring(this.state.keyboardHeightAnim, { toValue: 0 }).start();
    }
    saveMessages = async (messages) => {
        const { state } = this.props.navigation;
        let userid = state.params.userId;
        var fullName = state.params.fullName;
        var imageUrl = state.params.image ? state.params.image : '';

        var msg_aar = [{
            userId: userid,
            username: fullName,
            image: imageUrl,
            isUserFirstchat: this.state.data.isFirst,
            data: messages
        }]
        // console.log("saveMessages_msg_aar", msg_aar)
        try {
            await AsyncStorage.setItem("chatmessages", JSON.stringify(msg_aar))
        } catch (error) {
            console.log("error", error)
        }
    }
    getMessages = async () => {
        const { state } = this.props.navigation;
        let userid = state.params.userId;

        try {
            const value = await AsyncStorage.getItem('chatmessages');
            if (value !== null) {
                var chatmessages = JSON.parse(value);

                for (var i = 0; i < chatmessages.length; i++) {
                    if (chatmessages[i].userId === userid) {
                        console.log("chatmessages_value", chatmessages[i])

                        this.setState({
                            messages: chatmessages[i] && chatmessages[i].data ? chatmessages[i].data : [],
                            savetoLocalStore : chatmessages[i]
                        })
                    }
                }
            }
        } catch (error) {
            console.log("error", error)
        }
    }
    componentWillUnmount() {
        // this._unRegisterEvents();
        this.setState({
            sessionId: '',
            token: '',
        })
    }
    componentDidMount() {
        const { state } = this.props.navigation;
        let userid = state.params.userId;
        state.params.updateIsFirstStatus ? state.params.updateIsFirstStatus(userid) : undefined
        ApiRequest.getChatSessionId(this.props.token, userid, (resolve) => {
            console.log("componentDidMount_navigation", resolve)
            if (resolve && resolve.message) {
                this.showSimpleMessage("info", { backgroundColor: global.gradientsecondry }, "", resolve.message ? resolve.message : '')
            }
            if (resolve.data) {
                this.setState({
                    data: resolve.data ? resolve.data : {},
                    sessionId: resolve.data && resolve.data.session ? resolve.data.session : '',
                    token: resolve.data && resolve.data.token ? resolve.data.token : '',
                    loading: false
                })
            }
        }, (reject) => {
            this.setState({
                data: {},
                sessionId: '',
                token: '',
                loading: false
            })
            console.log("getChatSessionId_reject", reject)
        })
        this.getMessages()
    }
    sendSignal() {
        console.log("sessionId", this.state.sessionId)
        console.log("text_sendSignal=====>", this.state.text)
        if (this.state.text) {
            this.setState({
                signal: {
                    type: '',
                    data: this.state.text,
                },
                text: '',
            });
        }
    }
    _keyExtractor = (item, index) => index;
    _renderItem = ({ item }) => (
        item && !item.data.currentUser ?
            <View style={{ marginVertical: 3, borderRadius: 5, flexDirection: "row" }}>
                <View style={{ borderRadius: 10, overflow: "hidden", backgroundColor: "#F5F5F5" }}>
                    {/* <LinearGradient
            colors={['#DB3D88', '#273174']}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
            > */}
                    <Text style={[styles.item, { backgroundColor: "#F5F5F5" }]}>{item.data.msg}</Text>
                    {/* </LinearGradient> */}
                </View>
            </View>

            // <View style={{ backgroundColor: "#000", overflow: "hidden", marginVertical: 3, borderRadius: 10, flexDirection: "row" }}>
            //     <Text style={[styles.item, { backgroundColor: "#F5F5F5" }]}>{item.data.msg}</Text>
            // </View>
            :
            <View style={{ marginVertical: 3, borderRadius: 5, flexDirection: "row-reverse" }}>
                <LinearGradient
                    colors={['#DB3D88', '#273174']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 1 }}
                    style={{ borderRadius: 10, overflow: "hidden" }}>
                    <Text style={[styles.item, { color: "#F5F5F5", backgroundColor: "transparent" }]}>{item.data.msg}</Text>
                </LinearGradient>
            </View>
    );
    clearChatHistory() {
        this.state.messages = []
        console.log("messages", this.state.messages)
        this.saveMessages(this.state.messages)
        this.getMessages()
    }
    deletePost = () => {
        Alert.alert(
            'Clear Chat Hostory',
            'Wolud you like to clear Chat history All messages will remove ',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => this.clearChatHistory() },
            ],
            { cancelable: false },
        );
    }
    cancel() { }
    _scrollEnd = (evt) => {
        // this.refs.flatList1.scrollToEnd({ animated: true });
    }
    askVideoCallPermission() {
        const { goBack, navigate, state } = this.props.navigation;
        let userid = state.params.userId;
        var token = this.props.token;
        var data = {
            "permissionReceiverId": userid
        };
        if (this.state.data && this.state.data.isVideoPermission) {
            navigate('livecall', { sessionId: this.state.sessionId, token: this.state.token, profileUserId: state.params.userId })
        } else {
            ApiRequest.askVideoCallPermission(token, data, (resolve) => {
                this.showSimpleMessage("", { backgroundColor: global.gradientsecondry }, '', resolve.message)
                console.log("askVideoCallPermission_resolve", resolve)
                // navigate('livecall', { sessionId: this.state.sessionId, token: this.state.token, profileUserId: state.params.userId })
            }, reject => {
                console.log("askVideoCallPermission_reject", reject)
            })

        }
    }
    render() {
        const { goBack, navigate, state } = this.props.navigation;
        var fullName = state.params.fullName ? state.params.fullName : '';
        var imageUrl = state.params.image ? state.params.image : '';

        if (this.state.loading) {
            return <></>
        }
        console.log("sessionId", this.state.sessionId)
        console.log("token", this.state.token)
        return (
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
                <SafeAreaView />
                <ChatHeader
                    left={
                        <TouchableOpacity
                            onPress={() => goBack()}
                            style={{
                                width: "15%",
                                backgroundColor: "transparent",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                            <Image
                                source={require('../../images/icons/backbutton_gradient.png')}
                                style={{ width: 28, height: 18, left: 5 }}
                                resizeMethod="resize"
                                resizeMode="contain" />
                        </TouchableOpacity>
                    }
                    middle={
                        <View style={{ width: "59%", backgroundColor: "transparent", flexDirection: "row", alignItems: "center" }}>
                            <View style={{ width: 34, height: 34, marginRight: 15, borderRadius: 17, overflow: "hidden" }}>
                                <Image
                                    source={{ uri: imageUrl }}
                                    // source={require('../../images/Photo_7.png')}
                                    style={{ width: '100%', height: "100%", }}
                                    resizeMethod="resize"
                                // resizeMode="contain"
                                />
                            </View>

                            <Text style={{ fontFamily: "Avenir-Heavy", fontSize: 17, color: "#3E3E47" }}>{fullName}</Text>
                        </View>
                    }
                    right={
                        <View
                            style={{
                                width: "26%",
                                flexDirection: "row"
                            }}>
                            <TouchableOpacity
                                style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                                onPress={() => this.askVideoCallPermission()}
                            // onPress={() => navigate('livecall', { sessionId: this.state.sessionId, token: this.state.token })}
                            >
                                <Image
                                    source={require('../../images/icons/video-camera.png')}
                                    style={{ width: 28, height: 18, left: 5 }}
                                    resizeMethod="resize"
                                    resizeMode="contain" />
                            </TouchableOpacity>
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                <PopupMenu
                                    button={moreoptions}
                                    buttonStyle={styles.popupmenu}
                                    destructiveIndex={1}
                                    options={["Clear history", "Cancel"]}
                                    actions={[this.deletePost, this.cancel]}
                                />
                            </View>
                        </View>
                    }
                />

                <OTSession
                    apiKey={global.API_KEY}
                    sessionId={this.state.sessionId}
                    token={this.state.token}
                    signal={this.state.signal}
                    eventHandlers={this.sessionEventHandlers}
                    ref={(instance) => { this.session = instance }}
                />
                <FlatList
                    ref="flatList1"
                    style={{
                        width: '100%',
                        paddingHorizontal: 8,
                        // marginBottom: 80 
                    }}
                    data={this.state.messages}
                    renderItem={this._renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    onContentSizeChange={() => this.refs.flatList1.scrollToEnd()}
                />
                {
                    IS_ANDROID ? undefined : <View style={{ height: 80 }} />
                }
                {
                    IS_ANDROID ? undefined : <KeyboardSpacer />

                }
                {
                    Platform.OS === 'ios' ?
                        <KeyboardAvoidingView style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }} behavior="position">
                            <View style={{ flexDirection: "row", borderTopWidth: 1, backgroundColor: "transparent", borderColor: "#F5F5F5", paddingVertical: 8, justifyContent: "center", alignItems: "center" }}>
                                {/* <> */}
                                <CustomTextInput
                                    placeholder={"Type a message"}
                                    style={styles.input}
                                    onChangeText={(text) => { this.setState({ text }); }}
                                    value={this.state.text}
                                    returnKeyType={'done'}
                                    onFocus={() => this._registerEvents()}
                                    onSubmitEditing={() => this.sendSignal()}
                                />
                                <TouchableOpacity onPress={() => { this.sendSignal() }} style={{ marginTop: 8, width: '15%', height: 42, justifyContent: "center", alignItems: "center", marginLeft: 5 }}>
                                    <Image
                                        source={require('../../images/icons/send.png')}
                                        style={{ width: 28, height: 18, left: 5 }}
                                        resizeMethod="resize"
                                        resizeMode="contain" />
                                    {/* <Text style={{ color: "#FFF" }}>Send</Text> */}
                                </TouchableOpacity>
                                {/* </> */}
                            </View>
                        </KeyboardAvoidingView>
                        :
                        <KeyboardAvoidingView keyboardVerticalOffset={-100} behavior="position" enabled={false}>
                            <View style={{ alignSelf: "flex-end", backgroundColor: "#FFF", flexDirection: "row", width: width, paddingHorizontal: 8, justifyContent: "center", borderTopWidth: 1, borderColor: "#F5F5F5", paddingVertical: 8 }}>
                                <>
                                    <TextInput
                                        placeholder={"Type a message"}
                                        style={{ height: 44, borderColor: '#F5F5F5', borderWidth: 1, borderRadius: 5, width: '85%' }}
                                        onChangeText={(text) => { this.setState({ text }); }}
                                        value={this.state.text}
                                        onFocus={() => this._registerEvents()}
                                        // returnKeyType={'done'}
                                        onSubmitEditing={() => this.sendSignal()}
                                    />
                                </>
                                <TouchableOpacity onPress={() => { this.sendSignal() }} style={{ backgroundColor: "transparent", width: '15%', height: 44, justifyContent: "center", alignItems: "center", marginLeft: 5 }}>
                                    <Image
                                        source={require('../../images/icons/send.png')}
                                        style={{ width: 28, height: 18, left: 5 }}
                                        resizeMethod="resize"
                                        resizeMode="contain" />
                                    {/* <Text style={{ color: "#FFF" }}>Send</Text> */}
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    item: {
        padding: 10,
        fontSize: 18,
        flex: 1,
        // height: 44,
    },
    mainText: {
        fontSize: 20,
        marginTop: 30,
        marginBottom: 10,
    },
    popupmenu: {
        width: 20,
        height: 20,
        margin: 7.5,
        resizeMode: "contain"
    },
    input: {
        backgroundColor: "#F5F5F5",
        // marginTop: 8,
        borderRadius: 5,
        margin: IS_ANDROID ? -1 : 0,
        height: 42,
        // paddingVertical: 7,
        paddingHorizontal: IS_ANDROID ? 5 : 5,
        fontSize: 17,
        fontFamily: "Avenir-Medium",
        width: metrics.DEVICE_WIDTH * 0.80,
        color: "#909096"
    }
})

mapStateToProps = (state) => {
    return {
        language: state.language.defaultlanguage,
        data: state.auth.data,
        token: state.auth.token
    }
}
export default connect(mapStateToProps)(Chatroom);