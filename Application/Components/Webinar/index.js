import React, { Component, PropTypes } from 'react'
import {
    Platform,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    UIManager,
    Text,
    ScrollView,
    View,
    Button,
    FlatList,
    TextInput,
    TouchableOpacity
} from 'react-native'
import { OTSession, OTPublisher, OTSubscriber } from 'opentok-react-native';



import metrics from '../../config/metrics';
import {API_KEY, API_SECRET } from '../../../global.json';


if (Platform.OS === 'android') UIManager.setLayoutAnimationEnabledExperimental(true)

export default class Webinar extends Component {
    constructor() {
        super();
        this.state = {
                apiKey: API_KEY,
                sessionId: '2_MX40NjIwODUyMn5-MTU0MzI5OTI2NjMxNn5BUTVFOExjUnJZR0FDeExrZ3l6SVlINWV-fg',
                token: 'T1==cGFydG5lcl9pZD00NjIwODUyMiZzaWc9NDY4YjQ1NWJiM2RlNmZjMDEyNDA5ZjMyOTI3N2QxNjc4MWFlZGYwNjpzZXNzaW9uX2lkPTJfTVg0ME5qSXdPRFV5TW41LU1UVTBNekk1T1RJMk5qTXhObjVCVVRWRk9FeGpVbkpaUjBGRGVFeHJaM2w2U1ZsSU5XVi1mZyZjcmVhdGVfdGltZT0xNTQzMjk5MjY2JnJvbGU9bW9kZXJhdG9yJm5vbmNlPTE1NDMyOTkyNjYuMzM1MjEzNTY3Mzk2ODA=',
                signal: {
                    data: '',
                    type: '',
                },
                text: '',
                messages: [],
            }
            this.sessionEventHandlers = {
                signal: (event) => {
                    if (event.data) {
                        console.log('Event data is ',event.data);
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
     //   this.callapi()
    }


    // callapi = () => {
    //     ApiManager.callapi((success) => {
    //         console.log("sessionId call back is", success.publisherToken)
    //         // console.log("publisherToken call back is", success.publisherToken)
    //         // console.log("subscriberToken call back is", success.subscriberToken)
    //         this.setState({
    //             sessionId: success.sessionId.toString(),
    //             token: success.publisherToken.toString(),
    //             isLoading: false
    //         })
    //     }, (error) => {
    //         console.log("error call back is", error)
    //     })
    // }

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
        let {apiKey, sessionId, token, signal} = this.state;
        console.log("signal is ",signal);
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar
                    backgroundColor={Platform.OS === 'android' ? "#fff" : undefined}
                    barStyle="dark-content" />
                    <View style={{flex: 1}}>
                        <OTSession 
                          apiKey={apiKey} 
                          sessionId={sessionId}
                          token={token}
                          signal={signal}
                          eventHandlers={this.sessionEventHandlers}
                          ref={(instance) => {
                              this.session = instance;
                          }}
                          >
                          <OTSubscriber style={{ width: "100%", height:300, marginTop:50, borderWidth:3}} />
                        </OTSession>
                    </View>
                    <View style={{flex: 1}}>
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
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    
});