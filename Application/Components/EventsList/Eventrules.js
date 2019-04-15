import React, { Component } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    WebView
} from 'react-native';
import Header from '../../Components/Common/Header';
import metrics from '../../config/metrics';
import backbuttonwhite from '../../images/icons/backbutton.png'
import Apirequest from '../../Components/Common/Apirequest'
export default class Eventrules extends Component {
    constructor(props){
        super(props);
        this.state={
            htmlContent : ''
        }
    }
    componentDidMount(){
        Apirequest.getCMSFromPageId('', '', resolve=>{
            console.log("getCMSFromPageId_resolve", resolve)
            this.setState({
                htmlContent : resolve && resolve.data  && resolve.data.content ? resolve.data.content : ''
            })
        }, reject=>{
            console.log('getCMSFromPageId_reject', reject)
        })
    }
    render() {
        const { navigate, goBack } = this.props.navigation;
        return (
            <View style={{ flex: 1 }}>
                <Header
                    isSearcrchbar={false}
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
                                source={backbuttonwhite}
                                style={{
                                    width: metrics.DEVICE_WIDTH * 0.0588,
                                    height: metrics.DEVICE_HEIGHT * 0.023
                                }}
                                resizeMethod="resize"
                                resizeMode="contain" />
                        </TouchableOpacity>
                    }
                    middle={
                        <View style={{ width: "70%", backgroundColor: "transparent", alignItems: "center", justifyContent: "center" }}>
                            <Text style={{ fontFamily: "Avenir-Heavy", fontSize: 24, color: "#fff" }}>Event Rules</Text>
                        </View>
                    }
                    right={
                        <TouchableOpacity
                            onPress={() => navigate('eventrules')}//alert("rsvp should be done before 48 hours of starting")}
                            style={{
                                width: "15%",
                                backgroundColor: "transparent",
                                justifyContent: "center",
                                alignItems: "center"
                            }}/>
                    }
                />
                <WebView
                        source={{html: this.state.htmlContent}}
                        />
            </View>
        )
    }

}