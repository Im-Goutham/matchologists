import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    TouchableWithoutFeedback
} from 'react-native';
// import Icons from 'react-native-vector-icons/Ionicons'
import { OTSession, OTPublisher, OTSubscriber } from 'opentok-react-native';
import LinearGradient from 'react-native-linear-gradient';

import { API_KEY } from '../../../global.json'
let { width, height } = Dimensions.get('window');
import Timer from './TimeKeeper/index';

export default class LiveCall extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiKey : '46244942',
            sessionId : '2_MX40NjI0NDk0Mn5-MTU0NjUwMDUxNzYyMH52Q2RIYm96M2hTK0NwczU3bXhKNFc5dkd-QX4',
            token : 'T1==cGFydG5lcl9pZD00NjI0NDk0MiZzaWc9MDBmNzU5OTE1Y2ExMTM0Mzg3YTYzNTQ3ZDA2NDYxZmYzYTRiYzExYTpzZXNzaW9uX2lkPTJfTVg0ME5qSTBORGswTW41LU1UVTBOalV3TURVeE56WXlNSDUyUTJSSVltOTZNMmhUSzBOd2N6VTNiWGhLTkZjNWRrZC1RWDQmY3JlYXRlX3RpbWU9MTU0NjUwMDUxOCZub25jZT0wLjE0NDAzNDc5ODE5ODI3MjE0JnJvbGU9cHVibGlzaGVyJmV4cGlyZV90aW1lPTE1NDY1ODY5MTgmaW5pdGlhbF9sYXlvdXRfY2xhc3NfbGlzdD0='
        }
    }

    render() {
        let { apiKey, sessionId, token } = this.state;
        return (
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <OTSession apiKey={apiKey} sessionId={sessionId} token={token}>
                    <View style={{ position: "absolute", zIndex: 2 }}>
                        <OTPublisher style={{ width: 150, height: 200 }} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <OTSubscriber style={{ width: "100%", height: "100%", resizeMode: "contain" }} />
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
                            style={{ width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center" }}>
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
