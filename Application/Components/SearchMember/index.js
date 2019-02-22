/**
 * home page
 * Author :abhishekkalia
 */

import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    SafeAreaView,
    Text,
    ScrollView,
    View,
    Image,
    TextInput,
    FlatList,
    TouchableOpacity,
    AsyncStorage
} from 'react-native';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Modal from "react-native-modal";
import Header from '../Common/Header';
import _ from 'lodash';
import ApiManager from '../Common/ApiManager';
import BaseFormComponent from '../Common/BaseFormComponent';
import Loader from '../Loading/Loader';
import Filter from '../Home/filter';
import metrics from '../../config/metrics';
const IS_ANDROID = Platform.OS === 'android';
const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.05;
const header_height = metrics.DEVICE_HEIGHT * 0.1;

class SearchMember extends BaseFormComponent {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            userList: [],
            noItemFound: false,
            visibleModal: false,
            scrollOffset: '',
            is_loading: true,
            profilematch: [0],
            agerange: [18, 100],
            today: false,
            week: false,
            month: false
        }
    }
    componentDidMount() {
        this.getVisitUserList()
    }
    async setFilterValues() {
        var filterlocalstorage = await AsyncStorage.getItem('localfilter');
        if (filterlocalstorage && typeof filterlocalstorage == "string") {
            filterlocalstorage = JSON.parse(filterlocalstorage);
            console.log('filterlocalstorage', filterlocalstorage);
            this.setState({
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
        this.setState({ visibleModal: !this.state.visibleModal })
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
    validate() {
        const { username } = this.state;
        if (!username.length) {
            return false
        }
        return true
    }
    getVisitUserList = () => {
        let header = {
            'Authorization': this.props.token,
        }
        ApiManager.callwebservice('GET', 'api/getVisitedProfileUser', header, '', (success) => {
            let response = JSON.parse(success._bodyInit);
            let newData = [];
            if (response.status === 0) {
                // return
                this.setState({
                    userList: [],
                    is_loading: false,
                })

            } else if (response.status === 1) {
                let responseData = response.data;
                for (let i = 0; i < responseData.length; i++) {
                    newObj = {};
                    let galeryLength = responseData[i].gallery;

                    newObj.uri = "";
                    if (responseData[i].profilePic) {
                        newObj.uri = responseData[i].profilePic;
                    } else {
                        let filteredGallery = _.filter(galeryLength, (image) => {
                            return _.includes(image.url, 'jpg') || _.includes(image.url, 'png') || _.includes(image.url, 'jpeg')
                        })
                        console.log('filteredGallery', filteredGallery);
                        if (filteredGallery && filteredGallery.length) {
                            newObj.uri = filteredGallery[0].url;
                        }
                    }
                    newObj._id = responseData[i]._id;
                    newObj.fullName = responseData[i].fullName;
                    newObj.fullName = responseData[i].fullName;
                    newObj.percentage = responseData[i].percentage;
                    newData.push(newObj)
                }
            }
            console.log("responseData newData", newData);
            this.setState({
                userList: newData,
                is_loading: false,
            })
        }, (error) => {
            console.log("error", error)
        })
    }

    makeremoteCall() {
        const { username } = this.state;
        header = {
            'Authorization': this.props.token,
            'Content-Type': 'application/json'
        };
        let details = {
            "name": username
        };
        if (this.validate()) {
            ApiManager.callwebservice('POST', 'api/searchProfileUserByName', header, details, (success) => {
                let response = JSON.parse(success._bodyInit);
                if (response.status === 0) {
                    this.showSimpleMessage("danger", { backgroundColor: "#DC6666" }, response.message, response.message)
                } else if (response.status === 1) {
                    let responseData = response.data.data;
                    console.log("responseData", responseData)
                    let new_array = [];
                    for (let i = 0; i < responseData.length; i++) {
                        console.log("responseData_gallery", responseData[i])
                        let new_obj = {};
                        new_obj._id = responseData[i]._id;
                        new_obj.fullName = responseData[i].fullName;
                        new_obj.percentage = responseData[i].percentage;
                        new_obj.uri = !responseData[i].gallery.length ? "https://facebook.github.io/react/logo-og.png" : responseData[i].gallery[0].url;
                        new_array.push(new_obj);
                    }
                    !response.data
                        ?
                        this.setState({ noItemFound: true })
                        :
                        this.setState({
                            userList: new_array,
                            noItemFound: false
                        })
                }
                this.setState({
                    is_loading: false
                })
            }, (error) => {
                this.setState({
                    userList: [],
                    is_loading: false,
                })
                // console.log("error", error)
            })
        } else {
            this.setState({
                is_loading: false,
                userList: []
            })
        }
    }
    handleChange = (text) => {
        this.setState({
            username: text,
            is_loading: true
        }, () => this.makeremoteCall())
        if (text.length < 1) {
            // alert("hello call me")
            this.getVisitUserList()
        }
    }
    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1, //StyleSheet.hairlineWidth,
                    width: "80%",
                    backgroundColor: "#EFEFEF",
                    marginLeft: "20%"
                }}
            />
        );
    };
    getFilteredUsers(users) {
        // console.log("getFilteredUsers", users)
        let responseData = users.data && users.data.data ? users.data.data : [];
        console.log("responseData", responseData)
        let new_array = [];
        for (let i = 0; i < responseData.length; i++) {
            console.log("responseData_gallery", responseData[i])
            let new_obj = {};
            new_obj.uri = "";
            if (responseData[i].profilePic) {
                new_obj.uri = responseData[i].profilePic;
            } else if (responseData[i].gallery.length) {
                new_obj.uri = responseData[i].gallery[0].url;
            }
            new_obj._id = responseData[i]._id;
            new_obj.fullName = responseData[i].fullName;
            new_obj.percentage = responseData[i].percentage;
            new_obj.uri = !responseData[i].gallery.length ? "https://facebook.github.io/react/logo-og.png" : responseData[i].gallery[0].url;
            new_array.push(new_obj);
        }
        !users.data
            ?
            this.setState({
                noItemFound: true,
                visibleModal: false
            })
            :
            this.setState({
                userList: new_array,
                noItemFound: false,
                visibleModal: false,
            })
    }
    showUserProfile(userid) {
        let { navigate } = this.props.navigation
        navigate("userprofile", { userId: userid })
    }
    renderRow(item) {
        console.log("item", item)
        return (
            <TouchableOpacity onPress={() => this.showUserProfile(item._id)} style={{
                flex: 1,
                flexDirection: "row",
                marginVertical: 10,
            }}>
                <View style={{ width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
                    <Image
                        style={{ height: "100%", width: "100%", flex: 1, borderRadius: 30, }}
                        source={item.uri ? item : require('../../images/applogo.png')}
                        resizeMethod="resize"
                        resizeMode="cover"
                    />
                </View>
                <View style={{ paddingHorizontal: 10, justifyContent: "space-around" }}>
                    <Text style={{ fontFamily: "Avenir-Heavy", fontSize: 17, color: "#3E3E47" }}> {item.fullName}</Text>
                    <Text style={{ fontFamily: "Avenir-Medium", fontSize: 15, color: "#909096" }}>{item.percentage}% match</Text>
                </View>
            </TouchableOpacity>
        )
    }
    render() {
        const { goBack } = this.props.navigation;
        const { is_loading, noItemFound } = this.state;
        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={['#DB3D88', '#273174']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        // marginBottom : IS_ANDROID ? 30 :20
                    }}>
                    <SafeAreaView />
                    <Header
                        isSearcrchbar={true}
                        left={
                            <TouchableOpacity
                                onPress={() => goBack()}
                                style={{
                                    width: "15%",
                                    // backgroundColor: "red",
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
                                // backgroundColor: "red",
                                justifyContent: "center",
                                alignItems: "center"
                            }} />
                        }
                    />
                </LinearGradient>
                <View
                    style={{
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 2,
                        elevation: 3,
                        position: "absolute",
                        zIndex: 1,
                        top: IS_ANDROID ? metrics.DEVICE_HEIGHT * 0.08 : (Platform.Version <= '10.3.3' ? metrics.DEVICE_HEIGHT * 0.1 : metrics.DEVICE_HEIGHT * 0.12),
                        width: metrics.DEVICE_WIDTH - 30,
                        alignSelf: "center",
                        backgroundColor: '#FFF',
                        borderRadius: 5,
                        height: 40,
                        flexDirection: "row"
                    }} >
                    <View style={{
                        paddingHorizontal: 10,
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <Image
                            source={require('../../images/icons/search.png')}
                            style={{
                                height: 26,
                                width: 26,
                                // backgroundColor: 'red',
                            }}
                            resizeMethod="resize"
                            resizeMode="contain" />
                    </View>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            // backgroundColor:"#009933"
                        }}>
                        <TextInput
                            placeholder="Search..."
                            ref={(ref) => this.textInputRef = ref}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            style={{ height: 40, flex: 1 }}
                            underlineColorAndroid={'transparent'}
                            placeholderTextColor={'#909096'}
                            selectionColor={'#909096'}
                            onChangeText={(value) => this.handleChange(value)}
                            onFocus={() => this.setState({ isFocused: true })}
                            onBlur={() => this.setState({ isFocused: false })}
                        />
                    </View>
                </View>
                <View style={{ paddingHorizontal: 16,backgroundColor: "transparent", top: 30, height: 52, flexDirection: "row", justifyContent: "space-between"}}>
                        <View style={{ flex: 1, alignItems:"flex-start", justifyContent: 'center' }}>
                            <Text style={{ fontFamily: "Avenir-Medium", fontSize: 15, color: "#C1C0C9" }}>RECENT</Text>
                        </View>
                        <TouchableOpacity style={{ flex: 1, backgroundColor: "transparent", alignItems:"flex-end", justifyContent: 'center'   }} onPress={() => this.setFilterValues()}>
                            <Text style={{ fontFamily: "Avenir-Medium", fontSize: 15, color: "#D43C87" }}>FILTER</Text>
                        </TouchableOpacity>
                </View>

                {
                    is_loading ?
                        <View style={{ backgroundColor: "transparent", top: 30, justifyContent: 'center', alignItems: "center" }}>
                            <Loader />
                        </View>
                        :
                        !this.state.userList.length ?
                            <Text style={{ alignSelf: "center", marginTop: 25 }}>No match found</Text>
                            :
                            <View style={{ top: 30 }}>
                                {/* <View style={{ paddingHorizontal: 10, flexDirection: "row", justifyContent: "space-between" }}>
                                    <Text style={{ fontFamily: "Avenir-Medium", fontSize: 15, color: "#C1C0C9" }}>
                                        RECENT</Text>
                                    <TouchableOpacity style={{ paddingBottom: 25, paddingHorizontal: 15, }} onPress={() => this.setState({ visibleModal: true })}>
                                        <Text style={{ fontFamily: "Avenir-Medium", fontSize: 15, color: "#D43C87" }}>
                                            Filter</Text>
                                    </TouchableOpacity>
                                </View> */}
                                <FlatList
                                    contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 150 }}
                                    data={this.state.userList}
                                    renderItem={({ item }) => this.renderRow(item)}
                                    keyExtractor={(item, index) => index.toString()}
                                    ItemSeparatorComponent={this.renderSeparator}
                                />
                            </View>
                }
                <SafeAreaView style={{ backgroundColor: "#fff" }} />
                <Modal
                    isVisible={this.state.visibleModal}
                    onSwipe={() => this.setState({ visibleModal: false })}
                    swipeDirection="down"
                    scrollTo={this.handleScrollTo}
                    style={styles.bottomModal}>
                    <View style={{ height: '90%', backgroundColor: "#FFF" }}>
                        <ScrollView contentContainerStyle={{ flex: 1 }}>
                            <Filter
                                getFilteredUsers={this.getFilteredUsers.bind(this)}
                                closemodal={this.setFilterValues.bind(this)}
                                profilematch={this.changeProfilematch.bind(this)}
                                profilematch_values={this.state.profilematch}
                                multiSliderValuesChange={this.multiSliderValuesChangematch.bind(this)}
                                agerange_values={this.state.agerange}
                                is_today={this.state.today}
                                is_week={this.state.week}
                                is_month={this.state.month}
                                resetFilter={this.resetFilter.bind(this)}
                                updateToday={this.updateToday.bind(this)}
                            // updateWeek={this.updateWeek.bind(this)}
                            // updateMonth={this.updateMonth.bind(this)}
                            />
                        </ScrollView>
                    </View>
                </Modal>
            </View>
        );
    }
    async resetFilter() {
        await AsyncStorage.removeItem('localfilter');    
        this.setState({
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
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    bottomModal: {
        justifyContent: "flex-end",
        margin: 0
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: "#009933",
        borderColor: '#CCC',
    },

});
mapStateToProps = (state) => {
    return {
        language: state.language.defaultlanguage,
        data: state.auth.data,
        token: state.auth.token,
        // filter: state.filter.filters //localstore
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SearchMember);