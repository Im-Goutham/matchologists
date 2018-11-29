import React, { Component, PropTypes } from 'react'
import {
    Platform,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    UIManager,
    Image,
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

const user_image = 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg';
import sendImg from '../../../assets/icons/send.png';

if (Platform.OS === 'android') UIManager.setLayoutAnimationEnabledExperimental(true)

export default class Webinar extends Component {
    constructor() {
        super();
        this.state = {
                apiKey: API_KEY,
                sessionId: '2_MX40NjIwODUyMn5-MTU0MzQ3NDM5MjMyM35LU1lxMzRTS0NQWlZDZWY5QlF1Yi9FMWJ-fg',
                token: 'T1==cGFydG5lcl9pZD00NjIwODUyMiZzaWc9NWVmN2ZhNmFjNThlNGFiZjBiZGMyYzBmMWRjMjJlMmEzZDY3MGE3NjpzZXNzaW9uX2lkPTJfTVg0ME5qSXdPRFV5TW41LU1UVTBNelEzTkRNNU1qTXlNMzVMVTFseE16UlRTME5RV2xaRFpXWTVRbEYxWWk5Rk1XSi1mZyZjcmVhdGVfdGltZT0xNTQzNDc0MzkyJnJvbGU9bW9kZXJhdG9yJm5vbmNlPTE1NDM0NzQzOTIuMzQ0NzIwNDkyMTYzOQ==',
                signal: {
                    data: '',
                    type: '',
                },
                text: '',
                messages: [
                    {
                        img: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                        name: "Troy Bishop",
                        mesg: "Hey I'm interested in joining this class but I wont be available on the same dates. Can we try and work something out for next month?"
                    }, 
                    {
                        img: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                        name: "Eric Wolfe",
                        mesg: "Looks good. I might join"
                    },
                    {
                        img: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                        name: "Hulda Johnson",
                        mesg: "I took a similar class last month. However they didnt include review sessions or a final task to judge our growth. Can you confirm all the things that will be covered in a little more details. Thank you"
                    }  
                ]
            }
            this.sessionEventHandlers = {
                signal: (event) => {
                    console.log('event is ',event);
                    if (event.data) {
                        const myConnectionId = this.session.getSessionInfo().connection.connectionId;
                        const oldMessages = this.state.messages;
                        const messages = event.connectionId === myConnectionId ? [...oldMessages,   {
                            img: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                            name: "Troy Bishop",
                            mesg: event.data
                        }  ] : [...oldMessages,   {
                            img: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                            name: "Troy Bishop",
                            mesg: event.data
                        } ];
                        this.setState({
                            messages,
                        },()=>{
                            this.refs.List_Reference.scrollToEnd({animated: true});
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

    // _renderItem = ({ item }) => (
    //     <Text style={styles.item}>{item.data}</Text>
    // );

    _renderItem = ({ item }) => {
         return (
            <View style={{flex:1,flexDirection: 'row',paddingVertical:5}}>
                    <View style={{flex:1.5,alignItems:'center',justifyContent:'flex-start'}}>
                        <Image 
                           source={{uri: item.img}}
                           style={styles.imgStyle}
                           />
                    </View>
                    <View style={{flex:8.5,flexDirection: 'column'}}>
                        <View style={{flex:1,flexDirection: 'row',justifyContent:'space-between'}}>
                             <Text style={styles.nameStyle}>{item.name}</Text>
                             <Text style={styles.timeStyle}>2 hours ago</Text>
                        </View>
                        <Text style={styles.mesgStyle}>{item.mesg}</Text>
                    </View>
           </View>
         ) 
    };

    render() {
        let {apiKey, sessionId, token, signal} = this.state;
        console.log("signal is ",signal);
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <StatusBar
                    backgroundColor={Platform.OS === 'android' ? "#fff" : undefined}
                    barStyle="dark-content" />
                    <View style={{flex: 1,backgroundColor: 'green'}}>
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
                          <OTSubscriber style={{ width: "100%", height:'100%'}} />
                        </OTSession>
                    </View>
                    <View style={{flex: 1,paddingHorizontal: 15}}>
                    <View style={{flex:8.5}}>
                    <FlatList
                                data={this.state.messages}
                                renderItem={this._renderItem}
                                keyExtractor={this._keyExtractor}
                                style={{marginVertical: 10}}
                                ref='List_Reference'
                            />
                    </View>
                    <View style={{flex:1.5}}>
                    <View style={{flex:1,flexDirection: 'row',paddingVertical:5}}>
                        <View style={{flex:1.5,alignItems:'center',justifyContent:'flex-start'}}>
                            <Image 
                            source={{uri: user_image}}
                            style={styles.imgStyle}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.inputStyle}
                                placeholder=""
                                value={this.state.text}
                                onChangeText={(text) => { this.setState({ text }); }}
                                underlineColorAndroid="transparent"
                            />
                            <TouchableOpacity onPress={() => { this.sendSignal(); }}>
                                <Image 
                                    source={require('../../../assets/icons/send.png')} 
                                    style={styles.sendStyle}
                                />
                            </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                    </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    nameStyle: {
       color: '#3E3E47',
       fontFamily: 'Avenir-Heavy',
       fontSize: 13
    },
    mesgStyle: {
        color: '#3E3E47',
        fontFamily: 'Avenir-Medium',
        fontSize: 13
    },
    imgStyle: {
        width:32,
        height:32,
        borderRadius: 16
    },
    timeStyle: {
        color: 'rgb(62,62,71)',
        fontFamily: 'Avenir-Medium',
        fontSize: 13
    },
    sendStyle: {
        padding: 10,
        margin: 5,
        height: 17,
        width: 19,
        resizeMode : 'contain',
        alignItems: 'center'
    },
    inputContainer: {
        flex:8.5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height:40,
        borderColor: 'rgba(212, 60, 135,0.2)',
        borderRadius: 5,
        borderWidth: 1,
        paddingLeft: 5
    },
    inputStyle: {
        flex:1,
        height:40,
        paddingTop: 5
    }

});