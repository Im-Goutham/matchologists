import React, {Component} from 'react';
import { ScrollView, View,TouchableOpacity, Text,  StyleSheet } from 'react-native';
import { OTSession, OTPublisher, OTSubscriber } from 'opentok-react-native';

import {API_KEY, API_SECRET } from '../../global.json'

class Publish extends Component {
  constructor(props) {
    super(props);
    this.state = {
      publish:false,
      record:false,
      apiKey: API_KEY,
      sessionId: '2_MX40NjIwOTE2Mn5-MTU0MjcxNTMyNjA1N343NzgweWdTNjdoelhyaTRZVFp0eGozbVZ-fg',
      token: 'T1==cGFydG5lcl9pZD00NjIwOTE2MiZzaWc9ZTBjNDAxNTEyNzljOWY3NzQxYjNlZTY5MTI4YzI3OWU1YzllZDVkNjpzZXNzaW9uX2lkPTJfTVg0ME5qSXdPVEUyTW41LU1UVTBNamN4TlRNeU5qQTFOMzQzTnpnd2VXZFROamRvZWxoeWFUUlpWRnAwZUdvemJWWi1mZyZjcmVhdGVfdGltZT0xNTQyNzE1MzI2Jm5vbmNlPTAuMjA5NTg0Nzc1OTQ0MTk5Nzcmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTU0MjgwMTcyNiZjb25uZWN0aW9uX2RhdGE9aWQlM0RZb3VyVXNlcklkJmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9Zm9jdXM='
    }
  }

  startPublishing(){
    var record = true;
    this.setState({publish: !this.state.publish},()=>{
        if(!this.state.publish){
          record = false;
        }
        this.setState({record})
    })
  }


  startRecording(){
    {this.setState({record: !this.state.record})}
  }

 render() {
   let {apiKey, sessionId, token, publish, record} = this.state;
    return (
     <View style={{ flex: 1}}>
     <View style={{flex: 4}}>
     {
         publish ? (
            <OTSession apiKey={apiKey} sessionId={sessionId} token={token}>
               <OTPublisher style={{ width: "100%", height: '100%'}} />
            </OTSession>
         ): (null)
     }
     </View>
     <View style={{flex: 1,flexDirection:'row',justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity style={styles.button} onPress={()=> {this.startPublishing()}}>
            <Text style={styles.textStyle}>{publish ? 'Stop Publishing' : 'Start Publishing'}</Text>
          </TouchableOpacity>
          {
             (publish) ? (
                <TouchableOpacity style={styles.button} onPress={()=>  this.startRecording()}>
                <Text style={styles.textStyle}>{record ? 'RECORD' : 'STOP'}</Text>
              </TouchableOpacity>
             ):(null)
          }


     </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    padding:20,
    borderWidth: 3,
    borderColor: 'white',
    backgroundColor:'red'
  },
  textStyle: {
    color: 'white',
    fontWeight:'bold'
  }
});

export default Publish;