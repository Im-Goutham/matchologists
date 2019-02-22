import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    Text,
    SafeAreaView,
    AsyncStorage,
    ScrollView,
    Platform
} from 'react-native'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import I18n from 'react-native-i18n';
import CustomSlider from 'react-native-custom-slider';
import { GooglePlacesAutocomplete } from '../Common/Autocomplete';
import metrics from '../../config/metrics';
import CustomButton from '../CustomButton'
import LinearGradient from 'react-native-linear-gradient';
import ApiManager from '../Common/ApiManager';
import BaseFormComponent from "../Common/BaseFormComponent";
import * as actions from "../Home/filter.actions";
import { TextInputMask } from 'react-native-masked-text'

const IMAGE_WIDTH = metrics.DEVICE_WIDTH
const dev_height = metrics.DEVICE_HEIGHT
let IS_ANDROID = Platform.OS === 'android'

const homePlace = {
    description: 'Home',
    geometry: { location: { lat: 48.8152937, lng: 2.4597668 } },
};
const workPlace = {
    description: 'Work',
    geometry: { location: { lat: 48.8496818, lng: 2.2940881 } },
};
let data = {};
class Filter extends BaseFormComponent {
    constructor(props) {
        super(props);
        this.state = {
            lastlogin: { "today": false, "week": false, "month": false },
            location: {},
            profilematch: [],
            is_profilematchChange: false,
            agerange: [0, 0],
            is_agerangeChange: false,
            today: false,
            is_todayChange: false,
            week: false,
            is_weekchange: false,
            month: false,
            is_monthChange: false,
            zipcode:''
        }
    }
    async componentDidMount() {
        var filterlocalstorage = await AsyncStorage.getItem('localfilter');
        if (filterlocalstorage && typeof filterlocalstorage == "string") {
            filterlocalstorage = JSON.parse(filterlocalstorage);
            console.log('filterlocalstorage', filterlocalstorage);
        filterlocalstorage && filterlocalstorage.lastLogin ? this.setState({ lastlogin: filterlocalstorage.lastLogin}): undefined;
        data = filterlocalstorage;
        }
        this.setState({
            zipcode : this.props.zipcode,
            profilematch: this.props.profilematch_values,
            agerange: this.props.agerange_values,
            today: this.props.is_today,
            week: this.props.is_week,
            month: this.props.is_month,
        })
    }
    componentWillReceiveProps(nextProps, nextState) {
        this.setState({
            profilematch: nextProps.profilematch_values,
            agerange: nextProps.agerange_values,
            today: nextProps.is_today,
            week: nextProps.is_week,
            month: nextProps.is_month
        })
    }
    isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
    validate() {
        const { location, is_profilematchChange, is_agerangeChange, today, week, month } = this.state;
        if (!is_profilematchChange) {
            return false
        }
        return true
    }
    makeRemoteRequest = async () => {
        // const { location, profilematch, agerange, today, week, month } = this.state;
        let header = {
            'Authorization': this.props.token,
        }
        // this.props.saveCurrentFilter(data)
        await AsyncStorage.setItem('localfilter', JSON.stringify(data));

        console.log(" datafilterProfileUsers", data)
        // if (this.validate()) {
        ApiManager.callwebservice('POST', 'api/filterProfileUsers', header, data, (success) => {
            let response = JSON.parse(success._bodyInit);
            // this.props.closemodal()
            console.log("response filterProfileUsers", response)
            if (response.status === 0) {
                return
            } else if (response.status === 1) {
                this.props.getFilteredUsers(response)
            }
        }, (error) => {
            console.log("error", error)
        })
        // }
    };
    profileValuesChange = values => {
        data.matchPercentage = parseInt(values.toString())
        this.setState({
            profilematch: values,
            is_profilematchChange: true
        }, () => this.props.profilematch(values));
    }
    multiSliderValuesChange = values => {
        data.age = { "min": values[0], "max": values[1] }
        this.props.multiSliderValuesChange(values)
    };
    selectPlace(details) {
        let location = details.geometry.location
        this.setState({ location })
    }
    todayFilter(key, value) {
        let lastlogin = this.state.lastlogin;
        lastlogin[key] = !lastlogin[key];
        this.props.updateToday(key);
        this.setState({ ['lastlogin.' + key]: lastlogin[key] });
        data.lastLogin = lastlogin;

        console.log("data=>", data)

        // console.log('this.state key', key);
        // console.log('this.state', this.state[key]);
        // data.lastLogin = { "today": this.state[key], "week": week, "month": month }
        // data.lastLogin[key] = value; 


        // this.setState({
        //     is_todayChange: !this.state.is_todayChange
    }
    changevalueStart(values){
        console.log("changevalueStart", values)

    }
    onValuesChangeFinish(values){
        console.log("onValuesChangeFinish", values)

    }
    handleZipcode=(zipcode)=>{
        data.zipcode = zipcode;
        this.props.handleZipcode(zipcode)
    }
    render() {
        const { language, isLoading, onLoginLinkPress, onSignupPress } = this.props;
        const { is_today, is_week, is_month } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => this.props.closemodal()}
                        style={{
                            width: "15%",
                            backgroundColor: "transparent",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                        <Image
                            source={require('../../images/icons/downarrow.png')}
                            style={{
                                width: metrics.DEVICE_WIDTH * 0.0588,
                                height: metrics.DEVICE_HEIGHT * 0.023
                            }}
                            resizeMethod="resize"
                            resizeMode="contain" />
                    </TouchableOpacity>
                    <View style={{ width: "65%", backgroundColor: "transparent", alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ fontFamily: "Avenir-Heavy", fontSize: 17, color: "#3E3E47" }}>{I18n.t('filterTitle', { locale: language })}</Text>
                    </View>
                    <View style={{
                        width: "20%",
                        backgroundColor: "transparent",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <Text style={{ fontFamily: "Avenir-Medium", fontSize: 15, color: "#D43C87" }} onPress={() => {this.props.resetFilter(), data={}}} >Clear</Text>
                    </View>
                </View>
                <ScrollView style={{}}>
                    <View style={styles.searchBox}>
                    <Text style={styles.label}>{I18n.t('pincodelabel', { locale: language })}</Text>

                        {/* <Text style={styles.label}>{I18n.t('locationLabel', { locale: language })}</Text> */}
                        <View style={{ marginTop: 8 }} />
                        {/* <GooglePlacesAutocomplete
                            placeholder="Search"
                            minLength={2} // minimum length of text to search
                            autoFocus={false}
                            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                            listViewDisplayed="false" // true/false/undefined
                            fetchDetails={true}
                            renderDescription={row => row.description} // custom description render
                            onPress={(data, details = null) => {
                                this.selectPlace(details)
                            }}
                            getDefaultValue={() => {
                                return ''; // text input default value
                            }}
                            query={{
                                key: 'AIzaSyBU5Uwb57A6jXutEHzAo8I3T7gRVbs8qHo',
                                language: 'en', // language of the results
                                types: '(cities)', // default: 'geocode'
                            }}
                            styles={autocompleteStyle}
                            currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
                            currentLocationLabel=""
                            nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                            GoogleReverseGeocodingQuery={{
                                // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                            }}
                            GooglePlacesSearchQuery={{
                                // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                                rankby: 'distance',
                                types: 'food',
                            }}
                            filterReverseGeocodingByTypes={[
                                'locality',
                                'administrative_area_level_3',
                            ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                            predefinedPlaces={[]}
                            debounce={200}
                        /> */}
                        <View style={autocompleteStyle.textInputContainer}>
                        <TextInputMask
                                                ref={(ref) => { this._input = ref ? ref._inputElement : ref }}
                                                type={"custom"}
                                                keyboardType={"numeric"}
                                                style={[styles.input]}
                                                selectionColor={'#696969'}
                                                value={this.props.zipcode}
                                                onChangeText={this.handleZipcode.bind(this)}
                                                // onChangeText={(pincode) => {
                                                //     this.setState({ pincode })
                                                // }}
                                                returnKeyType={'done'}
                                                options={{ mask: "99999" }}
                                            />
                                            </View>

                    </View>
                    <View style={{ paddingHorizontal: 16, alignSelf: "center", marginTop: 80 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'space-between' }}>
                            <Text style={{ fontFamily: "Avenir-Medium", fontSize: 11, color: "#D43C87", flexWrap: 'wrap' }}>{I18n.t('matchProfileLabel', { locale: language })} %</Text>
                            <Text style={{ fontFamily: "Avenir-Medium", fontSize: 17, color: "#909096" }}> {this.state.profilematch}%</Text>
                        </View>
                        <View style={{ paddingHorizontal: 5, }}>
                            <CustomSlider
                                trackStyle={{
                                    height: 7,
                                    borderRadius: 3,
                                    backgroundColor: '#EFEFEF',
                                }}
                                selectedStyle={{
                                    backgroundColor: '#D43C87',
                                }}
                                pressedMarkerStyle={{
                                    top: 3,
                                    width: 36,
                                    height: 36,
                                    borderRadius: 18,
                                    backgroundColor: "#D43C87",
                                    borderWidth: 4,
                                    borderColor: "#FFF"
                                }}
                                markerStyle={{
                                    top: 3,
                                    width: 36,
                                    height: 36,
                                    borderRadius: 18,
                                    backgroundColor: "#D43C87",
                                    borderWidth: 4,
                                    borderColor: "#FFF"
                                }}
                                values={[this.props.profilematch_values[0]]}
                                sliderLength={metrics.DEVICE_WIDTH * 0.9}
                                onValuesChange={this.profileValuesChange}
                                min={0}
                                max={100}
                                step={1}
                                allowOverlap
                                snapped
                            />

                        </View>
                    </View>
                    <View style={{ paddingHorizontal: 10, alignSelf: "center" }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'space-between' }}>
                            <Text style={{ fontFamily: "Avenir-Medium", fontSize: 11, color: "#D43C87" }}>{I18n.t('ageRangeLabel', { locale: language })}</Text>
                            <Text style={{ fontFamily: "Avenir-Medium", fontSize: 17, color: "#909096" }}> {this.state.agerange[0] + "- " + this.state.agerange[1]} {I18n.t('yearsLabel', { locale: language })} </Text>
                        </View>
                        <CustomSlider
                            trackStyle={{
                                height: 7,
                                borderRadius: 3,
                                backgroundColor: '#EFEFEF',
                            }}
                            // customMarkerLeft={(e) =>{
                            //    return <View>
                            //         <Text>left</Text>
                            //     </View>
                            // }}
                            // customMarkerRight={(e) =>{
                            //     return <View style={{
                            //         top: 3,
                            //         width: 36,
                            //         height: 36,
                            //         borderRadius: 18,
                            //         backgroundColor: "#D43C87",
                            //         borderWidth: 4,
                            //         borderColor: "#FFF"
                            //     }}/>
                            // }}
                            selectedStyle={{
                                backgroundColor: '#D43C87',
                            }}
                            pressedMarkerStyle={{
                                top: 3,
                                width: 36,
                                height: 36,
                                borderRadius: 18,
                                backgroundColor: "#D43C87",
                                borderWidth: 4,
                                borderColor: "#FFF"
                            }}
                            markerStyle={{
                                top: 3,
                                width: 36,
                                height: 36,
                                borderRadius: 18,
                                backgroundColor: "#D43C87",
                                borderWidth: 4,
                                borderColor: "#FFF"
                            }}
                            values={[
                                this.props.agerange_values[0],
                                this.props.agerange_values[1],
                            ]}
                            // stepLength={5}
                            sliderLength={metrics.DEVICE_WIDTH * 0.9}
                            onValuesChange={this.multiSliderValuesChange}
                            // onValuesChange={this.props.multiSliderValuesChange}
                            onValuesChangeStart={this.changevalueStart}
                            onValuesChangeFinish={this.onValuesChangeFinish}
                            min={18}
                            isMarkersSeparated={true}
                            enabledOne={true}
                            enabledTwo={true}
                            max={100}
                            step={2}
                            // allowOverlap={false}
                            snapped={false}                            
                            // onToggleOne={()=>alert("i am ebale")}
                            // onToggleTwo={()=>console.log()}
                        />

                    </View>
                    <View style={{ paddingHorizontal: 16 }}>
                        <Text style={{ fontFamily: "Avenir-Medium", fontSize: 11, color: "#D43C87" }}>{I18n.t('lastLoginLabel', { locale: language })}</Text>
                        <View style={{ marginTop: 8 }} />
                        <TouchableOpacity style={{ flexDirection: "row", height: 30, marginVertical: 5 }} onPress={() => this.todayFilter("today")}>
                            <Image source={is_today ? require('../../../assets/icons/checked.png') : require('../../../assets/icons/unchecked.png')} style={{ width: 24, height: 24 }} resizeMode="contain" resizeMethod="resize" />
                            <Text style={{ fontFamily: "Avenir-Medium", fontSize: 17, color: "#909096", marginHorizontal: 20 }}>{I18n.t('todayLabel', { locale: language })}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: "row", height: 30, marginVertical: 5 }} onPress={() => this.todayFilter("week")}>
                            <Image source={is_week ? require('../../../assets/icons/checked.png') : require('../../../assets/icons/unchecked.png')} style={{ width: 24, height: 24 }} resizeMode="contain" resizeMethod="resize" />
                            <Text style={{ fontFamily: "Avenir-Medium", fontSize: 17, color: "#909096", marginHorizontal: 20 }}>{I18n.t('weekLabel', { locale: language })}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: "row", height: 30, marginVertical: 5 }} onPress={() => this.todayFilter("month")}>
                            <Image source={is_month ? require('../../../assets/icons/checked.png') : require('../../../assets/icons/unchecked.png')} style={{ width: 24, height: 24 }} resizeMode="contain" resizeMethod="resize" />
                            <Text style={{ fontFamily: "Avenir-Medium", fontSize: 17, color: "#909096", marginHorizontal: 20 }}>{I18n.t('monthLabel', { locale: language })}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 8 }} />
                    <View style={{ paddingHorizontal: 16 }}>
                        <Text style={{ fontFamily: "Avenir-Medium", fontSize: 11, color: "#D43C87" }}>{I18n.t('aboutparnerLabel', { locale: language })}</Text>
                        <TouchableOpacity onPress={()=>alert('in Progress')}>
                    <Image source={require('../../images/applogo.png')} style={{ width:120, height:120}} resizeMethod="resize" resizeMode="contain"/>
                    </TouchableOpacity>
                    </View>

                    <LinearGradient
                        colors={['#DB3D88', '#273174']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            width: 300,
                            borderRadius: 5,
                            alignSelf: "center",
                            marginVertical: 20
                            // marginBottom : IS_ANDROID ? 30 :20
                        }}>
                        <CustomButton
                            textStyle={{ color: "#fff", fontFamily: "Avenir-Heavy", fontSize: 17 }}
                            onPress={() => this.makeRemoteRequest()}
                            // style={{ backgroundColor: "#009933" }}
                            text={"APPLY"} />
                    </LinearGradient>
                    <SafeAreaView />
                </ScrollView>
            </View>
        )
    }
}
const autocompleteStyle = {
    container: {
        flex: 1,
    },
    textInputContainer: {
        paddingHorizontal: 16,
        backgroundColor: 'transparent',
        width: IMAGE_WIDTH,
        borderTopColor: '#7e7e7e',
        borderBottomColor: '#b5b5b5',
        borderTopWidth: 0,
        borderBottomWidth: 0,
        flexDirection: 'row',
    },
    textInput: {
        backgroundColor: '#F5F5F5',
        width: IMAGE_WIDTH - 32,
        borderRadius: 5,
        height: 44,
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: IS_ANDROID ? 5 : 5,
        paddingRight: 0,
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
        fontSize: 15,
        //   flex: 1
    },
    poweredContainer: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        backgroundColor: '#FFFFFF',
    },
    powered: {},
    listView: {},
    row: {
        paddingHorizontal: 16,
        height: 44,
        flexDirection: 'row',
        backgroundColor: "#FFF",
        justifyContent: "center",
        alignItems: "center"
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#c8c7cc',
    },
    description: {},
    loader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        height: 20,
    },
    androidLoader: {
        marginRight: -15,
    },
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 64,
        flexDirection: "row"
    },
    searchBox: {
        top: 0,
        left: 0,
        position: "absolute",
        zIndex: 10,
        flex: 1,
        justifyContent: 'center',
    },
    label: {
        lineHeight: 15,
        color: "#D43C87",
        fontFamily: "Avenir-Medium",
        fontSize: 11,
        paddingHorizontal: IS_ANDROID ? 19 : 16
    },
    input: {
        alignSelf:"center",
        backgroundColor: "#F5F5F5",
        marginTop: 8,
        borderRadius: 5,
        margin: IS_ANDROID ? -1 : 0,
        height: 42,
        paddingVertical: 7,
        paddingHorizontal: IS_ANDROID ? 5 : 5,
        fontSize: 17,
        fontFamily: "Avenir-Medium",
        width: metrics.DEVICE_WIDTH - 32,
        color:"#909096"
    }
});
mapStateToProps = (state) => {
    return {
        language: state.language.defaultlanguage,
        data: state.auth.data,
        token: state.auth.token,
        filter: state.filter.filters
    }
}
mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ saveCurrentFilter: actions.saveCurrentFilter }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Filter);