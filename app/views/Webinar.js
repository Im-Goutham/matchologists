import React, { Component } from "react";
import { ScrollView, View, StyleSheet } from 'react-native';
import { OTSession, OTPublisher, OTSubscriber } from 'opentok-react-native';
import ApiManager from '../../Application/Components/Common/ApiManager';

import {API_KEY, API_SECRET } from '../../global.json'

class Webinar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sessions: [
        {
          apiKey: API_KEY,
          sessionId: '',
          token: ''
        }
      ]
     
    }
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

 render() {
   let {sessions,apiKey,sessionId,token} = this.state;
    return (
       <ScrollView>
         {
            sessions.map((session,key)=>{
              let {apiKey,sessionId,token} = session;
                return (
                  <View key={key}>
                  <OTSession apiKey={apiKey} sessionId={sessionId} token={token}>
                  <OTSubscriber style={{ width: "100%", height:300, marginTop:50, borderWidth:3}} />
                 </OTSession>
                 </View>
                )
            })
         }
       </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 300,
  },
});

export default Webinar;