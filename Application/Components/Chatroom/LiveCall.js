import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    Dimensions,
    TouchableOpacity
} from 'react-native';
// import Icons from 'react-native-vector-icons/Ionicons'
import { OTSession, OTPublisher, OTSubscriber, EventData, OT } from 'opentok-react-native';
import LinearGradient from 'react-native-linear-gradient';

import * as global from '../../../global.json'
let { width, height } = Dimensions.get('window');
import Timer from './TimeKeeper/index';

export default class LiveCall extends Component {
    constructor(props) {
        super(props);
        this.publisherProperties = {
            publishAudio: false,
            cameraPosition: 'front',
            publishVideo: true,
        };
        this.publisherEventHandlers = {
            audioLevel: event => {
                console.log('Publisher stream created!', event);
            },
            error: event => {
                console.log('Publisher stream destroyed!', event);
            },
            streamCreated: event => {
                console.log('Publisher stream created!', event);
            },
            streamDestroyed: event => {
                console.log('Publisher stream destroyed!', event);
            }
        };
        this.subscriberProperties = {
            subscribeToAudio: false,
            subscribeToVideo: true,
          };        
        this.sessionEventHandlers = {
            sessionConnected: event => {
                console.log('sessionConnected created!', event);
            },
            streamCreated: event => {
                console.log('Stream created!', event);
            },
            streamDestroyed: event => {
                console.log('Stream destroyed!', event);
            },
        };
    }

    render() {
        const { goBack, state } = this.props.navigation;
        const { sessionId, token } = state.params;
        console.log("sessionId", sessionId);
        console.log("token", token);
        return (
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <OTSession
                    apiKey={global.API_KEY}
                    sessionId={sessionId}
                    token={token}
                    eventHandlers={this.sessionEventHandlers}
                >
                    <View style={{ position: "absolute", zIndex: 2 }}>
                        <OTPublisher
                            style={{ width: 150, height: 200 }}
                            properties={this.publisherProperties}
                            eventHandlers={this.publisherEventHandlers}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <OTSubscriber 
                        style={{ width: "100%", height: "100%", resizeMode: "contain" }} 
                        properties={this.subscriberProperties}
                        eventHandlers={this.subscriberEventHandlers}                
                        />
                    </View>
                </OTSession>
                <View style={{
                    width: width,
                    height: 160,
                    bottom: 0,
                    position: "absolute",
                    zIndex: 2,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    flexDirection: 'row',
                    borderTopLeftRadius: 20,
                    borderTopEndRadius: 20,
                    justifyContent: "space-between"
                }}>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        {/* <Icons name="ios-close-circle" size={50} color="red" /> */}
                    </View>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Timer
                            beat={false}
                            seconds={420}
                            radius={50}
                            borderWidth={3}
                            color="#C52957"
                            bgColor="#000"
                            bgColorSecondary="#E495AC"
                            bgColorThirt="#EFD6DE"
                            shadowColor="#FFF"
                            textStyle={{ fontSize: 26, color: '#FFF', }}
                            subTextStyle={{ fontSize: 10, color: '#FFF', }}
                            onTimeElapsed={() => { console.log('Time elapsed') }}
                            isPausable={true}
                            onPause={() => console.log('Pause')}
                            onResume={() => console.log('Resume')}
                            minScale={0.9}
                            maxScale={1.2}
                        />
                    </View>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <LinearGradient
                            colors={['#DB3D88', '#273174']}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 1 }}
                            style={{ width: 40, height: 40, borderRadius: 20, overFlow: "hidden" }}>
                            <TouchableOpacity onPress={() => goBack()} style={{ width: 40, height: 40, justifyContent: "center", alignItems: "center" }}>
                                <Image
                                    source={require('../../images/icons/Close.png')}
                                    style={{ width: 15, height: 15 }}
                                    resizeMode="contain"
                                    resizeMethod="resize"
                                />
                            </TouchableOpacity>
                            {/* <Icons name="ios-reverse-camera" size={30} color="#fff" /> */}
                        </LinearGradient>
                    </View>

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        padding: 20,
        borderWidth: 3,
        borderColor: 'white',
        backgroundColor: 'red'
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold'
    }
});
