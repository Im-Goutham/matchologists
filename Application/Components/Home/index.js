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
    AsyncStorage
} from 'react-native';
import ApiManager from "../Common/ApiManager";
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient';
import Modal from "react-native-modal";
import { Menu } from "../Common/Hamburger";
import Header from '../Common/Header';
import SearchButton from './SearchButton';
import PopupMenu from '../Userprofile/options'
import _ from 'lodash';
import Userlist from './userlist';
import Filter from './filter';
import sort_ascending from '../../images/icons/white-sort.png';
import { Close } from '../Common/Hamburger'

// import SocketChat from '../Common/client'
import SocketIOClient from 'socket.io-client'
const IS_ANDROID = Platform.OS === 'android'
import metrics from '../../config/metrics';
// const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.05
// const header_height = metrics.DEVICE_HEIGHT * 0.1

var sortarray = ['Match Picks', 'Activity Date', 'Newest First', 'Age', 'Distance'];
let data={};
class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userList: [],
            filterModal: false,
            sortingModal: false,
            scrollOffset: '',
            zipcode: '',
            profilematch: [0],
            agerange: [18, 100],
            today: false,
            week: false,
            month: false,
            is_loading: false,
        }
    }
    componentDidMount() {
        this.readfilterdata()
        .then(()=>this.sortAndFilterUsers())
        .done()
        
        // this.makeRemoteRequest();
    }
    readfilterdata = async () =>{
        var filterlocalstorage = await AsyncStorage.getItem('localfilter');
        if (filterlocalstorage && typeof filterlocalstorage == "string") {
            filterlocalstorage = JSON.parse(filterlocalstorage);
            data = filterlocalstorage;

        }
        
    }
    async setFilterValues() {
        var filterlocalstorage = await AsyncStorage.getItem('localfilter');
        if (filterlocalstorage && typeof filterlocalstorage == "string") {
            filterlocalstorage = JSON.parse(filterlocalstorage);
            console.log('filterlocalstorage', filterlocalstorage);
            this.setState({
                zipcode: filterlocalstorage.zipcode ? filterlocalstorage.zipcode : '',
                profilematch: filterlocalstorage.matchPercentage ? [filterlocalstorage.matchPercentage] : [0],
                agerange: filterlocalstorage.age ? [filterlocalstorage.age.min, filterlocalstorage.age.max] : [18, 100],
                today: filterlocalstorage.lastLogin ? filterlocalstorage.lastLogin.today : false,
                week: filterlocalstorage.lastLogin ? filterlocalstorage.lastLogin.week : false,
                month: filterlocalstorage.lastLogin ? filterlocalstorage.lastLogin.month : false
            })
        } else {
            // console.log("this.is licalstore values", this.props.filter)
            // this.props.filter ?
            //     this.setState({
            //         profilematch: this.props.filter.matchPercentage ? [this.props.filter.matchPercentage] : [0],
            //         agerange: this.props.filter.age ? [this.props.filter.age.min, this.props.filter.age.max] : [18, 100],
            //         today: this.props.filter.lastLogin ? this.props.filter.lastLogin.today : false,
            //         week: this.props.filter.lastLogin ? this.props.filter.lastLogin.week : false,
            //         month: this.props.filter.lastLogin ? this.props.filter.lastLogin.month : false
            //     })
            //     : undefined;
        }
        this.setState({ filterModal: !this.state.filterModal })
    }
    sortAndFilterUsers=()=>{
        let header = {
            'Authorization': this.props.token,
        }
        // data.zipcode= 93311;
        // data.matchPercentage= 21;
        // data.age=  {"min": 18, "max": 25};
        // data.lastLogin= {"today": true, "week": true, "month": true};
        // data.sortPercentage= "desc";
        console.log("data", data)
        ApiManager.callwebservice('POST', 'api/sortAndFilterUsers', header, data, (success) => {
            let response = JSON.parse(success._bodyInit);
            // console.log("response", response)
            let newData = [];

            if (response.status === 0) {
                return
            } else if (response.status === 1) {
                let responseData = response.data.data

                for (let i = 0; i < responseData.length; i++) {
                    newObj = {};
                    newObj.uri = "";
                    let galeryLength = responseData[i].gallery;
                    if (responseData[i].profilePic) {
                        newObj.uri = responseData[i].profilePic;
                    } else {
                        let filteredGallery = _.filter(galeryLength, (image) => {
                            return _.includes(image.url, 'jpg') || _.includes(image.url, 'png') || _.includes(image.url, 'jpeg')
                        })
                        if (filteredGallery && filteredGallery.length) {
                            newObj.uri = filteredGallery[0].url;
                        }
                    }
                    newObj._id = responseData[i]._id;
                    newObj.fullName = responseData[i].fullName;
                    newObj.age = responseData[i].age;
                    newData.push(newObj)
                }
            }
            console.log("newData", newData)
            this.setState({
                userList: newData,
                is_loading: false,
            })
        }, (error) => {
            alert("netwrok fail")
            console.log("error", error)
        })
    }

    makeRemoteRequest = () => {
        let header = {
            'Authorization': this.props.token,
        }
        console.log("makeRemoteRequest", header)
        ApiManager.callwebservice('GET', 'api/getMatchPercentage', header, '', (success) => {
            let response = JSON.parse(success._bodyInit);
            console.log("response", response)
            let newData = [];

            if (response.status === 0) {
                return
            } else if (response.status === 1) {
                console.log("newData", response.data.data)
                let responseData = response.data.data

                for (let i = 0; i < responseData.length; i++) {
                    newObj = {};
                    newObj.uri = "";
                    let galeryLength = responseData[i].gallery;
                    if (responseData[i].profilePic) {
                        newObj.uri = responseData[i].profilePic;
                    } else {
                        let filteredGallery = _.filter(galeryLength, (image) => {
                            return _.includes(image.url, 'jpg') || _.includes(image.url, 'png') || _.includes(image.url, 'jpeg')
                        })
                        if (filteredGallery && filteredGallery.length) {
                            newObj.uri = filteredGallery[0].url;
                        }
                    }
                    newObj._id = responseData[i]._id;
                    newObj.fullName = responseData[i].fullName;
                    newObj.age = responseData[i].age;
                    newData.push(newObj)
                }
            }
            this.setState({
                userList: newData,
                is_loading: false,
            })
        }, (error) => {
            alert("netwrok fail")
            console.log("error", error)
        })
    };

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
    getFilteredUsers(users) {
        console.log("getFilteredUsers ==================", users)
        let responseData = users.data && users.data.data ? users.data.data : [];
        let new_array = [];
        for (let i = 0; i < responseData.length; i++) {
            let new_obj = {};
            new_obj.uri = "";
            let galeryLength = responseData[i].gallery;
            if (responseData[i].profilePic) {
                new_obj.uri = responseData[i].profilePic;
            } else {
                let filteredGallery = _.filter(galeryLength, (image) => {
                    return _.includes(image.url, 'jpg') || _.includes(image.url, 'png') || _.includes(image.url, 'jpeg')
                })
                // console.log('filteredGallery', filteredGallery);
                if (filteredGallery && filteredGallery.length) {
                    new_obj.uri = filteredGallery[0].url;
                }
            }
            new_obj._id = responseData[i]._id;
            new_obj.fullName = responseData[i].fullName;
            new_obj.percentage = responseData[i].percentage;
            new_obj.age = responseData[i].age;
            // new_obj.uri = !responseData[i].gallery.length ? "https://facebook.github.io/react/logo-og.png" : responseData[i].gallery[0].url;
            new_array.push(new_obj);
        }
        !users.data
            ?
            this.setState({
                // noItemFound: true,
                filterModal: false
            })
            :
            this.setState({
                userList: new_array,
                noItemFound: false,
                filterModal: false,
            })
    }
    matchpicks() { }
    activitydate() { }
    newestfirst() { }
    age() { }
    distance() { }
    handleZipcode = (zipcode) => {
        console.log("i am from home zipcode", zipcode)
        this.state.zipcode = '';
        this.setState({ zipcode })
    }
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
                            isSearcrchbar={false}
                            left={
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.openDrawer()}
                                    style={{
                                        width: "15%",
                                        backgroundColor: "transparent",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                    <Menu />
                                </TouchableOpacity>
                            }
                            middle={
                                <View style={{ width: "55%", backgroundColor: "transparent", alignItems: "center", justifyContent: "center" }}>
                                    <Text style={{ fontFamily: "Avenir-Heavy", fontSize: 24, color: "#fff" }}>Discover</Text>
                                </View>
                            }
                            right={
                                <View style={{
                                    width: "30%",
                                    backgroundColor: "transparent",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "row"
                                }}>
                                    {/* <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}> */}
                                    <TouchableOpacity
                                        onPress={() => this.setState({ sortingModal: true })}
                                        style={{ flex: 1, height: 42, alignItems: "center", justifyContent: "center" }}>
                                        <Image
                                            source={sort_ascending}
                                            style={styles.popupmenu}
                                            resizeMethod="resize"
                                            resizeMode="contain" />
                                    </TouchableOpacity>
                                    {/* <PopupMenu
                                            button={sort_ascending}
                                            buttonStyle={styles.popupmenu}
                                            destructiveIndex={1}
                                            options={[""]}
                                            actions={[this.matchpicks, this.activitydate, this.newestfirst, this.age, this.distance]}
                                        /> */}
                                    {/* </View> */}
                                    {/* <TouchableOpacity
                                    onPress={() => this.setFilterValues()}
                                    style={{ flex:1}}>
                                    <Image
                                        source={require('../../images/icons/sort_ascending.png')}
                                        style={{ width: 17, height: 18, left: 5 }}
                                        resizeMethod="resize"
                                        resizeMode="contain" />
                                </TouchableOpacity>
                                 */}
                                    <TouchableOpacity
                                        onPress={() => this.setFilterValues()}
                                        style={{ flex: 1, height: 42, justifyContent: "center", alignItems: "center" }}>
                                        <Image
                                            source={require('../../images/filter.png')}
                                            style={{ width: 17, height: 18, left: 0 }}
                                            resizeMethod="resize"
                                            resizeMode="contain" />
                                    </TouchableOpacity>
                                </View>
                            }
                        />
                    </SafeAreaView>
                </LinearGradient>
                {/* <SearchButton navigation={this.props.navigation} /> */}
                <View style={{ backgroundColor: "transparent", top: 0 }}>
                    <Userlist
                        userList={this.state.userList}
                        is_loading={this.state.is_loading}
                        navigation={this.props.navigation} />
                </View>
                <SafeAreaView style={{ backgroundColor: "#fff" }} />
                <Modal
                    backdropOpacity={0.3}
                    isVisible={this.state.filterModal}
                    onSwipe={() => this.setState({ filterModal: false })}
                    swipeDirection="down"
                    scrollTo={this.handleScrollTo}
                    onBackdropPress={() => this.setState({ filterModal: false })}
                    onBackButtonPress={() => this.setState({ filterModal: false })}
                    style={styles.bottomModal}>
                    <View style={{ height: '90%', backgroundColor: "#FFF" }}>
                        <ScrollView contentContainerStyle={{ flex: 1 }}>
                            <Filter
                                getFilteredUsers={this.getFilteredUsers.bind(this)}
                                closemodal={() => this.setState({ filterModal: false })}
                                profilematch={this.changeProfilematch.bind(this)}
                                profilematch_values={this.state.profilematch}
                                multiSliderValuesChange={this.multiSliderValuesChangematch.bind(this)}
                                agerange_values={this.state.agerange}
                                zipcode={this.state.zipcode}
                                is_today={this.state.today}
                                is_week={this.state.week}
                                is_month={this.state.month}
                                resetFilter={this.resetFilter.bind(this)}
                                updateToday={this.updateToday.bind(this)}
                                handleZipcode={this.handleZipcode.bind(this)}
                            // updateWeek={this.updateWeek.bind(this)}
                            // updateMonth={this.updateMonth.bind(this)}
                            />
                        </ScrollView>
                    </View>
                </Modal>
                <Modal
                    backdropOpacity={0.3}
                    isVisible={this.state.sortingModal}
                    onSwipe={() => this.setState({ sortingModal: false })}
                    swipeDirection="down"
                    scrollTo={this.handleScrollTo}
                    onBackdropPress={() => this.setState({ sortingModal: false })}
                    onBackButtonPress={() => this.setState({ sortingModal: false })}
                    style={styles.bottomModal}>
                    <View style={{ backgroundColor: "#FFF" }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", flex: 0 }}>
                            <TouchableOpacity onPress={() => this.setState({ sortingModal: false })} style={{ width: '20%', paddingHorizontal: 16, height: 54, justifyContent: 'center' }}>
                                <Image
                                    source={require('../../images/icons/downarrow.png')}
                                    style={{
                                        width: metrics.DEVICE_WIDTH * 0.0588,
                                        height: metrics.DEVICE_HEIGHT * 0.023
                                    }}
                                    resizeMethod="resize"
                                    resizeMode="contain" />
                            </TouchableOpacity>

                            <View style={{ width: '60%', height: 54, justifyContent: 'center', alignItems:"center" ,paddingHorizontal: 16 }}>
                                <Text style={{ fontFamily: "Avenir-Heavy", fontSize: 17, color: "#3E3E47" }}>Sort search</Text>
                            </View>
                            <View style={{ width: '20%', height: 54, justifyContent: 'center', paddingHorizontal: 16 }}/>

                        </View>
                        {/* soting View */}
                        {
                            sortarray.map((value, index) => {
                                return <TouchableOpacity onPress={() => alert("in progress")} style={{
                                    backgroundColor: "transparent", height: 42, justifyContent: 'center', alignItems: "flex-start", paddingHorizontal: 16,
                                    borderBottomWidth: 1, borderColor: "#CED0CE"
                                }} key={index}>
                                    <Text style={{ color: "#000" }}> {value} </Text>
                                </TouchableOpacity>

                            })
                        }
                    </View>
                </Modal>

            </View>
        );
    }
    async resetFilter() {
        await AsyncStorage.removeItem('localfilter');
        this.setState({
            zipcode: '',
            location: {},
            profilematch: [0],
            agerange: [18, 100],
            today: false,
            week: false,
            month: false
        })
    }

    updateToday(key) {
        this.setState({
            [key]: !this.state[key]
        })
    }
    // updateWeek() {
    //     this.setState({
    //         week: !this.state.week
    //     })
    // }
    // updateMonth() {
    //     this.setState({
    //         month: !this.state.month
    //     })
    // }
    changeProfilematch(values) {
        this.setState({
            profilematch: values
        })
    }
    multiSliderValuesChangematch(values) {
        this.setState({
            agerange: values
        })
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255, 100)',
    },
    bottomModal: {
        justifyContent: "flex-end",
        margin: 0
    },
    popupmenu: {
        width: 30,
        height: 30,
        // margin: 7.5,
        resizeMode: "contain"
    },
});
mapStateToProps = (state) => {
    return {
        language: state.language.defaultlanguage,
        data: state.auth.data,
        token: state.auth.token
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
