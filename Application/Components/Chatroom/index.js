import React, { Component } from 'react';
import { connect } from 'react-redux'
import { View, Button, TextInput, StyleSheet, FlatList, Text, Dimensions } from 'react-native';
import { OTSession } from 'opentok-react-native';
import ApiRequest from '../Userprofile/Apirequest';
// import { reject } from 'rsvp';
// import console = require('console');
var { width , height} = Dimensions.get('window')
class Chatroom extends Component {
  constructor(props) {
    super(props);
    // this.apiKey = '46220182';
    this.apiKey='46244942',
    // this.sessionId = '2_MX40NjIyMDE4Mn5-MTU1MTQyMTg5OTI1MX5xdFljR3VQMHN2clE2S2Z6SWZocmd0cFV-fg';
    // this.token = 'T1==cGFydG5lcl9pZD00NjIyMDE4MiZzaWc9NzhmODc2Yjk2MTkzYjM2Zjg3MTUyMmU4MWUwNDE2NTU5MjgzNWM3YTpzZXNzaW9uX2lkPTJfTVg0ME5qSXlNREU0TW41LU1UVTFNVFF5TVRnNU9USTFNWDV4ZEZsalIzVlFNSE4yY2xFMlMyWjZTV1pvY21kMGNGVi1mZyZjcmVhdGVfdGltZT0xNTUxNDIxODk5JnJvbGU9bW9kZXJhdG9yJm5vbmNlPTE1NTE0MjE4OTkuMjY1MTE2Mzk5Njk4MTA=';
    this.state = {
      loading: true,
      signal: {
        data: '',
        type: '',
      },
      sessionId :'',
      token : '',
      text : '',
      messages : [],
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
    const { state } = this.props.navigation;
    let userid= state.params.userId;
    ApiRequest.getChatSessionId(this.props.token, userid, (resolve)=>{
      // console.log("componentDidMount_navigation", resolve)
      this.setState({
        sessionId:resolve.data && resolve.data.session ? resolve.data.session : '' ,
        token:resolve.data && resolve.data.token ? resolve.data.token : '' ,
        loading: false,

      })
    }, (reject)=>{
      console.log("getChatSessionId_reject", reject)
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
  _renderItem = ({item}) => (
    <Text style={styles.item}>{item.data}</Text>
  );
  render() {
    if(this.state.loading){
      return <></>
    }
    return (
      <View style={{ flex: 1 }}>
        <OTSession 
          apiKey={this.apiKey}
          sessionId={this.state.sessionId}
          token={this.state.token}
          signal={this.state.signal}
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
        <View style={{ alignSelf:"flex-end", width : width}}>
        <Button
          onPress={() => { this.sendSignal(); }}
          title="Send Signal"
        />

                <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(text) => { this.setState({ text }); }}
          value={this.state.text}
        />
        </View>

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

mapStateToProps = (state) => {
  return {
      language: state.language.defaultlanguage,
      data: state.auth.data,
      token: state.auth.token
  }
}
export default connect(mapStateToProps)(Chatroom);