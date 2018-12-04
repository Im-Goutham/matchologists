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
import Modal from "react-native-modal";
import SearchBar from './SearchBar'
import Header from '../Common/Header'
import FlatListDemo from './list';
import Filter from '../Home/filter'

// import { Userlist, SearchHeader } from './userlist';
const IS_ANDROID = Platform.OS === 'android'
import metrics from '../../config/metrics';
const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.05
const header_height = metrics.DEVICE_HEIGHT * 0.1

export default class SearchMember extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visibleModal: false,
            scrollOffset: ''
        }
    }
    handleScrollTo = p => {
        if (this.scrollViewRef) {
            this.scrollViewRef.scrollTo(p);
        }
    };
    handleOnScroll = event => {
        console.log("event.nativeEvent.contentOffset.y");

        this.setState({
            scrollOffset: event.nativeEvent.contentOffset.y
        });
    };
    render() {
        const { goBack } = this.props.navigation;
        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={['#DB3D88', '#273174']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        // marginBottom : IS_ANDROID ? 30 :20
                    }}>
                    <SafeAreaView/>
                        <Header
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
                                        source={require('../../images/icons/backbutton.png')}
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
                                    <Text style={{ fontFamily: "Avenir-Heavy", fontSize: 24, color: "#fff" }}>Search</Text>
                                </View>
                            }
                            right={
                                <View style={{
                                    width: "15%",
                                    backgroundColor: "transparent",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}/>
                            }
                        />
                </LinearGradient>
                <SearchBar />
                <View style={{ backgroundColor: "transparent", top: 30 }}>
                <View style={{ paddingHorizontal:10, flexDirection:"row", justifyContent: "space-between"}}>
                <Text style={{ fontFamily: "Avenir-Medium", fontSize: 15, color: "#C1C0C9" }}>
                RECENT</Text>
                <Text style={{ fontFamily: "Avenir-Medium", fontSize: 15, color: "#D43C87" }} 
                onPress={()=>this.setState({visibleModal: true})} >
                Filter</Text>
                </View>
                    <FlatListDemo/>
                </View>
                <SafeAreaView style={{ backgroundColor: "#fff" }} />
               
                <Modal
                    isVisible={this.state.visibleModal}
                    onSwipe={() => this.setState({ visibleModal: false })}
                    swipeDirection="down"
                    scrollTo={this.handleScrollTo}
                    style={styles.bottomModal}
                >
                    <View style={{ height: '80%', backgroundColor: "#FFF" }}>
                    <ScrollView contentContainerStyle={{flex:1}}>
                    <Filter  closemodal={() => this.setState({ visibleModal: false })}/>
                    </ScrollView>
                    </View>
                </Modal>
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
    },
    bottomModal: {
        justifyContent: "flex-end",
        margin: 0
    },
});
