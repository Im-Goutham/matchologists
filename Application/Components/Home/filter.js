import React, { Component } from 'react';
import {
    View,
    Slider,
    StyleSheet,
    TouchableOpacity,
    Image,
    Text,
    SafeAreaView
} from 'react-native'
import CustomTextInput from '../CustomTextInput'
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import metrics from '../../config/metrics';
import CustomButton from '../CustomButton'
import LinearGradient from 'react-native-linear-gradient';

export default class Filter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location:"",
            value: 0,
            profilematch: [75],
            agerange: [0, 25],

        }
    }
    profileValuesChange = values => {
        this.setState({
            profilematch: values,
        });

    }
    multiSliderValuesChange = values => {
        this.setState({
            agerange: values,
        });
    };

    render() {
        const { isLoading, onLoginLinkPress, onSignupPress } = this.props
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
                        <Text style={{ fontFamily: "Avenir-Heavy", fontSize: 17, color: "#3E3E47" }}>Filter</Text>
                    </View>
                    <View style={{
                        width: "20%",
                        backgroundColor: "transparent",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <Text style={{ fontFamily: "Avenir-Medium", fontSize: 15, color: "#D43C87" }}>Clear</Text>
                    </View>
                </View>
                <View style={{ flex: 1, justifyContent: "space-around" }}>
                    <View style={{ paddingHorizontal: 10 }}>
                        <Text style={{ fontFamily: "Avenir-Medium", fontSize: 11, color: "#D43C87" }}>LOCATION</Text>
                        <CustomTextInput
                            name={'location'}
                            value={this.state.location}
                            ref={(ref) => this.locationInputRef = ref}
                            placeholder={'Current Location'}
                            keyboardType={'default'}
                            editable={!isLoading}
                            returnKeyType={'next'}
                            blurOnSubmit={false}
                            withRef={true}
                            // onSubmitEditing={() => this.passwordInputRef.focus()}
                            onChangeText={(value) => this.setState({ location: value })}
                            isEnabled={!isLoading}
                        />
                    </View>
                    <View style={{ paddingHorizontal: 10, alignSelf: "center" }}>
                    <View style={{flexDirection:"row", alignItems:"center", justifyContent:'space-between'}}>
                    <Text style={{ fontFamily: "Avenir-Medium", fontSize: 11, color: "#D43C87", flexWrap: 'wrap' }}>PROFILE MATCH %</Text>
                        <Text style={{ fontFamily: "Avenir-Medium", fontSize: 17, color: "#909096" }}> {this.state.profilematch}%</Text>
                        </View>

                        <MultiSlider
                            trackStyle={{
                                height: 7,
                                borderRadius: 3,
                                backgroundColor: '#EFEFEF',
                            }}
                            selectedStyle={{
                                backgroundColor: '#D43C87',
                            }}
                            markerStyle={{
                                width: 36,
                                height: 36,
                                borderRadius: 18,
                                backgroundColor: "#D43C87",
                                borderWidth: 4,
                                borderColor: "#FFF"
                            }}
                            values={[this.state.profilematch[0]]}
                            sliderLength={metrics.DEVICE_WIDTH * 0.9}
                            onValuesChange={this.profileValuesChange}
                            min={0}
                            max={100}
                            step={1}
                            allowOverlap
                            snapped
                        />
                    </View>
                    <View style={{ paddingHorizontal: 10, alignSelf: "center" }}>
                        <View style={{flexDirection:"row", alignItems:"center", justifyContent:'space-between'}}>
                            <Text style={{ fontFamily: "Avenir-Medium", fontSize: 11, color: "#D43C87" }}>AGE RANGE</Text>
                            <Text style={{ fontFamily: "Avenir-Medium", fontSize: 17, color: "#909096" }}> {this.state.agerange[0] + "- " + this.state.agerange[1]} Years </Text>
                        </View>
                        <MultiSlider
                            trackStyle={{
                                height: 7,
                                borderRadius: 3,
                                backgroundColor: '#EFEFEF',
                            }}
                            selectedStyle={{
                                backgroundColor: '#D43C87',
                            }}
                            markerStyle={{
                                width: 36,
                                height: 36,
                                borderRadius: 18,
                                backgroundColor: "#D43C87",
                                borderWidth: 4,
                                borderColor: "#FFF"
                            }}
                            values={[
                                this.state.agerange[0],
                                this.state.agerange[1],
                            ]}
                            sliderLength={metrics.DEVICE_WIDTH * 0.9}
                            onValuesChange={this.multiSliderValuesChange}
                            min={0}
                            max={100}
                            step={1}
                            allowOverlap
                            snapped
                        />
                    </View>
                    <View style={{ paddingHorizontal: 10 }}>
                        <Text style={{ fontFamily: "Avenir-Medium", fontSize: 11, color: "#D43C87" }}>LAST LOGIN</Text>
                        <TouchableOpacity style={{ flexDirection: "row", height: 30, marginVertical:5 }}>
                            <Image source={require('../../../assets/icons/unchecked.png')} style={{ width: 24, height: 24 }} resizeMode="contain" resizeMethod="resize" />
                            <Text style={{ fontFamily: "Avenir-Medium", fontSize: 17, color: "#909096", marginHorizontal:20 }}>Today</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: "row", height: 30, marginVertical:5 }}>
                            <Image source={require('../../../assets/icons/unchecked.png')} style={{ width: 24, height: 24 }} />
                            <Text style={{ fontFamily: "Avenir-Medium", fontSize: 17, color: "#909096", marginHorizontal:20 }}>This week</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: "row", height: 30, marginVertical:5 }}>
                            <Image source={require('../../../assets/icons/unchecked.png')} style={{ width: 24, height: 24 }} />
                            <Text style={{ fontFamily: "Avenir-Medium", fontSize: 17, color: "#909096", marginHorizontal:20 }}>This month</Text>
                        </TouchableOpacity>
                    </View>
                    <LinearGradient
                        colors={['#DB3D88', '#273174']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            width: 300,
                            borderRadius: 5,
                            alignSelf: "center"
                            // marginBottom : IS_ANDROID ? 30 :20
                        }}>
                        <CustomButton
                            // style={{ backgroundColor: "#009933" }}
                            text={"APPLY"} />
                    </LinearGradient>
                    <SafeAreaView />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // paddingHorizontal: 10,
    },
    header: {
        height: 64,
        // backgroundColor: "red",
        flexDirection: "row"
    }
});
