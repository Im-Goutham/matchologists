/**
 * home page
 * Author :abhishekkalia
 */

import React, { Component } from 'react';
import {
    KeyboardAvoidingView,
    LayoutAnimation,
    Platform,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    UIManager,
    Text,
    ScrollView,
    View,
    Image,
    ListView,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../Common/Header'
import { Userlist, SearchHeader } from './userlist';
const IS_ANDROID = Platform.OS === 'android'
import metrics from '../../config/metrics';
const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.05
const header_height = metrics.DEVICE_HEIGHT * 0.1

export default class HomeScreen extends Component {
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={['#DB3D88', '#273174']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        // marginBottom : IS_ANDROID ? 30 :20
                    }}>
                    <SafeAreaView>
                        <Header
                            left={
                                <TouchableOpacity 
                                onPress={() => this.props.navigation.openDrawer()} 
                                style={{ 
                                    width: "15%", 
                                    backgroundColor: "transparent", 
                                    justifyContent: "center", 
                                    alignItems: "center" 
                                    }}>
                                    <Image 
                                    source={require('../../images/menu.png')} 
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
                                    <Text style={{ fontFamily: "Avenir-Heavy", fontSize: 24, color: "#fff" }}>Discover</Text>

                                </View>
                            }
                            right={
                                <View style={{ 
                                    width: "15%", 
                                    backgroundColor: "transparent", 
                                    justifyContent: "center", 
                                    alignItems: "center" 
                                    }}>
                                    <Image 
                                    source={require('../../images/filter.png')} 
                                    style={{ width: 17, height: 18, left :5 }} 
                                    resizeMethod="resize" 
                                    resizeMode="contain" />
                                </View>
                            }
                        />
                    </SafeAreaView>
                </LinearGradient>
                <SearchHeader />
                <View style={{backgroundColor:"transparent", top:30}}>
                    <Userlist 
                    navigation = {this.props.navigation}/>
                </View>
                <SafeAreaView style={{ backgroundColor: "#fff" }} />

            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#F5FCFF',
    }
});
