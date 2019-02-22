// radio
// checkbox
// range
// height
// input
// minmaxheight

import React, { Component, PropTypes } from 'react'
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
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Image } from 'react-native-animatable'
import LinearGradient from 'react-native-linear-gradient';
import Modal from "react-native-modal";
import I18n from 'react-native-i18n';
import checked from '../../../assets/icons/checked.png'
import unchecked from '../../../assets/icons/unchecked.png'
import { data } from './questions.json'
import ApiManager from '../Common/ApiManager'
import metrics from '../../config/metrics'
import * as global from '../../../global.json'
import * as actions from "./question.action";
import Loader from '../Loading/Loader'
import BaseFormComponent from "../Common/BaseFormComponent";
import CustomSlider from 'react-native-custom-slider';
import CustomTextInput from '../CustomTextInput'
let IS_ANDROID = Platform.OS === 'android';
if (Platform.OS === 'android') UIManager.setLayoutAnimationEnabledExperimental(true)
let answer_data = {};

class Questionnaire extends BaseFormComponent {
    constructor(props) {
        super(props);
        this.state = {
            questions: data.questionAnswers,
            questionNum: props.question_number,
            progressWidth: 0,
            selectedanswer: 2,
            agerange: [10, 25],
            postalcode: '',
            useHeightis: null,
            isLoading: true,
            isAnswerSelected: false,
            min_height_selected: '',
            is_min_height_selected: false,
            max_height_selected: '',
            is_max_height_selected: false,
            answerIds: [],
        }
    }
    async componentDidMount() {
        await this.getQuestions();
        // await this.calculateProgressWidth();
    }
    goToNextQuestion() {
        let { questionNum, questions } = this.state;
        let questionData = questions[questionNum - 1];
        questionNum++ // + 1;
        console.log('question is  ', questionNum, 'total ', questions.length);
        if (questionNum <= questions.length) {
            this.setState({ questionNum, isAnswerSelected: false, answerIds: [] }, () => {
                this.getQuestions();
                this.calculateProgressWidth();
                this.props.saveNumber(questionNum)
            });
        } else if (questionNum >= questions.length) {
            this.props.navigation.navigate("Home")
        }
    }
    getQuestions = async() => {
        // console.log("this.props.token", this.props.token)
        // this.setState({ isLoading: true })
        console.log("call again")

        let header = {
            'Authorization': this.props.token,
            'lang': this.props.language
        };
        await ApiManager.callwebservice('GET', 'api/getUserProfileQuestionAnswer', header, '', (success) => {
            let responsedata = JSON.parse(success._bodyInit);
            console.log("responsedata", responsedata)
            this.setState({
                questions: responsedata.data.questionAnswers,
                isLoading: false
            })
            this.calculateProgressWidth()
            console.log("success", responsedata.data.questionAnswers)
        }, (error) => {
            console.log("error", error)
        })
    }
    calculateProgressWidth() {
        let { questionNum, questions } = this.state;
        let progressWidth = (metrics.DEVICE_WIDTH - 40) / questions.length;
        // console.log('metrics.DEVICE_WIDTH-40  is ', metrics.DEVICE_WIDTH - 40)
        // console.log('progressWidth  is ', progressWidth);
        progressWidth = progressWidth * questionNum;
        this.setState({ progressWidth });
    }
    gobacktoQuestion() {
        let { questionNum, questions } = this.state;
        let questionData = questions[questionNum - 1];
        questionNum-- // + 1;
        console.log('question is  ', questionNum, 'total ', questions.length);
        if (questionNum <= questions.length) {
            this.setState({ questionNum, isAnswerSelected: false }, () => {
                this.calculateProgressWidth();
            });
        } else if (questionNum >= questions.length) {
        }

    }
    skipQuestion() {
        let { questionNum, questions } = this.state;
        let questionData = questions[questionNum - 1];

        answer_data.questionId = questionData._id._id;
        answer_data.answerId = [];
        answer_data.skip = true;
        answer_data.answer = {};
        // console.log("answer_data", answer_data)
        this.savemyanswer()
        // questionNum++ // + 1;
        // console.log('question is  ', questionNum, 'total ', questions.length);
        // if (questionNum <= questions.length) {
        //     this.setState({ questionNum , isAnswerSelected:false}, () => {
        //         this.calculateProgressWidth();
        //     });
        // } else if (questionNum >= questions.length) {
        //     this.props.navigation.navigate("Home")
        // }
    }
    // selectAnswer(key) {
    //     let { questions, questionNum } = this.state;
    //     let questionData = questions[questionNum - 1];
    //     console.log("questionData", questionData)
    //     var selected = questionData.options[key].selected;
    //     selected = !selected;
    //     if (selected) {
    //         questionData.options.map((answer, key1) => {
    //             questionData.options[key1].selected = false;
    //         })
    //     }
    //     questionData.options[key].selected = selected;
    //     questions[questionNum - 1] = questionData;
    //     this.setState({ questions });
    // }
    activate_selectKey() {
        if (this.state.is_min_height_selected && this.state.is_max_height_selected) {
            this.setState({
                isAnswerSelected: true,
                answerIds: [1]
            });
        }
    }
    selectAnswer(key, availableanswer) {
        let { questions, questionNum } = this.state;
        let questionData = questions[questionNum - 1];
        var selected_answer_id = availableanswer[key]._id
        answer_data.questionId = questionData._id._id;
        answer_data.answerId = [selected_answer_id];
        answer_data.skip = false;
        answer_data.answer = {};
        this.setState({
            isAnswerSelected: true,
            selectedanswer: selected_answer_id,
            answerIds: [selected_answer_id]
        });
    }
    add_newParams() {
        // let { questions, questionNum } = this.state;
        // let questionData = questions[questionNum - 1];
        // answer_data.questionId = questionData._id._id;
        // console.log("answer_data", answer_data)
        // this.setState({
        //     isAnswerSelected: true,
        // })
    }

    callmyCheckbox(availableanswer) {
        // let self = this;
        let { questions, questionNum } = this.state;
        let questionData = questions[questionNum - 1];
        answer_data.questionId = questionData._id._id;
        answer_data.answerId = availableanswer;
        answer_data.skip = availableanswer && Array.isArray(availableanswer) && availableanswer.length == 0 ? true : false;
        answer_data.answer = {};
        console.log("answer_data", answer_data)
        this.setState({
            // isAnswerSelected: true,
            answerIds: availableanswer
        })
    }
    setActiveButton() {
        this.setState({
            isAnswerSelected: true,
        })
    }
    selectHeight = (selected_height, data) => {
        let self = this;
        let { questions, questionNum } = self.state;
        let questionData = questions[questionNum - 1];

        answer_data.questionId = questionData._id._id;
        answer_data.answerId = [];
        answer_data.skip = false;

        if (data === "minHeight") {
            answer_data.answer = Object.assign({}, answer_data.answer, { 'min': selected_height });
            self.setState({
                min_height_selected: selected_height,
                is_min_height_selected: true,
            }, () => this.activate_selectKey());
        } else {
            answer_data.answer = Object.assign({}, answer_data.answer, { 'max': selected_height });
            self.setState({
                max_height_selected: selected_height,
                is_max_height_selected: true,
            }, () => this.activate_selectKey());
        }
        console.log("selected_height", answer_data)
    }
    savemyanswer = async() => {
        let { questionNum, questions } = this.state;
        this.setState({ isLoading: true });
        let header = {
            'Authorization': this.props.token,
            'Content-Type': 'application/json'
        };
        console.log("answer_data", answer_data)
       await ApiManager.callwebservice('POST', 'api/addUserQuestionAnswer', header, answer_data, (success) => {
            let responsedata = JSON.parse(success._bodyInit);
            this.setState({
                isLoading: false,
                // isAnswerSelected: false,
                // selectedanswer: ''
            });
            console.log("success", responsedata)
            this.props.saveNumber(questionNum)
            if (responsedata.status === 1) {
                questionNum++ // + 1;
                console.log('question is  ', questionNum, 'total ', questions.length);
                this.getQuestions()
                if (questionNum <= questions.length) {
                    this.setState({ questionNum }, () => { this.calculateProgressWidth() });

                } else if (questionNum >= questions.length) {
                    this.props.navigation.navigate("Home")
                }
                console.log("success", responsedata.status)
                answer_data = {};
                this.setState({ isAnswerSelected: false, selectedanswer: '' });
            } else if (responsedata.status === 0) {
                console.log("responsedata", responsedata)
                if (responsedata.message) {
                    let message = responsedata.message.message ? responsedata.message.message : responsedata.message;
                    this.showSimpleMessage("info", { backgroundColor: global.gradientsecondry }, "error", message)
                }
            }
        }, (error) => {
            console.log("error while fetch data")
        })
    }
    updateCurrentState(key, selected_answer) {
        let { questionNum, questions } = this.state;
        let questionData = questions[questionNum - 1];
        answer_data.questionId = questionData._id._id;
        answer_data.answerId = [selected_answer._id];
    }
    renderOptions(data) {
        console.log("renderOptions", data)
        return data.map((answer, key) => {
            if (answer.selected) {
                this.setState({
                    selectedanswer: answer._id,
                    answerIds: [answer._id]
                    // isAnswerSelected: true,
                }, () => this.updateCurrentState(key, answer));
                answer.selected = false;
            }
            return <View key={key}>
                {
                    answer._id === this.state.selectedanswer ? (
                        <LinearGradient
                            colors={[global.gradientprimary, global.gradientsecondry]}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 1 }}
                            style={[styles.answerBtn, { padding: 1 }]}
                        >
                            <TouchableOpacity
                                style={[styles.answerBtn, { backgroundColor: 'white', width: "100%", height: "100%", marginHorizontal: 5 }]}
                                onPress={() => this.selectAnswer(key, data)}
                            >
                                <Text style={[styles.answerTxt, { color: '#313138', fontFamily: 'Avenir-Heavy' }]}>{answer.answer}</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    ) : (
                            <TouchableOpacity style={styles.answerBtn} onPress={() => this.selectAnswer(key, data)}>
                                <Text style={styles.answerTxt}>{answer.answer}</Text>
                            </TouchableOpacity>
                        )
                }
            </View>
        })
    }
    indianicCall(data) {
        let { questionNum, questions } = this.state;
        let questionData = questions[questionNum - 1];
        answer_data.questionId = questionData._id._id;
        answer_data.answerId = data;
        console.log("isAnswerSelected", this.state.isAnswerSelected)
        if (!this.state.isAnswerSelected) {
            this.setState({ isAnswerSelected: true })
            console.log("hello world", this.state.isAnswerSelected)
        }
    }
    renderCheckboxes(data) {
        return <Checkbox data={data} callmyCheckbox={this.callmyCheckbox.bind(this)} indianicCall={this.indianicCall.bind(this)} setActiveButton={this.setActiveButton.bind(this)} />
    }
    save_height(height_is) {
        let self = this;
        let { questions, questionNum } = self.state;
        let questionData = questions[questionNum - 1];
        answer_data.questionId = questionData._id._id;
        answer_data.answerId = [];
        answer_data.skip = false;
        answer_data.answer = { 'height': height_is };
        console.log("answer_is", answer_data)
    }
    heightSubmit(height_is, key) {
        console.log("height_is", height_is)
        this.setState({
            useHeightis: height_is,
            isAnswerSelected: true,
            answerIds: [height_is]
        }, () => this.save_height(height_is))
    }
    renderMeasureheight(remoteData) {
        console.log("renderMeasureheight", remoteData)
        // let remoteData = remoteData;
        if (remoteData.answer) {
            if (remoteData.answer.height) {
                let { questions, questionNum } = this.state;
                let questionData = questions[questionNum - 1];
                answer_data.questionId = questionData._id._id;
                answer_data.answerId = [];
                answer_data.skip = false;
                answer_data.answer = { 'height': remoteData.answer.height };
                console.log("answer_is remoteData", typeof remoteData.answer.height);
                this.state.useHeightis = remoteData.answer.height;
                this.state.answerIds = [remoteData.answer.height];
                remoteData.answer.height = ""
            }
        }
        return (
            <ScrollView style={{ height: 200 }} nestedScrollEnabled={true}>
                {
                    this.mapHeight()
                }
            </ScrollView>
        )
    }
    mapHeight() {
        let height = [];
        for (let i = 4; i <= 6; i++) {
            for (let j = 0; j <= 11; j++) {
                height.push(i + "'" + j + '"')
            }
        }
        console.log("mapHeight", this.state.useHeightis);
        return height.map((answer, key) => {
            return <View key={key}>
                {
                    this.state.useHeightis === answer ? (
                        <LinearGradient
                            colors={['rgb(220,57, 134)', 'rgb(40,40,120)']}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 1 }}
                            style={[styles.answerBtn, { padding: 1, }]}
                        >
                            <TouchableOpacity
                                style={{
                                    backgroundColor: 'white',
                                    overflow: "hidden",
                                    justifyContent: "center",
                                    height: '100%',
                                    alignItems: "center",
                                    width: "100%",
                                    borderRadius: 25,
                                }}
                                onPress={() => this.heightSubmit(answer, key)}
                            >
                                <Text style={[styles.answerTxt, { color: '#313138', fontFamily: 'Avenir-Heavy' }]}>{answer}</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    ) : (
                            <TouchableOpacity style={styles.answerBtn} onPress={() => this.heightSubmit(answer, key)}>
                                <Text style={styles.answerTxt}>{answer}</Text>
                            </TouchableOpacity>
                        )
                }
            </View>
        })
    }
    temprender(remoteData) {
        const { language } = this.props;
        if (remoteData.answer) {
            console.log("temprender", remoteData.answer.max)
            if (remoteData.answer.max && remoteData.answer.min) {
                let { questions, questionNum } = this.state;
                let questionData = questions[questionNum - 1];
                // answer_data.questionId = questionData._id._id;
                // answer_data.answerId = [];
                // answer_data.skip = false;
                // answer_data.answer = { "min": remoteData.answer.min, "max":remoteData.answer.max };
                //     console.log("answer_is remoteData", typeof remoteData.answer.height);
                this.state.min_height_selected = remoteData.answer.min;
                this.state.is_min_height_selected = true;
                this.state.max_height_selected = remoteData.answer.max;
                this.state.is_max_height_selected = true;
                this.state.answerIds = [remoteData.answer.max]
                remoteData.answer.max = "";
                remoteData.answer.min = "";
            }
        } return (
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{}}>
                    <Text style={{ alignSelf: "center" }}>{I18n.t('min_label', { locale: language })}</Text>
                    <Image source={require('../../../assets/icons/upsidediamond.png')}
                        style={{
                            width: 24,
                            height: 24,
                            alignSelf: "center"
                        }}
                        resizeMethod='resize'
                        resizeMode="contain"
                    />
                    <ScrollView style={{ height: 150 }} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
                        <MinMaxheight selectHeight={this.selectHeight} is_minHeight={"minHeight"} height={this.state.min_height_selected} />
                    </ScrollView>
                    <Image source={require('../../../assets/icons/downsidediamond.png')}
                        style={{
                            width: 24,
                            height: 24,
                            alignSelf: "center"
                        }}
                        resizeMethod='resize'
                        resizeMode="contain"
                    />
                </View>
                <View style={{}}>
                    <Text style={{ alignSelf: "center" }}>{I18n.t('max_label', { locale: language })}</Text>
                    <Image source={require('../../../assets/icons/upsidediamond.png')}
                        style={{
                            width: 24,
                            height: 24,
                            alignSelf: "center"
                        }}
                        resizeMethod='resize'
                        resizeMode="contain"
                    />
                    <ScrollView style={{ height: 150 }} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>

                        <MinMaxheight selectHeight={this.selectHeight} is_minHeight={"maxHeight"} height={this.state.max_height_selected} />
                    </ScrollView>

                    <Image source={require('../../../assets/icons/downsidediamond.png')}
                        style={{
                            width: 24,
                            height: 24,
                            alignSelf: "center"
                        }}
                        resizeMethod='resize'
                        resizeMode="contain"
                    />
                </View>
            </View>
        )
    }
    renderMatchprefrence(data) {
        return data.map((answer, key) => {
            return (
                <View key={key} style={{
                    flexDirection: "row",
                    // backgroundColor:"blue", 
                    justifyContent: "space-between"
                }}>
                    {
                        answer.selected ? (
                            <LinearGradient
                                colors={['rgb(220,57, 134)', 'rgb(40,40,120)']}
                                start={{ x: 0, y: 1 }}
                                end={{ x: 1, y: 1 }}
                                style={{
                                    flex: 1,
                                    height: 52,
                                    borderRadius: 26,
                                    justifyContent: 'center',
                                    // alignItems: 'center',
                                    // marginHorizontal: 10,
                                    // marginVertical: 5,
                                }}
                            // style={[styles.answerBtn, { backgroundColor: 'white' }]}
                            >
                                <TouchableOpacity style={{
                                    flex: 1,
                                    borderRadius: 26,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: 'rgb(233,233,234)',
                                    marginHorizontal: 1,
                                    marginVertical: 1,
                                }}
                                    onPress={() => this.selectAnswer(key)}
                                >
                                    <Text style={[styles.answerTxt, { color: '#313138', fontFamily: 'Avenir-Heavy' }]}>{answer.answer}</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        ) : (
                                <TouchableOpacity style={{
                                    flex: 1,
                                    height: 52,
                                    borderRadius: 26,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: 'rgb(233,233,234)',
                                    marginHorizontal: 10,
                                    marginVertical: 5,
                                }} onPress={() => this.selectAnswer(key)}>
                                    <Text style={styles.answerTxt}>{answer.answer}</Text>
                                </TouchableOpacity>
                            )
                    }
                </View>
            )
        })
    }
    multiSliderValuesChange = values => {
        let { questions, questionNum } = this.state;
        let questionData = questions[questionNum - 1];
        answer_data.questionId = questionData._id._id;
        answer_data.answerId = [];
        answer_data.skip = false;
        answer_data.answer = { 'min': values[0], 'max': values[1] }
        this.setState({
            agerange: values,
            isAnswerSelected: true,
            answerIds: [123456]
        });
        console.log("answer_data", answer_data)
    };

    rangeRender(data) {
        let { questionNum, questions } = this.state;
        let questionData = questions[questionNum - 1];


        if (data.answer && data.answer.max) {
            answer_data.questionId = questionData._id._id;
            answer_data.answerId = [];
            answer_data.skip = false;
            answer_data.answer = { 'min': data.answer.min, 'max': data.answer.max }
            this.state.answerIds = [data.answer.min];
            this.state.agerange = [data.answer.min, data.answer.max];
            data.answer.answer = {};

        }
        console.log("answer_data", answer_data)


        return (
            <>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'space-between' }}>
                    <Text style={{ fontFamily: "Avenir-Medium", fontSize: 11, color: "#D43C87" }}>{questionData._id.key} RANGE</Text>
                    <Text style={{ fontFamily: "Avenir-Medium", fontSize: 17, color: "#909096" }}> {this.state.agerange[0] + "- " + this.state.agerange[1]} {questionData._id.key} </Text>
                </View>
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
            </>
        )
    }
    setAnswers() {
        let { questions, questionNum, postalcode } = this.state;
        let questionData = questions[questionNum - 1];
        answer_data.questionId = questionData._id._id;
        answer_data.answerId = [];
        answer_data.skip = false;
        answer_data.answer = { "zipcode": postalcode }
        console.log("answer_data", answer_data)
    }
    postalcodeValidation(postalcode) {
        console.log("postalcode", postalcode)
        if (postalcode.length <= 5) {
            return false
        }
        return true
    }
    handlePostalcode = (value) => {
        console.log("handlePostalcode", value)
        if (this.postalcodeValidation(value)) {
            this.setState({
                postalcode: value,
                isAnswerSelected: true,
                answerIds: [value]
            }, () => { this.setAnswers() })
        } else {
            this.setState({
                postalcode: value,
                isAnswerSelected: false,
                answerIds: []
            }, () => this.setAnswers())
        }
    }
    inputRender(data) {
        let { questions, questionNum } = this.state;
        if (data.answer) {
            if (!data.answer.zipcode) {

            } else {
                let questionData = questions[questionNum - 1];
                answer_data.questionId = questionData._id._id;
                answer_data.answerId = [];
                answer_data.skip = false;
                answer_data.answer = { "zipcode": data.answer.zipcode }

                this.state.postalcode = this.state.postalcode ? this.state.postalcode : data.answer.zipcode;
                this.state.answerIds = [data.answer.zipcode];
                data.answer.zipcode = ""
            }
            //    this.setState({postalcode: data.answer.zipcode})
            // this.updatePostalCode(data.answer.zipcode)
        }
        return (
            <CustomTextInput style={{ minHeight: 42, paddingHorizontal: 5 }}
                name={'pincode'}
                ref={(ref) => this.pinInputRef = ref}
                value={this.state.postalcode}
                placeholder={'eg 100100'}
                keyboardType={'numeric'}
                editable={true}
                returnKeyType={'done'}
                withRef={true}
                maxLength={6}
                onChangeText={(postalcode) => this.handlePostalcode(postalcode)}
                isEnabled={true}
            />)
    }

    render() {
        const { language } = this.props;
        let { questionNum, questions, progressWidth, isLoading } = this.state;
        let questionData = questions[questionNum - 1];
        const { navigate } = this.props.navigation;

        console.log('answerIds', this.state.answerIds);
        if (isLoading) {
            return <View style={{ flex: 1 }}>
                <Modal
                    backdropOpacity={0.3}
                    isVisible={isLoading}
                    scrollTo={this.handleScrollTo}
                    style={{ margin: 0, justifyContent: "center", alignItems: "center" }}>
                    <Loader />
                </Modal>
            </View>
        }
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: "rgba(255,255,255,100)" }}>
                <StatusBar
                    backgroundColor={Platform.OS === 'android' ? "#fff" : undefined}
                    barStyle="dark-content" />
                <View style={{ flexDirection: "row", justifyContent: "space-between", height: IS_ANDROID ? 54 : 69, alignItems: "flex-end", backgroundColor: "#FFF" }}>
                    <TouchableOpacity onPress={() => questionNum > 1 ? this.gobacktoQuestion() : navigate('basicinfo')} style={styles.backbuttonContainer}>
                        <Image
                            source={require('../../images/icons/backbutton_gradient.png')}
                            style={{ width: 25, height: 17 }}
                            resizeMethod="resize"
                            resizeMode="contain" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigate('homePage')} style={styles.backbuttonContainer}>
                        {/* <Text>home</Text> */}

                        <Image
                            source={require('../../images/icons/white-home-logo-png-1.png')}
                            style={{ width: 25, height: 25 }}
                            resizeMethod="resize"
                            resizeMode="contain" />
                    </TouchableOpacity>

                </View>
                <View style={{ height: 35, marginHorizontal: 20, justifyContent: "flex-start" }}>
                    <View style={styles.totalProgress}>
                        <View style={[styles.progress, { width: progressWidth }]}></View>
                    </View>
                    <Text style={styles.questionNum}>{I18n.t('questionTitle', { locale: language }) + " "} {questionNum}/{questions.length}</Text>
                </View>

                <ScrollView contentContainerStyle={styles.container} nestedScrollEnabled={true} >
                    <View style={{ paddingHorizontal: 0 }}>
                        <View style={styles.questionBox}>
                            <Text style={styles.questionTitle}>{questionData._id.questionFor}</Text>
                            <Text style={styles.question}>{questionData._id.question}</Text>
                            {questionData._id.questionType == 'height' ? <Text style={styles.questionTitle}>{I18n.t('select_height_label', { locale: language })}</Text> : undefined}
                        </View>
                        <View style={styles.answerBox}>
                            {questionData._id.questionType == 'height' ? <Image source={require('../../../assets/icons/upsidediamond.png')}
                                style={{
                                    width: 24,
                                    height: 24,
                                    alignSelf: "center"
                                }}
                                resizeMethod='resize'
                                resizeMode="contain"
                            /> : undefined}
                            {
                                questionData._id.questionType == 'radio' ? (this.renderOptions(questionData.answers))
                                    :
                                    (questionData._id.questionType == 'checkbox' ? (this.renderCheckboxes(questionData.answers))
                                        :
                                        (questionData._id.questionType == 'minmaxheight' ? this.temprender(questionData)
                                            :
                                            (questionData._id.questionType == 'range' ? this.rangeRender(questionData)
                                                :
                                                (questionData._id.questionType == 'input' ? this.inputRender(questionData)
                                                    :
                                                    this.renderMeasureheight(questionData)))))
                            }
                            {questionData._id.questionType == 'height' ? <Image source={require('../../../assets/icons/downsidediamond.png')}
                                style={{
                                    width: 24,
                                    height: 24,
                                    alignSelf: "center"
                                }}
                                resizeMethod='resize'
                                resizeMode="contain"
                            /> : undefined}
                        </View>
                    </View>
                </ScrollView>
                <View style={{ paddingHorizontal: 16 }}>
                    {
                        this.state.isAnswerSelected && this.state.answerIds.length ?
                            <LinearGradient
                                colors={[global.gradientprimary, global.gradientsecondry]}
                                start={{ x: 0, y: 1 }}
                                end={{ x: 1, y: 1 }}
                                style={{ borderRadius: 5, marginBottom: 10 }}>
                                <TouchableOpacity style={{ height: 50, justifyContent: "center", alignItems: "center", }} onPress={() => this.savemyanswer()}>
                                    <Text style={{ color: "#fff", fontSize: 17, fontFamily: 'Avenir-Heavy' }}>{I18n.t('save_title', { locale: language })}</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                            :
                            this.state.answerIds.length ?
                                <LinearGradient
                                    colors={[global.gradientprimary, global.gradientsecondry]}
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 1, y: 1 }}
                                    style={{ borderRadius: 5, marginBottom: 10 }}>
                                    <TouchableOpacity style={{ height: 50, justifyContent: "center", alignItems: "center", }} disabled={false} onPress={() => this.goToNextQuestion()} >
                                        <Text style={{ color: "#fff", fontSize: 17, fontFamily: 'Avenir-Heavy' }}>{I18n.t('save_title', { locale: language })}</Text>
                                    </TouchableOpacity>
                                </LinearGradient>
                                :
                                <TouchableOpacity style={{ backgroundColor: "#F5F5F5", height: 50, justifyContent: "center", alignItems: "center", borderRadius: 5 }} disabled={true}  >
                                    <Text style={styles.questionTitle}>{I18n.t('save_title', { locale: language })}</Text>
                                </TouchableOpacity>
                    }
                    {
                        this.state.answerIds.length ? undefined :
                            questionData._id.canSkip ?
                                <TouchableOpacity style={{ height: 50, justifyContent: "center", alignItems: "center", marginBottom: 10 }} onPress={() => this.skipQuestion()}>
                                    <Text style={styles.skipTxt}>{I18n.t('skip_title', { locale: language })}</Text>
                                </TouchableOpacity>
                                : undefined

                    }
                </View>

            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor:"rgba(255,255,255,100)",
        paddingHorizontal: 20,
    },
    backbuttonContainer: {
        // position: "absolute",
        // zIndex: 1,
        width: "20%",
        height: 54,
        backgroundColor: "transparent",
        justifyContent: Platform.OS === 'ios' ? "center" : "center",
        alignItems: "center"
    },

    totalProgress: {
        height: 4,
        backgroundColor: 'rgb(216,216,216)',
        marginVertical: 5
    },
    progress: {
        height: 4,
        width: 50,
        backgroundColor: '#D43C87'
    },
    questionNum: {
        color: '#909096',
        fontSize: 13,
        fontFamily: 'Avenir-Medium',
        textAlign: 'right',
    },
    questionBox: {
        paddingVertical: 10
    },
    questionTitle: {
        color: '#909096',
        fontSize: 17,
        fontFamily: 'Avenir-Medium',
        paddingVertical: 5
    },
    question: {
        color: '#313138',
        fontSize: 30,
        fontFamily: 'Avenir-Heavy',
        paddingVertical: 5
    },
    answerBox: {
        paddingVertical: 20
    },
    answerBtn: {
        height: 52,
        borderRadius: 26,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(233,233,234)',
        marginVertical: 12
    },
    answerTxt: {
        color: '#909096',
        fontSize: 17,
        fontFamily: 'Avenir-Medium',
    },
    skipTxt: {
        color: '#71367D',
        fontSize: 17,
        fontFamily: 'Avenir-Medium',
        paddingVertical: 5,
        textAlign: 'center'
    }
});
mapStateToProps = (state) => {
    return {
        language: state.language.defaultlanguage,
        question_number: !state.question.number ? '1' : state.question.number,
        token: state.auth.token
    }
}
mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ saveNumber: actions.savegivenanswerNumber }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Questionnaire);

class MinMaxheight extends Component {
    constructor(props) {
        super(props);
        this.state = {
            heightindex: null,
            is_heightSelected: false
        }
    }
    componentDidMount() {
        this.setState({
            heightindex: this.props.height
        })
    }
    // componentWillReceiveProps(nextProps, nextState){
    //     this.setState({
    //         heightindex
    //     })
    // }
    selectHeight(val, sel_value) {
        this.setState({
            heightindex: sel_value,
            is_heightSelected: true,
        }, this.props.selectHeight(sel_value, this.props.is_minHeight))
    }
    heightMeaserement = () => {
        let height = [];
        for (let i = 4; i <= 6; i++) {
            for (let j = 0; j <= 11; j++) {
                height.push(i + "'" + j + '"')
            }
        }
        return height.map((val, index) => {
            return <View key={index}>
                {
                    this.state.heightindex === val ?
                        <LinearGradient
                            colors={['rgb(220,57, 134)', 'rgb(40,40,120)']}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                                width: 140,
                                height: 52,
                                borderRadius: 26,
                                justifyContent: 'center',
                                marginVertical: 12
                            }}
                        // key={index}
                        >
                            <TouchableOpacity style={{
                                flex: 1,
                                borderRadius: 26,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'rgb(233,233,234)',
                                marginHorizontal: 1,
                                marginVertical: 1,
                            }}
                                onPress={() => this.selectHeight(index, val)}
                            >
                                <Text style={[styles.answerTxt, { color: '#313138', fontFamily: 'Avenir-Heavy' }]}>{val}</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                        :
                        <TouchableOpacity style={{
                            borderRadius: 26,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgb(233,233,234)',
                            width: 140,
                            height: 52,
                            borderRadius: 26,
                            justifyContent: 'center',
                            marginVertical: 12
                        }}
                            // key={index}
                            onPress={() => this.selectHeight(index, val)}
                        >
                            <Text style={[styles.answerTxt, { color: '#313138', fontFamily: 'Avenir-Heavy' }]}>{val}</Text>
                        </TouchableOpacity>
                }

            </View>
        })
    }
    render() {
        return (
            // <ScrollView style={{ height: 150 }} showsVerticalScrollIndicator={false}>
            <>
                {
                    this.heightMeaserement()
                }
            </>
            // </ScrollView>
        )
    }
}
class Checkbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOptions: []
        }
    }
    unceckData(key, data) {
        console.log("hello uncheck")
        let options = this.state.selectedOptions;
        // if (this.state.selectedOptions.indexOf(data._id) > -1) {
        //     for (var i = 0; i < options.length; i++) {
        //         if (options[i] === data._id) {
        //             options.splice(i, 1);
        //             data.selected = false;
        //         }
        //     }
        // } 
        let array_index = this.state.selectedOptions.indexOf(data._id)
        options.splice(array_index, 1);
        data.selected = false;

        // this.setState({
        //     selectedanswer: data._id
        // })
        this.props.callmyCheckbox(this.state.selectedOptions)
    }

    selectAnswer(key, data) {
        let options = this.state.selectedOptions;
        data.selected = true;
        this.state.selectedOptions.push(data._id)
        this.setState({
            selectedanswer: data._id
        })
        this.props.callmyCheckbox(this.state.selectedOptions)
        this.props.setActiveButton()
    }

    checkedData(answer) {
        let x = (names) => names.filter((v, i) => names.indexOf(v) === i);
        let arr = this.state.selectedOptions;
        let array_data = x(arr)
        array_data.push(answer._id)
        this.state.selectedOptions = array_data;
        console.log("checkedData checkbox", array_data)
        this.props.indianicCall(arr)
        // this.state.selectedOptions.push(answer._id)

    }
    componentDidMount() {
        this.state.selectedOptions = [];
        if (this.props.data) {
            console.log("this.props.data)", this.props.data)
            let remoteData = this.props.data;
            for (let i = 0; i < remoteData.length; i++) {
                if (remoteData[i].selected) {
                    this.state.selectedOptions.push(remoteData[i]._id)
                    this.props.callmyCheckbox(this.state.selectedOptions)
                }
            }
        }
    }
    // componentWillReceiveProps(nextProps, nextState){
    //     if (nextProps.data) {
    //         let remoteData = nextProps.data;
    //         for(let i=0; i < remoteData.length; i++){
    //             this.state.selectedOptions.push(remoteData[i]._id)
    //             // this.checkedData(remoteData[i]._id)
    //         }
    //         console.log("nextProps", nextProps.data)
    //     }
    // }
    renderCheckboxes() {
        return this.props.data.map((answer, key) => {
            // if (answer.selected) {
            // this.checkedData(answer)
            // this.state.selectedOptions.push(answer._id)
            // answer.selected = false;
            // }
            return <View key={key} style={{}}>
                {
                    this.state.selectedOptions.indexOf(answer._id) > -1 ?
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                // backgroundColor:"red", 
                                paddingVertical: 5,
                                marginVertical: 10
                            }}
                            onPress={() => this.unceckData(key, answer)}
                        >
                            <View style={{ backgroundColor: "transparent", flex: 2 }}>
                                <Image
                                    source={checked}
                                    style={{
                                        width: 24, height: 24,
                                        // alignSelf:"center"
                                    }}
                                    resizeMethod='resize'
                                    resizeMode="contain"
                                />
                            </View>
                            <View style={{ backgroundColor: "transparent", flex: 8 }}>
                                <Text style={[styles.answerTxt]}>{answer.answer}</Text>
                            </View>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                // backgroundColor:"red", 
                                paddingVertical: 5,
                                marginVertical: 10
                            }}
                            onPress={() => this.selectAnswer(key, answer)}
                        >
                            <View style={{ backgroundColor: "transparent", flex: 2 }}>
                                <Image
                                    source={unchecked}
                                    style={{
                                        width: 24,
                                        height: 24,
                                    }}
                                    resizeMethod='resize'
                                    resizeMode="contain"
                                />
                            </View>
                            <View style={{ backgroundColor: "transparent", flex: 8 }}>
                                <Text style={[styles.answerTxt]}>{answer.answer}</Text>
                            </View>
                        </TouchableOpacity>
                }
            </View>
        })
    }

    render() {
        console.log("selectedOptions", this.state.selectedOptions)

        return (
            <>
                {
                    this.renderCheckboxes()
                }
            </>
        )
    }
}
