import React, { Component } from 'react'
import { connect } from "react-redux";
import ApiManager from '../../Components/Common/ApiManager'
import { View, WebView, StyleSheet, SafeAreaView, TouchableOpacity, Text, Image, Platform } from 'react-native';
import Header from '../Common/Header'
let IS_ANDROID = Platform.OS === 'android'
class CmsContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content:"<P/>",
            loading: false,
        };
    }
    componentDidMount(){
        let details = {},
            header = {
                "Authorization":this.props.token
            };
            ApiManager.callwebservice('GET', 'api/getCMSFromPageId/privacy_policy', header, details, (success) => {
                let response = JSON.parse(success._bodyInit);
                if (response.status === 0) {
                    this.showSimpleMessage("danger", { backgroundColor: "#DC6666" }, response.message, response.message)
                    return
                } else if (response.status === 1) {
                    this.setState({
                        content:response.data.content
                    })
                }
            }, (error) => {
                console.log("error", error)
            })
    }
    render() {
        const {content} = this.state;
        const { goBack, navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <View style={{ height: 66, flexDirection: 'row', backgroundColor: "#fff", zIndex: 1, position: "absolute", alignItems: IS_ANDROID ? "center" : "flex-end" }}>
                    <TouchableOpacity
                        onPress={() =>goBack()}
                        style={{
                            width: "15%",
                            height: 36,
                            backgroundColor: "transparent",
                            justifyContent: "center",
                            alignItems: "center",
                            // backgroundColor:"red"
                        }}>
                        <Image
                            source={require('../../images/icons/backbutton_gradient.png')}
                            style={{ width: 28, height: 18, left: 5 }}
                            resizeMethod="resize"
                            resizeMode="contain" />
                    </TouchableOpacity>
                    <View style={{ width: "70%", backgroundColor: "transparent", alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ fontFamily: "Avenir-Heavy", fontSize: 24, color: "#3E3E47" }}>{"Privacy Policy"}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => this.setState({ visibleModal: true })}
                        style={{
                            width: "15%",
                            backgroundColor: "transparent",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 66, flex: 1 }}>
                    <WebView
                        ref="webview"
                        source={{ html:content}}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        startInLoadingState={false}
                        scalesPageToFit={IS_ANDROID ? true : false}
                    />
                </View>
            </View>
        )

    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})
mapStateToProps = (state) => {
    return {
        token: state.auth.token 
    }
}

export default connect(mapStateToProps)(CmsContent);
