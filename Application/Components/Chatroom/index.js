import React, { Component } from 'react';
import { connect } from 'react-redux'
import { View, Button, TextInput, StyleSheet, FlatList, Text, Image, Dimensions, Keyboard, TouchableOpacity, Platform, TouchableWithoutFeedback, KeyboardAvoidingView, AsyncStorage } from 'react-native';
import { OTSession } from 'opentok-react-native';
import LinearGradient from 'react-native-linear-gradient';
import PopupMenu from '../Userprofile/options';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CustomTextInput from '../CustomTextInput'
import ApiRequest from '../Common/Apirequest';
import ChatHeader from './ChatHeader';
import * as global from '../../../global.json'
import moreoptions from '../../images/icons/vertical-dot.png';
import metrics from '../../config/metrics'
let IS_ANDROID = Platform.OS === 'android'

// import { reject } from 'rsvp';
// import console = require('console');
var { width, height } = Dimensions.get('window')
const formStyle = { marginTop: 40 };
class Chatroom extends Component {
    constructor(props) {
        super(props);
        this.apiKey = '46244942',
            this.state = {
                loading: true,
                signal: {
                    data: '',
                    type: '',
                },
                sessionId: '',
                token: '',
                text: '',
                messages: [],
            };
        this.sessionEventHandlers = {
            error: event => {
                console.log("error", event)
            },
            signal: (event) => {
                console.log("sessionEventHandlers ========>", event)
                // var currentdate = new Date();
                // var datetime = currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
                if (event.data) {
                    const myConnectionId = this.session.getSessionInfo().connection.connectionId;
                    const oldMessages = this.state.messages;
                    const messages = event.connectionId === myConnectionId ? [...oldMessages,
                    {
                        data: {
                            msg: event.data,
                            // connectionId : event.connectionId,
                            currentUser: true
                        }
                    }
                    ] : [...oldMessages,
                    {
                        data: {
                            msg: event.data,
                            // connectionId : event.connectionId,
                            currentUser: false
                        }
                    }
                        ];
                    // const messages = event.connectionId === myConnectionId ? [...oldMessages, {
                    //     data: {
                    //         msg: event.data,
                    //         connectionId : event.connectionId,
                    //         currentUser: true
                    //     }
                    // }] : [...oldMessages, { data: { 
                    //     msg: event.data,  
                    //     connectionId : myConnectionId,
                    //     currentUser: false
                    // } }];
                    this.saveMessages(messages)
                    this.getMessages()
                    // this.setState({
                    //     messages,
                    // });
                }
            },
        };
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._scrollEnd);
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidHide', this._scrollEnd);
    }
    saveMessages = async (messages) => {
        const { state } = this.props.navigation;
        let userid = state.params.userId;
        try {
            await AsyncStorage.setItem("chatmessages", JSON.stringify([{ userId: userid, data: messages }]))
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
                        this.setState({ messages: chatmessages[i] && chatmessages[i].data ? chatmessages[i].data : [] })
                        // console.log("chatmessages", chatmessages[i].data);
                    }
                }
            }
        } catch (error) {
            console.log("error", error)
        }
    }
    componentWillUnmount() {
        this.setState({
            sessionId: '',
            token: '',
        })
    }
    componentDidMount() {
        const { state } = this.props.navigation;
        let userid = state.params.userId;
        ApiRequest.getChatSessionId(this.props.token, userid, (resolve) => {
            console.log("componentDidMount_navigation", resolve)
            this.setState({
                sessionId: resolve.data && resolve.data.session ? resolve.data.session : '',
                token: resolve.data && resolve.data.token ? resolve.data.token : '',
                loading: false
            })
        }, (reject) => {
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
        item && item.data.currentUser ?
            <View style={{ backgroundColor: "#000", overflow: "hidden", marginVertical: 3, borderRadius: 10, flexDirection: "row" }}>
                <Text style={[styles.item, { backgroundColor: "#F5F5F5" }]}>{item.data.msg}</Text>
            </View>
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
    deletePost = () => {
        this.state.messages = []
        console.log("messages", this.state.messages)
        this.saveMessages(this.state.messages)
        this.getMessages()
    }
    _scrollEnd = (evt) => {
        this.refs.flatList1.scrollToEnd({ animated: true });
    }
    render() {
        const { goBack, navigate, state } = this.props.navigation;
        var fullName = state.params.fullName ? state.params.fullName : '';
        if (this.state.loading) {
            return <></>
        }
        console.log("this.state.messages", this.state.messages)
        return (
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
                {/* <View style={{ height: "90%" }}> */}
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
                            <Image
                                source={require('../../images/Photo_7.png')}
                                style={{ width: 34, height: 34, marginRight: 15 }}
                                resizeMethod="resize"
                                resizeMode="contain" />
                            <Text style={{ fontFamily: "Avenir-Heavy", fontSize: 17, color: "#3E3E47" }}>{fullName}</Text>
                        </View>
                    }
                    right={
                        <View
                            style={{
                                width: "26%",
                                // backgroundColor: "#009933",
                                // justifyContent: "center",
                                // alignItems: "center",
                                flexDirection: "row"
                            }}>
                            <TouchableOpacity
                                style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                                onPress={() => navigate('livecall', { sessionId: this.state.sessionId, token: this.state.token })}>
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
                                    options={["Delete Post", "Cancel"]}
                                    actions={[this.deletePost, this.cancel]}
                                />
                            </View>
                            {/* <TouchableOpacity
                                    style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                                    onPress={() => console.log()}>
                                    <Image
                                        source={require('../../images/icons/vertical-dot.png')}
                                        style={{ width: 28, height: 18, left: 5 }}
                                        resizeMethod="resize"
                                        resizeMode="contain" />
                                </TouchableOpacity> */}
                        </View>
                    }
                />

                <OTSession
                    apiKey={global.API_KEY}
                    sessionId={this.state.sessionId}
                    token={this.state.token}
                    signal={this.state.signal}
                    eventHandlers={this.sessionEventHandlers}
                    ref={(instance) => {
                        this.session = instance;
                    }}
                />
                <FlatList
                    ref="flatList1"
                    style={{ width: '100%', paddingHorizontal: 8, marginBottom: 80 }}
                    // inverted
                    data={this.state.messages}
                    renderItem={this._renderItem}
                    keyExtractor={(item, index) => index.toString()}
                // onLayout={() => this.flatList1.scrollToEnd({animated: true})}

                />
                {/* </View> */}
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