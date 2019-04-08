import React, { Component } from "react";
import { connect } from 'react-redux'
import { 
    View, 
    Text, 
    FlatList, 
    Image, 
    StyleSheet, 
    TextInput, 
    Platform, 
    TouchableOpacity, 
    Dimensions,
    RefreshControl
 } from "react-native";
import I18n from 'react-native-i18n';
import Modal from "react-native-modal";
import Loader from "../Loading/Loader";
import _ from 'lodash';
import {
    widthPercentageToDP,
    heightPercentageToDP,
} from 'react-native-responsive-screen';
import metrics from '../../config/metrics';
import ApiManager from "../Common/ApiManager";
import userImage from '../../images/Rectangle.png'
const IS_ANDROID = Platform.OS === 'android'

const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.47
const IMAGE_HEIGHT = metrics.DEVICE_HEIGHT * 0.284
let data = [
    {
        "id": 1,
        "name": "Bettie Fleming",
        "age": "Age, 29",
        "image": userImage
    }
]
class Userlist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_loading: true,
            data: [],
            page: 1,
            seed: 1,
            error: null,
            isRefreshing: false, //for pull to refresh
        };
    }
    componentDidMount() {
        this.setState({
            data: this.props.userList,
            is_loading: this.props.is_loading
        })
    }
    componentWillReceiveProps(nextState, nextProps) {
        // console.log("nextState_hello", nextState.userList)
        this.setState({
            data: nextState.userList,
            is_loading: this.props.is_loading,
            isRefreshing: false
        })
    }
    // makeRemoteRequest = () => {
    //     let header = {
    //         'Authorization': this.props.token,
    //     }
    //     ApiManager.callwebservice('GET', 'api/getMatchPercentage', header, '', (success) => {
    //         let response = JSON.parse(success._bodyInit);
    //         console.log("response", response)
    //         let newData = [];

    //         if (response.status === 0) {
    //             return
    //         } else if (response.status === 1) {
    //             console.log("newData", response.data.data)
    //             let responseData = response.data.data

    //             for (let i = 0; i < responseData.length; i++) {
    //                 newObj = {};
    //                 newObj.uri = "";
    //                 let galeryLength= responseData[i].gallery;                    
    //                 if(responseData[i].profilePic){
    //                         newObj.uri = responseData[i].profilePic;
    //                 } else {
    //                     let filteredGallery = _.filter(galeryLength, (image)=>{
    //                         return _.includes(image.url, 'jpg') || _.includes(image.url, 'png') || _.includes(image.url, 'jpeg')
    //                     })
    //                     if(filteredGallery && filteredGallery.length){
    //                         newObj.uri = filteredGallery[0].url;
    //                     }
    //                 }        
    //                 newObj._id = responseData[i]._id;
    //                 newObj.fullName = responseData[i].fullName;
    //                 newObj.age = responseData[i].age;
    //                 newData.push(newObj)
    //             }
    //         }
    //         this.setState({
    //             data: newData,
    //             is_loading: false,
    //         })
    //     }, (error) => {
    //         alert("netwrok fail")
    //         console.log("error", error)
    //     })
    // };
    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "86%",
                    backgroundColor: "#CED0CE",
                    marginLeft: "14%"
                }}
            />
        );
    };
    showUserProfile(userid) {
        let { navigate } = this.props.navigation
        navigate("userprofile", { userId: userid })
    }
    renderRow = (item) => {
        const { language }=this.props;
        let width = Dimensions.get('screen').width/2 - 12;
        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => this.showUserProfile(item._id)}
                style={{
                    // flex: 1,
                    width:width,
                    justifyContent: 'flex-start',
                    marginHorizontal: '1.5%',
                    marginVertical: 11,//'2.5%',
                    borderRadius: 5,
                    height: IS_ANDROID ? heightPercentageToDP('38%') : metrics.DEVICE_HEIGHT * 0.351,
                    backgroundColor: '#FFF',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                    elevation: 3,
                }}>
                <View
                    style={{
                        flex: 7.5,
                        backgroundColor: "transparent",
                        flexBasis: 50,
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5,
                        overflow: "hidden"
                    }}>
                    <Image source={!item.uri ? require('../../images/applogo.png') : item}
                        style={{
                            flex: 1,
                            width: null,
                            height: null,
                        }}
                        resizeMethod="resize"
                    />
                </View>
                <View style={{flex: 2.5, justifyContent: "space-around", paddingHorizontal: 8, backgroundColor:"transparent", marginVertical:8}}>
                    <Text style={{ color: "#3E3E47", fontSize: 15, fontFamily: "Avenir-Heavy", lineHeight: 22 }}>{item.fullName}</Text>
                    <Text style={{ color: "#909096", fontSize: 13, fontFamily: "Avenir-Book", lineHeight: 22 }}>{ I18n.t('agetitle', { locale: language })}, {item.age}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    render() {
        if (!this.state.data.length) {
            return (
                <>
                    <Text style={{ alignSelf: "center", marginTop: 25 }}>No match found</Text>
                </>
            )
        }
        return (
            <>
                <FlatList
                    columnWrapperStyle={{ justifyContent: 'space-between', alignItems:'flex-start' }}
                    contentContainerStyle={{ paddingBottom: 150 }}
                    horizontal={false}
                    data={this.state.data}
                    numColumns={2}
                    renderItem={({ item }) => this.renderRow(item)}
                    keyExtractor={(item, index) => index.toString()}
                    refreshControl={
                        <RefreshControl
                        refreshing={this.state.isRefreshing}
                        onRefresh={this.props.onRefresh}
                        />
                    }
                // ItemSeparatorComponent={this.renderSeparator}
                // ListHeaderComponent={<Header />}
                // ListFooterComponent={<Footer />}
                // onEndReached={() => dispatchFetchPage()}
                />
                <Modal
                    isVisible={this.state.is_loading}
                    scrollTo={this.handleScrollTo}
                    style={{ alignItems: "center", justifyContent: "center" }}>
                    <Loader />
                </Modal>
            </>
        );
    }
}
let styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: "#009933",
        borderColor: '#CCC',
    },
    list: {
    }
})
mapStateToProps = (state) => {
    return {
        language: state.language.defaultlanguage,
        data: state.auth.data,
        token: state.auth.token
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Userlist);

