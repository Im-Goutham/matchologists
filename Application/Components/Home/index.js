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
    TouchableWithoutFeedback
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../Common/Header'
import FlatListDemo from './list'
export default class HomeScreen extends Component {
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={['#DB3D88', '#273174']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 1 }}>
                    <SafeAreaView>
                        <Header
                            left={
                                <TouchableOpacity onPress={() => this.props.navigation.openDrawer()} style={{ width: "20%", backgroundColor: "transparent", justifyContent: "center", alignItems: "center" }}>
                                    <Image source={require('../../images/menu.png')} style={{ width: 24, height: 18 }} resizeMethod="resize" resizeMode="contain" />
                                </TouchableOpacity>
                            }
                            middle={
                                <View style={{ width: "60%", backgroundColor: "transparent", alignItems: "center", justifyContent: "center" }}>
                                <Text style={{ fontFamily: "Avenir-Heavy", fontSize: 24, color: "#fff" }}>Discover</Text>
                            </View>            
                            } 
                            right={
                                <View style={{ width: "20%", backgroundColor: "transparent", justifyContent: "center", alignItems: "center" }}>
                                <Image source={require('../../images/filter.png')} style={{ width: 17, height: 18 }} resizeMethod="resize" resizeMode="contain" />
                            </View>
                            }
                            />
                    </SafeAreaView>
                </LinearGradient>
                <FlatListDemo/>
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
