import React from 'react';
import {
    Platform,
    StyleSheet,
    SafeAreaView,
    Text,
    View,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Button, TextInput, FlatList
} from 'react-native';
import { OTSession } from 'opentok-react-native';
import ChatHeader from './ChatHeader'
import { GiftedChat, Actions, Bubble, SystemMessage } from 'react-native-gifted-chat';
import CustomActions from './CustomActions';
import CustomView from './CustomView';
export default class ChatScreen extends React.Component {
    render() {
        const { goBack, navigate } = this.props.navigation;
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
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
                        <View style={{ width: "65%", backgroundColor: "transparent", flexDirection: "row", alignItems: "center" }}>
                            <Image
                                source={require('../../images/Photo_7.png')}
                                style={{ width: 34, height: 34, marginRight: 15 }}
                                resizeMethod="resize"
                                resizeMode="contain" />
                            <Text style={{ fontFamily: "Avenir-Heavy", fontSize: 17, color: "#3E3E47" }}>Laura Gilbert</Text>
                        </View>
                    }
                    right={
                        <View
                            style={{
                                width: "20%",
                                backgroundColor: "transparent",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "row"
                            }}>
                            <TouchableWithoutFeedback onPress={() => navigate('livecall')}>
                                <Image
                                    source={require('../../images/icons/video-camera.png')}
                                    style={{ width: 28, height: 18, left: 5 }}
                                    resizeMethod="resize"
                                    resizeMode="contain" />
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => console.log()}>
                                <Image
                                    source={require('../../images/icons/vertical-dot.png')}
                                    style={{ width: 28, height: 18, left: 5 }}
                                    resizeMethod="resize"
                                    resizeMode="contain" />
                            </TouchableWithoutFeedback>
                        </View>
                    }
                />
                <ChatBox />
            </SafeAreaView>
        )
    }
}

let data = [
    {
        _id: Math.round(Math.random() * 1000000),
        text: 'Yes, and I use Gifted Chat!',
        createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
        user: {
            _id: 1,
            name: 'Developer',
        },
        sent: true,
        received: true,
        // location: {
        //   latitude: 48.864601,
        //   longitude: 2.398704
        // },
    },
    {
        _id: Math.round(Math.random() * 1000000),
        text: 'Are you building a chat app?',
        createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
        user: {
            _id: 2,
            name: 'React Native',
        },
    },
    // {
    //     _id: Math.round(Math.random() * 1000000),
    //     text: "You are officially rocking GiftedChat.",
    //     createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
    //     system: true,
    // },
];

class ChatBox extends React.Component {
    constructor(props) {
        super(props);
        this.apiKey = '46244942';
        this.sessionId = '2_MX40NjI0NDk0Mn5-MTU0NjUwMDUxNzYyMH52Q2RIYm96M2hTK0NwczU3bXhKNFc5dkd-QX4';
        this.token = 'T1==cGFydG5lcl9pZD00NjI0NDk0MiZzaWc9MDBmNzU5OTE1Y2ExMTM0Mzg3YTYzNTQ3ZDA2NDYxZmYzYTRiYzExYTpzZXNzaW9uX2lkPTJfTVg0ME5qSTBORGswTW41LU1UVTBOalV3TURVeE56WXlNSDUyUTJSSVltOTZNMmhUSzBOd2N6VTNiWGhLTkZjNWRrZC1RWDQmY3JlYXRlX3RpbWU9MTU0NjUwMDUxOCZub25jZT0wLjE0NDAzNDc5ODE5ODI3MjE0JnJvbGU9cHVibGlzaGVyJmV4cGlyZV90aW1lPTE1NDY1ODY5MTgmaW5pdGlhbF9sYXlvdXRfY2xhc3NfbGlzdD0=';
        this.state = {
            signal: {
                data: '',
                type: '',
            },
            text: '',
            messages: [],
            loadEarlier: true,
            typingText: null,
            isLoadingEarlier: false,
        };
        this._isMounted = false;
        this.onSend = this.onSend.bind(this);
        this.onReceive = this.onReceive.bind(this);
        this.renderCustomActions = this.renderCustomActions.bind(this);
        this.renderBubble = this.renderBubble.bind(this);
        this.renderSystemMessage = this.renderSystemMessage.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.onLoadEarlier = this.onLoadEarlier.bind(this);
        this._isAlright = null;
        this.sessionEventHandlers = {
            signal: (event) => {
                if (event.data) {
                    const myConnectionId = this.session.getSessionInfo().connection.connectionId;
                    const oldMessages = this.state.messages;
                    const messages = event.connectionId === myConnectionId ? [...oldMessages, { data: `abhishek: ${event.data}` }] : [...oldMessages, { data: `Other: ${event.data}` }];
                    this.setState({
                        messages,
                    });
                }
            },
        };
    }
    sendSignal() {
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
        <Text style={styles.item}>{item.data}</Text>
    );

    componentWillMount() {
        this._isMounted = true;
        this.setState({
            messages: data
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    onLoadEarlier() {
        this.setState((previousState) => {
            return {
                isLoadingEarlier: true,
            };
        });

        setTimeout(() => {
            if (this._isMounted === true) {
                this.setState((previousState) => {
                    return {
                        messages: GiftedChat.prepend(previousState.messages, data),
                        loadEarlier: false,
                        isLoadingEarlier: false,
                    };
                });
            }
        }, 1000); // simulating network
    }

    onSend(messages = []) {
        this.setState((previousState) => {
            return {
                messages: GiftedChat.append(previousState.messages, messages),
            };
        });

        // for demo purpose
        this.answerDemo(messages);
    }

    answerDemo(messages) {
        if (messages.length > 0) {
            if ((messages[0].image || messages[0].location) || !this._isAlright) {
                this.setState((previousState) => {
                    return {
                        typingText: 'React Native is typing'
                    };
                });
            }
        }

        setTimeout(() => {
            if (this._isMounted === true) {
                if (messages.length > 0) {
                    if (messages[0].image) {
                        this.onReceive('Nice picture!');
                    } else if (messages[0].location) {
                        this.onReceive('My favorite place');
                    } else {
                        if (!this._isAlright) {
                            this._isAlright = true;
                            this.onReceive('Alright');
                        }
                    }
                }
            }

            this.setState((previousState) => {
                return {
                    typingText: null,
                };
            });
        }, 1000);
    }

    onReceive(text) {
        this.setState((previousState) => {
            return {
                messages: GiftedChat.append(previousState.messages, {
                    _id: Math.round(Math.random() * 1000000),
                    text: text,
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        // avatar: 'https://facebook.github.io/react/img/logo_og.png',
                    },
                }),
            };
        });
    }

    renderCustomActions(props) {
        if (Platform.OS === 'ios') {
            return (
                <CustomActions
                    {...props}
                />
            );
        }
        const options = {
            'Action 1': (props) => {
                alert('option 1');
            },
            'Action 2': (props) => {
                alert('option 2');
            },
            'Cancel': () => { },
        };
        return (
            <Actions
                {...props}
                options={options}
            />
        );
    }

    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    left: {
                        backgroundColor: '#f0f0f0',
                    }
                }}
            />
        );
    }

    renderSystemMessage(props) {
        return (
            <SystemMessage
                {...props}
                containerStyle={{
                    marginBottom: 15,
                }}
                textStyle={{
                    fontSize: 14,
                }}
            />
        );
    }

    renderCustomView(props) {
        return (
            <CustomView
                {...props}
            />
        );
    }

    renderFooter(props) {
        if (this.state.typingText) {
            return (
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>
                        {this.state.typingText}
                    </Text>
                </View>
            );
        }
        return null;
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {/* <Text style={styles.mainText}> OpenTok React Native Signaling Sample</Text> */}
                {/* <OTSession
                    apiKey={this.apiKey}
                    sessionId={this.sessionId}
                    token={this.token}
                    signal={this.state.signal}
                    eventHandlers={this.sessionEventHandlers}
                    ref={(instance) => {
                        this.session = instance;
                    }}
                />
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={(text) => { this.setState({ text }); }}
                    value={this.state.text}
                />
                <Button
                    onPress={() => { this.sendSignal(); }}
                    title="Send Signal"
                />
                <FlatList
                    data={this.state.messages}
                    renderItem={this._renderItem}
                    keyExtractor={this._keyExtractor}
                /> */}

                <GiftedChat
                    messages={this.state.messages}
                    onSend={this.onSend}
                    loadEarlier={this.state.loadEarlier}
                    onLoadEarlier={this.onLoadEarlier}
                    isLoadingEarlier={this.state.isLoadingEarlier}

                    user={{
                        _id: 1, // sent messages should have same user._id
                    }}
                    renderActions={this.renderCustomActions}
                    // renderBubble={this.renderBubble}
                    // renderSystemMessage={this.renderSystemMessage}
                    renderCustomView={this.renderCustomView}
                    // renderFooter={this.renderFooter}
                />
            </View>

        );
    }
}

const styles = StyleSheet.create({
    footerContainer: {
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
    },
    footerText: {
        fontSize: 14,
        color: '#aaa',
    },
});