import React, { Component } from 'react';
import { View, Button, TextInput, StyleSheet, FlatList, Text } from 'react-native';
import { OTSession } from 'opentok-react-native';
import ApiManager from '../Common/ApiManager';

export default class Chatroom extends Component {
  constructor(props) {
    super(props);
    this.apiKey = '46209162';
    this.sessionId = '1_MX40NjIwNDc0Mn5-MTU0MjYyNTk1MzQ3Nn4yZEhnMm5OT0p1UzRlVnpMakp3TmppTXV-fg';
    this.token = 'T1==cGFydG5lcl9pZD00NjIwNDc0MiZzaWc9NTRhZTQyMDVlNGQxYzA5OTBjMTM3ZDI5NzRkZTQxNWMwOTk5OTc5NTpzZXNzaW9uX2lkPTFfTVg0ME5qSXdORGMwTW41LU1UVTBNall5TlRrMU16UTNObjR5WkVobk1tNU9UMHAxVXpSbFZucE1ha3AzVG1wcFRYVi1mZyZjcmVhdGVfdGltZT0xNTQyNjI1OTUzJnJvbGU9bW9kZXJhdG9yJm5vbmNlPTE1NDI2MjU5NTMuNDg4NzE3NTE0MzcyMjM=';    
    this.state = {
      signal: {
        data: '',
        type: '',
      },
      text: '',
      messages: [],
    };
    this.sessionEventHandlers = {
      signal: (event) => {
        if (event.data) {
          const myConnectionId = this.session.getSessionInfo().connection.connectionId;
          const oldMessages = this.state.messages;
          const messages = event.connectionId === myConnectionId ? [...oldMessages, {data: `Me: ${event.data}`}] : [...oldMessages, {data: `Other: ${event.data}`}];
          this.setState({
            messages,
          });
        }
      },
    };
  }

  componentDidMount(){
    // this.callapi()
  }

  callapi=()=>{
    // ApiManager.callapi((success) => {
    //   console.log("sessionId call back is", success.sessionId)
    //   console.log("publisherToken call back is", success.publisherToken)
    //   console.log("subscriberToken call back is", success.subscriberToken)
    // },(error)=>{
    //   console.log("error call back is", error)
    // })
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
  _renderItem = ({item}) => (
    <Text style={styles.item}>{item.data}</Text>
  );
  render() {
    return (
      <View style={{ flex: 1 }}>
        <OTSession 
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
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
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