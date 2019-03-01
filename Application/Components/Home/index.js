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
    FlatList,
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
import * as global from '../../../global.json'
import sort_ascending from '../../images/icons/white-sort.png';
import ascending from '../../images/icons/ascending.png';
import desending from '../../images/icons/desending.png';

import { Close } from '../Common/Hamburger'

import SocketChat from '../Common/client';
const IS_ANDROID = Platform.OS === 'android'
import metrics from '../../config/metrics';
// const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.05
// const header_height = metrics.DEVICE_HEIGHT * 0.1

var sortarray = [
    { "label": "Match Picks", "key": "sortPercentage", "order":null , "image": null},
    { "label": "Activity Date", "key": "sortActivityDate", "order":null , "image": null },
    { "label": "Newest First", "key": "sortNewest", "order":null , "image": null },
    { "label": "Age", "key": "sortAge", "order":null, "image": null },
    { "label": "Distance", "key": "sortDistance", "order":null, "image": null },
];
let data = {};
let sortremotecallData = {}

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sortArray: sortarray,
            lastlogin: { "today": false, "week": false, "month": false },
            sortingbyobjects:null,
            selectedquestions: [],
            questionsdata: [],
            userList: [],
            filterModal: false,
            sortingModal: false,
            questionanswerModal: false,
            scrollOffset: '',
            zipcode: '',
            profilematch: [0],
            agerange: [18, 100],
            today: false,
            week: false,
            month: false,
            is_loading: false,
            lastPress: 0
        }
    }
    componentDidMount() {
        var userId = this.props.data._id;
        SocketChat.userConnect(userId)
        this.readfilterdata()
            .then(() => this.sortAndFilterUsers())
            .then(() => this.getAboutYourPartnerQuestions());
            // .done()
    }
    readfilterdata = async () => {
        
        var filterlocalstorage = await AsyncStorage.getItem('localfilter');
        if (filterlocalstorage && typeof filterlocalstorage == "string") {
            filterlocalstorage = JSON.parse(filterlocalstorage);
            console.log("this.state.sortArray", this.state.sortArray);
            await _.map(this.state.sortArray, (sort)=>{
                if(_.has(filterlocalstorage, sort.key)){
                    sort.order = filterlocalstorage[sort.key];
                    sort.order == 'asc' ? sort.image = ascending : sort.order == "desc" ? sort.image = descending : sort.image = null;
                    console.log('sort in if ', sort);
                }
            });
            data = filterlocalstorage;
            console.log("filterlocalstorage", data)
            console.log("sortarray from local", sortarray);

            
            
            // for(var i=0; i< sortarrayData.length; i++){
            //     alert("sortarrayData")
            // }
            this.setState({
                selectedquestions: filterlocalstorage.filterQuestions ? filterlocalstorage.filterQuestions : [],
                sortArray: this.state.sortArray
            })
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
                selectedquestions: filterlocalstorage.filterQuestions ? filterlocalstorage.filterQuestions : [],
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
    sortAndFilterUsers = async () => {
        let header = {
            'Authorization': this.props.token,
        }
        let merged = {...data, ...sortremotecallData};
        console.log("merged_data", merged)
        await ApiManager.callwebservice('POST', 'api/sortAndFilterUsers', header, merged, (success) => {
            let response = JSON.parse(success._bodyInit);
            console.log("response sortAndFilterUsers", response)
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
    getAboutYourPartnerQuestions = async () => {
        let header = {
            'Authorization': this.props.token,
        }
        await ApiManager.callwebservice('GET', 'api/getAboutYourPartnerQuestions', header, '', (success) => {
            let response = JSON.parse(success._bodyInit);
            console.log("getAboutYourPartnerQuestionsresponse", response)
            let newData = [];
            if (response.status === 0) {
                return
            } else if (response.status === 1) {
                let responseData = response.data.data
                for (let i = 0; i < responseData.length; i++) {
                    newObj = {};
                    newObj._id = responseData[i]._id;
                    newObj.question = responseData[i].question;
                    newObj.identityKey = responseData[i].identityKey;
                    newData.push(newObj)
                }
            }
            this.setState({
                questionsdata: newData,
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
        data.zipcode = zipcode;
        this.state.zipcode = '';
        this.setState({ zipcode })
    }
    // matchProfilesortby = ( sortdata , indexvalue) => {
    //     var sortData = sortarray
    //     for(var i=0; i< sortData.length; i++){
    //         if(i === indexvalue){
    //             console.log("sortData[i]", sortData[i]);
    //             console.log("indexvalue", indexvalue);
    //             sortData[i].order = 'asc';
    //             sortData[i].image =ascending;
    //         }else{
    //             sortData[i].order =null;
    //             sortData[i].image =desending;
    //         }
    //     }
    //     var delta = new Date().getTime() - this.state.lastPress;
    //     if (delta < 200) {
    //         alert("doubletap happen")
    //         sortdata.order='desc'

    //         return false
    //     }
    //     this.setState({
    //         lastPress: new Date().getTime(),
    //         sortingbyobjects: sortdata
    //     })
    //     sortremotecallData={};
    //     // let indiani = sortdata.key;
    //     // data.sortdata.key = "desc";
    //     // console.log("hello sort by", this.state.sortingbyobjects)
    // }
    matchProfilesortbyNew = ( sortdata , indexvalue) => {
        console.log('sortdata', sortdata);
        _.map(this.state.sortArray, (sort)=>{
            if(!_.isEqual(sort.key, sortdata.key) ){
                sort.order = null;
                sort.image = null;
            }
           
        })
        if(sortdata && sortdata.key){
            if(sortdata.order == 'asc'){
                sortdata.order = "desc";
                sortdata.image = desending;
            }else if(sortdata.order == 'desc'){
                sortdata.order = null;
                sortdata.image = null;
            }else{
                sortdata.order = 'asc';
                sortdata.image = ascending;
            }
        }
       
        this.setState({
            sortingbyobjects: sortdata,
            sortArray: this.state.sortArray
        })
        sortremotecallData={};
    }
    // Deselectsortby=(sortdata , indexvalue)=>{
    //     var sortData = sortarray
    //     for(var i=0; i< sortData.length; i++){
    //         if(sortData[i]=== indexvalue){
    //         }else{
    //             sortData[i].order =null;
    //             sortData[i].image =desending;
    //         }
    //     }
    //     // if(sortdata.order===null){
    //     //     sortdata.order = 'desc';
    //     //     sortdata.image = desending;
    //     // }else{
    //     //     sortdata.order = null
    //     // }
    //     this.setState({
    //         sortingbyobjects: sortdata
    //     })
    //     sortremotecallData={};        
    // }
    sortResultRemoteCall= async() =>{
        sortremotecallData[this.state.sortingbyobjects.key] = this.state.sortingbyobjects.order;
        console.log("hello sort by", sortremotecallData)
        let merger = { ...data, ...sortremotecallData}
        await AsyncStorage.setItem('localfilter', JSON.stringify(merger));

        this.setState({
            sortingModal: false
        },()=>this.sortAndFilterUsers())
    }
    questionanswerModalToggle = () => {
        this.setState({
            questionanswerModal: !this.state.questionanswerModal
        })
    }
    DeselectAboutpartner(data) {
        let options = this.state.selectedquestions;
        let array_index = this.state.selectedquestions.indexOf(data._id)
        options.splice(array_index, 1);
        this.setState({
            selectedquestions: options
        })
    }
    selectAboutpartner(data) {
        var localdata = this.state.selectedquestions;
        // var localdata = [];
        localdata.push(data._id)
        this.setState({
            selectedquestions: localdata
        })
        console.log("selectAboutpartner", localdata)

    }
    conformQuestionSelection() {
        data.filterQuestions = this.state.selectedquestions;
        this.setState({
            questionanswerModal: false
        })
    }
    render() {
        const { navigate } = this.props.navigation;
        // console.log("sortingbyobjects", this.state.sortingbyobjects)
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
                                searchbyFilter={this.searchbyFilter.bind(this)}
                                questionanswerModalToggle={this.questionanswerModalToggle.bind(this)}
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
                            <View style={{ width: '60%', height: 54, justifyContent: 'center', alignItems: "center", paddingHorizontal: 16 }}>
                                <Text style={{ fontFamily: "Avenir-Heavy", fontSize: 17, color: "#3E3E47" }}>Sort search</Text>
                            </View>
                            <View style={{ width: '20%', height: 54, justifyContent: 'center', paddingHorizontal: 16 }} />
                        </View>
                        {/* soting View */}
                        {
                            this.state.sortArray.map((value, index) => {
                                console.log("value of sort", value)
                                return (
                                    <View key={index}>
                                        {
                                        //    value && value.order === "asc" ?
                                                <TouchableOpacity
                                                onPress={() => this.matchProfilesortbyNew(value, index)}
                                                style={{
                                                        backgroundColor: "transparent",
                                                        height: 42,
                                                        // justifyContent: 'center',
                                                        alignItems: "flex-start",
                                                        paddingHorizontal: 16,
                                                        borderBottomWidth: 1,
                                                        borderColor: "#CED0CE",
                                                        flexDirection:"row",
                                                        justifyContent:"space-between"

                                                    }} key={index}>
                                                    <Text style={{ color: value.order === "asc" ? "#DB3D88" : value.order === "desc"  ? "#009933" : "#909096" , fontSize: 17, fontFamily: 'Avenir-Medium'}}>{value.label} </Text>
                                                    <Image source={value.image} style={{ width:20, height:20, alignSelf:"center"}} resizeMethod="resize" resizeMode="contain"/>
                                                </TouchableOpacity>
                                                // :
                                                // <TouchableOpacity
                                                // onPress={() => this.matchProfilesortbyNew(value, index)}
                                                //     style={{
                                                //         backgroundColor: "transparent",
                                                //         height: 42,
                                                //         // justifyContent: 'center',
                                                //         alignItems: "flex-start",
                                                //         paddingHorizontal: 16,
                                                //         borderBottomWidth: 1,
                                                //         borderColor: "#CED0CE",
                                                //         flexDirection:"row",
                                                //         justifyContent:"space-between"
                                                //     }} key={index}>
                                                //     <Text style={{ color: "#909096", fontSize: 17, fontFamily: 'Avenir-Medium' }}>{value.label} </Text>
                                                //     <Image source={value.image} style={{ width:20, height:20, alignSelf:"center"}} resizeMethod="resize" resizeMode="contain"/>
                                                // </TouchableOpacity>
                                        }
                                    </View>
                                )
                            })
                        }
                    </View>
                    <View style={{ width: '100%', height: 62, justifyContent: 'center', padding: 16, backgroundColor: "#FFF" }}>
                        <LinearGradient
                            colors={[global.gradientprimary, global.gradientsecondry]}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 1 }}
                            style={[{ borderRadius: 5 }]}
                        >
                            <TouchableOpacity onPress={()=>this.sortResultRemoteCall()} style={{ width: '100%', height: 54, justifyContent: 'center', alignItems: "center" }}>
                                <Text style={{ color: "#FFF", fontSize: 17, fontFamily: 'Avenir-Medium' }}>View Result</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                </Modal>
                <Modal
                    backdropOpacity={0.3}
                    isVisible={this.state.questionanswerModal}
                    // onSwipe={() => this.setState({ questionanswerModal: false })}
                    // swipeDirection="down"
                    // scrollTo={this.handleScrollTo}
                    onBackdropPress={() => this.setState({ questionanswerModal: false })}
                    onBackButtonPress={() => this.setState({ questionanswerModal: false })}
                    style={{ padding: 0, margin: 0 }}>
                    <View style={{ flex: 1, backgroundColor: "#fff" }}>
                        <Header
                            isSearcrchbar={false}
                            left={
                                <TouchableOpacity
                                    onPress={() => this.questionanswerModalToggle()}
                                    style={{
                                        width: "15%",
                                        backgroundColor: "transparent",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                    <Image
                                        source={require('../../images/icons/backbutton.png')}
                                        style={{ width: 20, height: 19, left: 0 }}
                                        resizeMethod="resize"
                                        resizeMode="contain" />
                                </TouchableOpacity>
                            }
                            middle={
                                <View style={{ width: "70%", backgroundColor: "transparent", alignItems: "center", justifyContent: "center" }}>
                                    <Text style={{ fontFamily: "Avenir-Heavy", fontSize: 24, color: "#fff" }}>About Your Partner</Text>
                                </View>
                            }
                            right={
                                <View style={{
                                    width: "15%",
                                    backgroundColor: "transparent",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "row"
                                }} />
                            }
                        />
                        <View style={{
                            height: '90%',
                            justifyContent: "center",
                            // alignItems: "center", 
                            paddingVertical: 8
                        }}>
                            <ScrollView contentContainerStyle={{ flexWrap: 'wrap', flexDirection: "row" }}>
                                {
                                    this.renderRow()
                                }
                            </ScrollView >
                        </View>
                    </View>
                    <View style={{ height: "10%", paddingHorizontal: 32, justifyContent: "center", backgroundColor: "#FFF" }}>
                        <LinearGradient
                            colors={[global.gradientprimary, global.gradientsecondry]}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 1 }}
                            style={[{ borderRadius: 5, padding: 1, bottom: 0 }]}
                        >
                            <TouchableOpacity
                                style={[{ justifyContent: "center", alignItems: "center", height: 50 }]}
                                onPress={() => this.conformQuestionSelection()}
                            >
                                <Text style={[styles.answerTxt, { color: '#FFF', fontFamily: 'Avenir-Heavy' }]} numberOfLines={1}>{"Save"}</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                </Modal>
            </View>
        );
    }
    renderRow = () => {
        return this.state.questionsdata.map((values, index) => {
            return (
                <View key={index}>
                    {
                        this.state.selectedquestions.indexOf(values._id) > -1 ?
                            <LinearGradient
                                colors={[global.gradientprimary, global.gradientsecondry]}
                                start={{ x: 0, y: 1 }}
                                end={{ x: 1, y: 1 }}
                                style={[{
                                    marginHorizontal: 8,
                                    width: metrics.DEVICE_WIDTH / 2 - 18,
                                    height: 52,
                                    borderRadius: 26,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    // backgroundColor: 'rgb(233,233,234)',
                                    marginVertical: 12,
                                    padding: 1
                                }]}
                                key={index}
                            >
                                <TouchableOpacity
                                    style={[styles.answerBtn, { backgroundColor: "#FFF", height: 50 }]}
                                    onPress={() => this.DeselectAboutpartner(values)}
                                >
                                    <Text style={[styles.answerTxt, { color: '#909096', fontFamily: 'Avenir-Heavy' }]} numberOfLines={1}>{values.identityKey}</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                            :
                            <TouchableOpacity style={[styles.answerBtn, { backgroundColor: "rgba(244,244,244, 0.7)" }]}
                                onPress={() => this.selectAboutpartner(values)}
                                key={index}
                            >
                                <Text style={[styles.answerTxt, { color: '#909096', fontFamily: 'Avenir-Heavy' }]} numberOfLines={1}>{values.identityKey}</Text>
                            </TouchableOpacity>
                    }
                </View>
            )
        })
    }
    async resetFilter() {
        await AsyncStorage.removeItem('localfilter');
        this.setState({
            zipcode: '',
            location: {},
            profilematch: [0],
            selectedquestions: [],
            agerange: [18, 100],
            today: false,
            week: false,
            month: false,
            sortArray: sortarray
        })
    }

    updateToday(key) {
        let lastlogin = this.state.lastlogin;
        lastlogin[key] = !lastlogin[key];
        this.setState({
            [key]: !this.state[key],
            ['lastlogin.' + key]: lastlogin[key]
        });
        data.lastLogin = lastlogin;
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
        data.matchPercentage = parseInt(values.toString())
        console.log("i am changing", values)
        this.setState({
            profilematch: values
        })
    }
    multiSliderValuesChangematch(values) {
        data.age = { "min": values[0], "max": values[1] }
        console.log("here i am", values)
        this.setState({
            agerange: values
        })
    }
    searchbyFilter = async () => {
        this.setState({
            filterModal: !this.state.filterModal
        })
        await AsyncStorage.setItem('localfilter', JSON.stringify(data));
        this.sortAndFilterUsers()
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
    answerBtn: {
        // flex: 1,
        width: metrics.DEVICE_WIDTH / 2 - 20,
        marginHorizontal: 8,
        height: 52,
        borderRadius: 26,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'rgb(233,233,234)',
        marginVertical: 12
    },
    answerTxt: {
        marginHorizontal: 8,
        color: '#909096',
        fontSize: 17,
        fontFamily: 'Avenir-Medium',
    }
});
mapStateToProps = (state) => {
    return {
        language: state.language.defaultlanguage,
        data: state.auth.data,
        token: state.auth.token
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
