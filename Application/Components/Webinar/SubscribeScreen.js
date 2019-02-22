import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    StatusBar,
    SafeAreaView,
    Text,
    FlatList,
    View,
    Image,
    Platform,
    TouchableOpacity
} from 'react-native';
import CustomButton from '../CustomButton';
import I18n from 'react-native-i18n'
import {Close} from '../Common/Hamburger'
export default class SubscribeScreen extends Component {
    render() {
        const { goBack , navigate} = this.props.navigation;
        return (
            // <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = "#00BCD4" translucent = {true}/>
            <View style={styles.container}>
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => goBack()} style={{ backgroundColor: "transparent", width: "15%", height: "100%", justifyContent: "center" }}>
                            <Close />
                        </TouchableOpacity>
                        <View style={{ width: '70%', height: '100%', backgroundColor: "transparent", justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ color: "#FFF", fontSize: 17, fontFamily: "Avenir-Heavy", lineHeight: 22 }}>Subscribe</Text>
                        </View>
                        <View style={{ backgroundColor: "transparent", width: "15%", height: "100%", justifyContent: "center" }} />
                    </View>
                    <View style={styles.wallcontainer}>
                        <Image source={require('../../images/wall_post.png')}
                            style={styles.wallimage}
                            resizeMethod="resize"
                            resizeMode="contain" />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={{ color: "#D43C87", fontSize: 17, fontFamily: "Avenir-Medium", lineHeight: 22, textAlign: "center" }}>{I18n.t('webinar_access_label').toUpperCase()}</Text>
                        <Text style={{
                            color: "#FFF",
                            fontSize: 17,
                            fontFamily: "Avenir-Heavy",
                            lineHeight: 30,
                            textAlign: "center",
                            letterSpacing: -0.41
                        }}>{I18n.t('subscribe_label')}</Text>
                    </View>
                    <View style={styles.buttoncontainer}>
                        <CustomButton
                        onPress={()=>navigate('golive')}
                            textStyle={{
                                color: "#2C3174",
                                fontSize: 17,
                                fontFamily: "Avenir-Heavy",
                                lineHeight: 22,
                            }}
                            buttonStyle={{
                                width: "85%",
                                backgroundColor: "#FFF",
                                alignSelf: "center"
                            }}
                            text="SUBSCRIBE" />
                        <Text />
                    </View>
                </SafeAreaView>
            </View>
        )
    }
}
let styles = {
    container: {
        flex: 1,
        backgroundColor: "#2C3174"
    },
    header: {
        height: 74,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    wallimage: {
        width: 262,
        height: 209,
    },
    wallcontainer: {
        flex: 2,
        justifyContent: "center",
        alignItems: "center"
    },
    textContainer: {
        flex: 1,
        justifyContent: "space-around"
    },
    buttoncontainer: {
        flex: 1,
        justifyContent: "space-around"
    }
}

