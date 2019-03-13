import React, { Component } from 'react';
import {
    KeyboardAvoidingView,
    LayoutAnimation,
    Platform,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    UIManager,
    Image,
    Text,
    ScrollView,
    View,
    TouchableOpacity,
    ActivityIndicator,
    Picker
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import BaseFormComponent from '../Common/BaseFormComponent'
import * as global from '../../../global.json';
import checked from '../../../assets/icons/checked.png';
import unchecked from '../../../assets/icons/unchecked.png';
import Modal from "react-native-modal";
import Loading from '../Loading'
import Apirequest from '../Common/Apirequest'
import _ from 'lodash'

let IS_ANDROID = Platform.OS === 'android';
if (Platform.OS === 'android') UIManager.setLayoutAnimationEnabledExperimental(true)
var days = [
    { "id": "1", "label": "1" },
    { "id": "2", "label": "2" },
    { "id": "3", "label": "3" },
    { "id": "4", "label": "4" },
    { "id": "5", "label": "5" }
]
var data = {};
export default class FriendrequestFeedback extends BaseFormComponent {
    constructor(props) {
        super(props);
        this.state = {
            questionData: [],
            questionindex: 0,
            isloading: true,
            questions: '',
            questionNum: '',
            selectedDate: '',
            saveanswer: false,
            showDate: false
        }
    }
    componentDidMount = () => {
        const { state } = this.props.navigation
        var token = state.params.token;
        var data = state.params.data;
        Apirequest.getFeedbackQuestions(token, 'invitefeedback', resolve => {
            console.log("getFeedbackQuestions_resolve", resolve)
            if (resolve.data && resolve.data.questionAnswers) {
                this.setState({
                    questionData: resolve.data.questionAnswers ? resolve.data.questionAnswers : [],
                    isloading: false
                })
            }
        }, reject => {
            console.log("getFeedbackQuestions_reject", reject)

            this.setState({
                questionData: [],
                isloading: false
            })
            console.log(reject)
        })
    }

    updateNotificationStatus = () => {
        const { questionData, questionindex } = this.state;
        const { state, goBack } = this.props.navigation
        var token = state.params.token;
        var notificationId = state.params.data;
        var Data = {
            "notificationIds": [notificationId._id]
        }
        Apirequest.updateNotificationStatus(token, Data, resolve => {
            data = {}
            console.log("questionindex", questionindex)
            console.log("questionData_length", questionData.length)
            console.log("updateNotificationStatus_resolve", resolve)
            state.params.checkemitRequest()

            goBack()
        }, reject => {
            console.log("updateNotificationStatus_reject", reject)
        })
    }
    selectanswerForRadio = async (answer, availableanswer) => {
        const { questionData, questionindex } = this.state;
        const { state } = this.props.navigation
        var usersData = state.params.data;

        let currentQuestion = questionData[questionindex];
        await _.map(currentQuestion.answers, (answer) => { return answer.selected = false });
        data.feedbackReceiver = usersData.receiverId;
        data.feedbackType = currentQuestion._id.category;
        data.questionId = currentQuestion._id._id;
        data.answerId = answer._id;
        data.variableValue = {};
        var indexofnextQuestion = _.findIndex(questionData, (x) => { return x._id._id === answer.nextQuestionId });
        if (answer) {
            answer.selected = true;
        }
        this.setState({
            questionindex: indexofnextQuestion,
            questionData: this.state.questionData
        }, () => this.saveFeedback())
    }
    saveFeedback() {
        const { questionData, questionindex } = this.state;
        const { state, goBack } = this.props.navigation
        var token = state.params.token;
        Apirequest.saveUserFeedback(token, data, resolve => {
            console.log("resolve", resolve)
            data = {}
        }, reject => {
            console.log("error", reject)
        })

    }
    renderRadioOption(availableanswer) {
        return availableanswer.map((answer, index) => {
            return <View key={index} style={{}}>
                {
                    answer.selected ? (
                        <LinearGradient
                            colors={[global.gradientprimary, global.gradientsecondry]}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 1 }}
                            style={[styles.answerBtn, { padding: 1 }]}
                        >
                            <TouchableOpacity
                                style={[styles.answerBtn, { backgroundColor: 'white', width: "100%", height: "100%", marginHorizontal: 5 }]}
                                onPress={() => this.selectanswerForRadio(answer, availableanswer)}
                            >
                                <Text style={[styles.answerTxt, { color: '#313138', fontFamily: 'Avenir-Heavy' }]}>{answer.answer}</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    ) : (
                            <TouchableOpacity style={styles.answerBtn} onPress={() => this.selectanswerForRadio(answer, availableanswer)}>
                                <Text style={styles.answerTxt}>{answer.answer}</Text>
                            </TouchableOpacity>
                        )
                }
            </View>
        })
    }
    renderMultipleOption(availableanswer) {
        return <Checkbox
            selectedDate={this.state.selectedDate}
            showDatePicker={this.showDatePicker.bind(this)}
            data={availableanswer}
            getmyvalue={this.getmyvalue.bind(this)}
            selectAnswer={this.selectAnswerCheckbox.bind(this)}
        />

    }
    selectAnswerCheckbox(answer) {
        const { questionData, questionindex } = this.state;
        const { state } = this.props.navigation
        var usersData = state.params.data;
        let currentQuestion = questionData[questionindex];

        console.log("currentQuestion", answer)

        _.map(currentQuestion.answers, (answer) => { return answer.selected = false });

        answer && answer.selected ? answer.selected = false : answer ? answer.selected = true : undefined;
        answer && answer.selected ? undefined : answer.dynamicvalue = 2

        data.feedbackReceiver = usersData.receiverId;
        data.feedbackType = currentQuestion._id.category;
        data.questionId = currentQuestion._id._id;
        data.answerId = answer._id;
        answer.containVariable ? data.variableValue = { days: answer.dynamicvalue } : data.variableValue = {}
        this.setState({
            questionData: this.state.questionData,
            saveanswer: !answer.selected ? false : true
        });
        console.log("sendDatatoserver", data)
    }

    //    selectAnswerCheckbox(answer) {
    //         const { questionData, questionindex } = this.state;
    //         const { state } = this.props.navigation
    //         var usersData = state.params.data;
    //         let currentQuestion = questionData[questionindex - 1];
    //         console.log("selectAnswerCheckbox", answer)

    //         // answer && answer.selected ? answer.selected = false : answer ? answer.selected = true : undefined;
    //         // answer && answer.selected ? undefined : answer.dynamicvalue = 2

    //         let selected_answer_ids = [];
    //         // if (currentQuestion.answers) {
    //             // selected_answer_ids = _.filter(currentQuestion.answers, (ans) => { return ans.selected });
    //         //     selected_answer_ids = _.map(selected_answer_ids, (ans) => { return ans && ans._id ? ans._id : "" });
    //         // }
    //         _.map(currentQuestion.answers, (answer) => { return answer.selected = false });
    //         answer && answer.selected ? answer.selected = false : answer ? answer.selected = true : undefined;
    //         answer && answer.selected ? undefined : answer.dynamicvalue = 2

    //         data.feedbackReceiver = usersData.receiverId;
    //         data.feedbackType = currentQuestion._id.category;
    //         data.questionId = currentQuestion._id._id;
    //         data.answerId = answer._id;
    //         answer.containVariable ? data.variableValue = { days: answer.dynamicvalue } : data.variableValue = {}
    //         // if (answer) {
    //         //     answer.selected = true;
    //         // }

    //         this.setState({
    //             questionData: this.state.questionData,
    //             saveanswer: !answer.selected ? false : true
    //         });
    //         console.log("sendDatatoserver", data)
    //         // console.log("selectAnswerCheckbox_questionData", questionData)
    //         // console.log("selectAnswerCheckbox_currentQuestion", currentQuestion)

    //     }
    // callmyCheckbox(data) {
    //     console.log("callmyCheckbox", data)
    // }
    // setActiveButton() { }
    saveUserFeedback(availableanswer) {
        const { questionData, questionindex } = this.state;
        const { state, goBack } = this.props.navigation
        var token = state.params.token;
        let currentQuestion = questionData[questionindex];

        console.log("saveUserFeedback_data", data)
        console.log("currentQuestion", currentQuestion)

        Apirequest.saveUserFeedback(token, data, resolve => {
            console.log("saveUserFeedback_resolve", resolve)
            this.showSimpleMessage("", { backgroundColor: global.gradientsecondry }, "", resolve.message)
            console.log("currentQuestion_isPositive", currentQuestion._id.isPositive)
            console.log("currentQuestion_isNegative", currentQuestion._id.isNegative)
            if (currentQuestion && currentQuestion._id && currentQuestion._id.isPositive) {
                console.log("going to positive")
                this.updateNotificationStatus()
            }
            else if (currentQuestion && currentQuestion._id && currentQuestion._id.isNegative) {
                console.log("going to negative")
                this.updateNotificationStatus()
            }

        }, reject => {
            console.log("saveUserFeedback_reject", reject)
            this.showSimpleMessage("", { backgroundColor: global.gradientsecondry }, "", reject.message)
            // remove this after complete 
            // if (questionindex >= questionData.length) {
            //     goBack()
            // }
            // 

        })
    }
    // selectDate(date) {
    //     var answer = this.state.questionData;
    //     console.log("selectDate", answer)
    //     this.showDatePicker(answer, date)
    // }
    showDatePicker(answer, date) {
        answer.dynamicvalue = date ? date : 1
        console.log("showDatePicker_answer", answer)
        this.setState({
            showDate: !this.state.showDate,
            questionData: this.state.questionData
        })
    }
    showDays() {
        var arr = [1, 2, 3, 4, 5];
        return arr.map((value, index) => {
            return <TouchableOpacity key={index}
                style={{ borderRadius: 22, marginVertical: 3, height: 44, backgroundColor: "#FFF", justifyContent: "center", paddingHorizontal: 16 }}
                onPress={this.selectDate.bind(this, value)}>
                <Text>{value}</Text>
            </TouchableOpacity>

        })
    }
    getmyvalue(available) {
        this.setState({
            selectedDate: available
        })
        console.log("getmyvalue", available)

    }
    render() {
        const { goBack, state } = this.props.navigation;
        const { questionData, questionindex } = this.state;
        var invitationname = state.params.invitationname;
        var data = state.params.data;
        if (this.state.isloading) {
            return <Loading />
        }
        let currentQuestion = questionData[questionindex];
        let availableanswer = questionData[questionindex].answers;
        console.log("data from navigation", data)
        return (
            <>
                <SafeAreaView style={{ flex: 1, backgroundColor: "rgba(255,255,255,100)" }}>
                    <StatusBar
                        backgroundColor={Platform.OS === 'android' ? "#fff" : undefined}
                        barStyle="dark-content" />
                    <View style={{ flexDirection: "row", justifyContent: "space-between", height: IS_ANDROID ? 54 : 69, alignItems: "flex-end", backgroundColor: "#FFF" }}>
                        <TouchableOpacity onPress={() => goBack()} style={styles.backbuttonContainer}>
                            <Image
                                source={require('../../images/icons/backbutton_gradient.png')}
                                style={{ width: 25, height: 17 }}
                                resizeMethod="resize"
                                resizeMode="contain" />
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={{ paddingHorizontal: 16 }} nestedScrollEnabled={true} >
                        <View style={{}}>
                            <View style={styles.questionBox}>
                                <Text style={styles.questionTitle}>{currentQuestion._id.questionFor}</Text>
                                <Text style={styles.question}>{_.replace(currentQuestion._id.question, new RegExp("{{memberName}}"), invitationname)}</Text>
                            </View>
                        </View>
                        {
                            currentQuestion._id.questionType === "radio" ?
                                this.renderRadioOption(availableanswer)
                                : currentQuestion._id.questionType === "checkbox" ?
                                    this.renderMultipleOption(availableanswer) : undefined
                        }
                        {
                            this.state.saveanswer ?
                                <LinearGradient
                                    colors={[global.gradientprimary, global.gradientsecondry]}
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 1, y: 1 }}
                                    style={{ borderRadius: 5, marginBottom: 10, marginTop: 16 }}>
                                    <TouchableOpacity
                                        style={{ height: 50, justifyContent: "center", alignItems: "center", }}
                                        disabled={false}
                                        onPress={this.saveUserFeedback.bind(this, availableanswer)} >
                                        <Text style={{ color: "#fff", fontSize: 17, fontFamily: 'Avenir-Heavy' }}>{"Save"}</Text>
                                    </TouchableOpacity>
                                </LinearGradient>
                                : undefined
                        }
                    </ScrollView>
                </SafeAreaView>
            </>
        )
    }
}
const styles = {
    backbuttonContainer: {
        width: "20%",
        height: 54,
        backgroundColor: "transparent",
        justifyContent: Platform.OS === 'ios' ? "center" : "center",
        alignItems: "center"
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
    row: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingVertical: 5,
        marginVertical: 10
    }
}
class Checkbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOptions: [],
            showDate: false
        }
    }
    // uncheckData(key, data) {
    //     let options = this.state.selectedOptions;
    //     let array_index = this.state.selectedOptions.indexOf(data._id)
    //     options.splice(array_index, 1);
    //     data.selected = false;
    //     this.props.callmyCheckbox(this.state.selectedOptions)
    // }
    componentDidMount() {
        this.state.selectedOptions = [];
    }
    show(answer) {
        return (
            <Text>{answer}</Text>
        )
    }

    selectDayValue = (itemValue, itemIndex, answers) => {
        answers.dynamicvalue = itemValue;
        // answers.selected = true;
        this.setState({ showDate: false })
        console.log("selectDayValue", answers)

        this.props.selectAnswer(answers)
    }
    selectOptions(itemValue, itemIndex, answers) {
        answers.dynamicvalue = itemValue;
        this.setState({ showDate: false })
        this.props.selectAnswer(answers)
    }
    renderPickeroption() {
        return days.map((facility, i) => {
            return <Picker.Item key={i} value={facility.id} label={facility.label} />
        })
    }
    renderOptions(answer, dynamicvalue) {
        return days.map((facility, i) => {
            return (
                <TouchableOpacity
                    key={i}
                    style={{ backgroundColor: dynamicvalue === facility.label ? "#F5F5F5" : "#fff", height: 42, justifyContent: "center", paddingHorizontal: 16 }}
                    onPress={() => this.selectOptions(facility.label, facility.i, answer)}>
                    <Text style={{ color: dynamicvalue === facility.label ? global.gradientsecondry : "#000" }}> {facility.label} </Text>
                </TouchableOpacity>
            )
        })
    }
    renderCheckboxes() {
        return this.props.data.map((answer, key) => {
            return <View key={key} style={{}}>
                {
                    answer.selected ?
                        <TouchableOpacity style={styles.row} onPress={() => this.props.selectAnswer(answer)}>
                            <View style={{ backgroundColor: "transparent", flex: 2 }}>
                                <Image source={checked}
                                    style={{
                                        width: 24, height: 24,
                                    }}
                                    resizeMethod='resize'
                                    resizeMode="contain"
                                />
                            </View>
                            <View style={{ backgroundColor: "transparent", flex: 8 }}>
                                <Text style={[styles.answerTxt]}>{answer.containVariable ? _.replace(answer.answer, new RegExp("{{days}}"), answer.dynamicvalue ? answer.dynamicvalue : 2) : answer.answer}</Text>
                            </View>
                        </TouchableOpacity>
                        :
                        answer.containVariable ?
                            <View style={styles.row}>
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
                                {
                                    IS_ANDROID ?
                                        <>
                                            <TouchableOpacity
                                                style={{ backgroundColor: "transparent", flex: 8 }}
                                                onPress={() => this.setState({ showDate: true })}
                                            >
                                                <Text style={[styles.answerTxt]}>
                                                    {answer.containVariable ? _.replace(answer.answer, new RegExp("{{days}}"), answer.dynamicvalue ? answer.dynamicvalue : 2) : answer.answer}
                                                </Text>
                                            </TouchableOpacity>
                                            <Modal backdropOpacity={0.5}
                                                isVisible={this.state.showDate}
                                                onBackdropPress={() => this.setState({ showDate: false })}
                                                onBackButtonPress={() => this.setState({ showDate: false })}
                                                style={{ padding: 0, marginTop: '50%' }}>
                                                <View>
                                                    {
                                                        this.renderOptions(answer, answer.dynamicvalue ? answer.dynamicvalue : 2)
                                                    }
                                                </View>
                                            </Modal>
                                        </>
                                        :
                                        <>
                                            <TouchableOpacity
                                                style={{ backgroundColor: "transparent", flex: 8 }}
                                                onPress={() => this.setState({ showDate: true })}
                                            >
                                                <Text style={[styles.answerTxt]}>
                                                    {answer.containVariable ? _.replace(answer.answer, new RegExp("{{days}}"), answer.dynamicvalue ? answer.dynamicvalue : 2) : answer.answer}
                                                </Text>
                                            </TouchableOpacity>
                                            <Modal backdropOpacity={0.5}
                                                isVisible={this.state.showDate}
                                                onBackdropPress={() => this.setState({ showDate: false })}
                                                onBackButtonPress={() => this.setState({ showDate: false })}
                                                style={{ padding: 0, margin: 0 }}>
                                                <View style={{ marginTop: "80%", backgroundColor: "#FFF", }}>
                                                    <View style={{ backgroundColor: "#FFF", height: 200 }}>
                                                        <Picker
                                                            selectedValue={answer.dynamicvalue}
                                                            style={{ height: 50, width: IS_ANDROID ? 80 : undefined }}
                                                            onValueChange={(itemValue, itemIndex) => this.selectDayValue(itemValue, itemIndex, answer)}
                                                            itemStyle={styles.answerTxt}
                                                        >
                                                            {
                                                                this.renderPickeroption()
                                                            }
                                                        </Picker>
                                                    </View>
                                                    <View style={{ flexDirection: "row", height: 50, backgroundColor: "#FFF", borderTopWidth: 1 }}>
                                                        <TouchableOpacity style={{ flex: 1, height: 50, justifyContent: "center", alignItems: "center" }} onPress={() => this.setState({ showDate: false })}>
                                                            <Text>Cancel</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </Modal>
                                        </>
                                }
                            </View>
                            :
                            <TouchableOpacity  style={styles.row} onPress={() => this.props.selectAnswer(answer)}>
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
                                    <Text style={[styles.answerTxt]}>{answer.containVariable ? _.replace(answer.answer, new RegExp("{{days}}"), answer.dynamicvalue ? answer.dynamicvalue : 2) : answer.answer} </Text>{}
                                </View>
                            </TouchableOpacity>
                            
                }
            </View>
        })
    }
    render() {
        return (
            <>
                {
                    this.renderCheckboxes()
                }
            </>
        )
    }

}
