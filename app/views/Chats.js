
import React, { Component } from 'react';
import { View, Button, TextInput, StyleSheet, FlatList, Text } from 'react-native';
import { OTSession } from 'opentok-react-native';
import ApiManager from '../../Application/Components/Common/ApiManager';

import { API_KEY, API_SECRET } from '../../global.json'
export default class Chats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiKey: API_KEY,
            sessionId: '',
            token: '',
            signal: {
                data: '',
                type: '',
            },
            text: '',
            messages: [],
            isLoading: true
        };
        this.sessionEventHandlers = {
            signal: (event) => {
                if (event.data) {
                    const myConnectionId = this.session.getSessionInfo().connection.connectionId;
                    const oldMessages = this.state.messages;
                    const messages = event.connectionId === myConnectionId ? [...oldMessages, { data: `Me: ${event.data}` }] : [...oldMessages, { data: `Other: ${event.data}` }];
                    this.setState({
                        messages,
                    });
                }
            },
        };
    }
    componentDidMount() {
        this.callapi()
    }
    callapi = () => {
        ApiManager.callapi((success) => {
            console.log("sessionId call back is", success.publisherToken)
            // console.log("publisherToken call back is", success.publisherToken)
            // console.log("subscriberToken call back is", success.subscriberToken)
            this.setState({
                sessionId: success.sessionId.toString(),
                token: success.publisherToken.toString(),
                isLoading: false
            })
        }, (error) => {
            console.log("error call back is", error)
        })
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
    render() {
        if (this.state.isLoading)
            return (
                <View>
                    <Text>Loading....</Text>
                </View>
            )

        let { apiKey, sessionId, token, signal } = this.state;

        return (
            <View style={{ flex: 1, paddingVertical: 30, paddingHorizontal: 20 }}>
                <OTSession
                    apiKey={apiKey}
                    sessionId={sessionId}
                    token={token}
                    signal={signal}
                    eventHandlers={this.sessionEventHandlers}
                    ref={(instance) => {
                        this.session = instance;
                    }}
                />
                <FlatList
                    data={this.state.messages}
                    renderItem={this._renderItem}
                    keyExtractor={this._keyExtractor}
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

            </View>
        );
    }
}

const styles = StyleSheet.create({
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
    mainText: {
        fontSize: 20,
        marginTop: 30,
        marginBottom: 10,
    }
})