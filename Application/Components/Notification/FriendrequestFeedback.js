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
import _ from 'lodash';
import BaseFormComponent from '../Common/BaseFormComponent'
import * as global from '../../../global.json';
import checked from '../../../assets/icons/checked.png';
import unchecked from '../../../assets/icons/unchecked.png';
import Modal from "react-native-modal";
import Loading from '../Loading';
import Apirequest from '../Common/Apirequest';
import CustomTextInput from "../CustomTextInput";
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
        Apirequest.getFeedbackQuestions(token, state.params.eventNamepoint, resolve => {
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

    updateNotificationStatus = async () => {
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
    changeChatStatus = () => {
        const { state, goBack } = this.props.navigation
        var token = state.params.token;
        var chatReceiverId = state.params.data;
        var Data = {
            "profileUserId": chatReceiverId.receiverId
        }
        console.log("changeChatStatus_token", token)
        console.log("changeChatStatus_Data", Data)
        Apirequest.changeChatStatus(token, Data, resolve => {
            console.log("changeChatStatus_resolve", resolve)

            state.params.checkemitRequest(Data)
            // data = {}
            goBack()

        }, reject => {
            console.log("changeChatStatus_reject", reject)
        })
    }
    selectanswerForRadio = async (answer, availableanswer) => {
        const { questionData, questionindex } = this.state;
        const { state } = this.props.navigation
        var usersData = state.params.data;
        console.log("usersData", usersData)
        let currentQuestion = questionData[questionindex];
        await _.map(currentQuestion.answers, (answer) => { return answer.selected = false });
        data.feedbackReceiver =  usersData && usersData.receiverId ? usersData.receiverId: usersData.userId;
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
        console.log("saveUserFeedback_data", data)
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
        // console.log("renderMultipleOption----------->", availableanswer)
        return <Checkbox
            selectedDate={this.state.selectedDate}
            showDatePicker={this.showDatePicker.bind(this)}
            data={availableanswer}
            getmyvalue={this.getmyvalue.bind(this)}
            selectAnswer={this.selectAnswerCheckbox.bind(this)}
        />

    }
    selectAnswerCheckbox(answer, datechoosen) {
        console.log("answer++++***", answer)
        // console.log("datechoosen++++***", datechoosen)
        const { questionData, questionindex } = this.state;
        const { state } = this.props.navigation
        var usersData = state.params.data;
        let currentQuestion = questionData[questionindex];
        console.log("selectAnswerCheckbox_usersData", usersData)
        _.map(currentQuestion.answers, (answer) => { return answer.selected = false, answer.dynamicvalue = ''; });
        answer && answer.selected ? answer.selected = false : answer ? answer.selected = true : undefined;
        answer && answer.selected ? answer.dynamicvalue = datechoosen : answer.dynamicvalue = 2
        data.feedbackReceiver = usersData && usersData.senderId ? usersData.senderId : usersData.receiverId ? usersData.receiverId : usersData.userId ;
        data.feedbackType = currentQuestion._id.category;
        data.questionId = currentQuestion._id._id;
        data.answerId = answer._id;
        answer.containVariable ? data.variableValue = { days: answer.dynamicvalue } : data.variableValue = {}
        answer.isDisplayTextBox ? data.variableValue = { textMessage: datechoosen } : data.variableValue = {}
        this.setState({
            questionData: this.state.questionData,
            saveanswer: !answer.selected ? false : true
        });
        console.log("selectAnswerCheckbox_+++++===>", data)
    }

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
            if (state.params.eventNamepoint === 'chatfeedback') {
                this.changeChatStatus()
                return
            }
            if (currentQuestion && currentQuestion._id && currentQuestion._id.isPositive) {
                console.log("going to positive")
                this.updateNotificationStatus()
                return
            }
            else if (currentQuestion && currentQuestion._id && currentQuestion._id.isNegative) {
                console.log("going to negative")
                this.updateNotificationStatus()
                return
            }
        }, reject => {
            console.log("saveUserFeedback_reject", reject)
            this.showSimpleMessage("", { backgroundColor: global.gradientsecondry }, "", reject.message)
        })
    }
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
                                {/* <Text style={styles.questionTitle}>{currentQuestion._id.questionFor}</Text> */}
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
        // answers.dynamicvalue = itemValue;
        this.setState({ showDate: false })
        console.log("selectDayValue", answers)

        this.props.selectAnswer(answers, itemValue)
    }
    // selectOptions(itemValue, itemIndex, answers) {
    // console.log("selectOptions_itemValue",itemValue)
    // console.log("selectOptions_itemIndex",itemIndex)
    // console.log("selectOptions_answers",answers)
    //     answers.dynamicvalue = itemValue;
    //     this.setState({ showDate: false })
    //     this.props.selectAnswer(answers)
    // }
    // renderPickeroption() {
    //     return days.map((facility, i) => {
    //         return <Picker.Item key={i} value={facility.id} label={facility.label} />
    //     })
    // }
    // renderOptions(answer, dynamicvalue) {
    //     return days.map((facility, i) => {
    //         return (
    //             <TouchableOpacity
    //                 key={i}
    //                 style={{ backgroundColor: dynamicvalue === facility.label ? "#F5F5F5" : "#fff", height: 42, justifyContent: "center", paddingHorizontal: 16 }}
    //                 onPress={() => this.selectOptions(facility.label, facility.i, answer)}>
    //                 <Text style={{ color: dynamicvalue === facility.label ? global.gradientsecondry : "#000" }}> {facility.label} </Text>
    //             </TouchableOpacity>
    //         )
    //     })
    // }
    // otherOptions=(answers)=>{
    //     this.props.selectAnswer(answers, itemValue)
    // }
    getOtherValue = (cbvalue) => {
        this.props.selectAnswer(cbvalue.answer, cbvalue.inputValue)
        // console.log("getOtherValue", cbvalue)
    }
    renderCheckboxes() {
        return this.props.data.map((answer, key) => {
            return <View key={key} style={{}}>
                {
                    // answer.selected ?
                    //     <TouchableOpacity style={styles.row} onPress={() => this.props.selectAnswer(answer)}>
                    //         <View style={{ backgroundColor: "transparent", flex: 2 }}>
                    //             <Image source={checked}
                    //                 style={{
                    //                     width: 24, height: 24,
                    //                 }}
                    //                 resizeMethod='resize'
                    //                 resizeMode="contain"
                    //             />
                    //         </View>
                    //         <View style={{ backgroundColor: "transparent", flex: 8 }}>
                    //             <Text style={[styles.answerTxt]}>{answer.containVariable ? _.replace(answer.answer, new RegExp("{{days}}"), answer.dynamicvalue ? answer.dynamicvalue : 2) : answer.answer}</Text>
                    //         </View>
                    //     </TouchableOpacity>
                    //     :
                    answer.containVariable ?
                        <View style={styles.row}>
                            <View style={{ backgroundColor: "transparent", flex: 2 }}>
                                {
                                    answer.selected ?
                                        <Image source={checked}
                                            style={{
                                                width: 24, height: 24,
                                            }}
                                            resizeMethod='resize'
                                            resizeMode="contain"
                                        />
                                        :
                                        <Image
                                            source={unchecked}
                                            style={{
                                                width: 24,
                                                height: 24,
                                            }}
                                            resizeMethod='resize'
                                            resizeMode="contain"
                                        />
                                }
                            </View>
                            {
                                <RenderOptions
                                    answer={answer}
                                    showDate={this.state.showDate}
                                    dynamicvalue={2}
                                    selectOptions={this.selectDayValue.bind(this)}
                                    selectDayValue={this.selectDayValue.bind(this)}
                                />
                            }
                        </View>
                        :
                        answer.isDisplayTextBox ?
                            <View style={{ paddingBottom: 30 }}> 
                                <TouchableOpacity style={styles.row} onPress={() => this.props.selectAnswer(answer)}>
                                    <View style={{ backgroundColor: "transparent", flex: 2 }}>
                                    {
                                    answer.selected ?
                                        <Image source={checked}
                                            style={{
                                                width: 24, height: 24,
                                            }}
                                            resizeMethod='resize'
                                            resizeMode="contain"
                                        />
                                        :
                                        <Image
                                            source={unchecked}
                                            style={{
                                                width: 24,
                                                height: 24,
                                            }}
                                            resizeMethod='resize'
                                            resizeMode="contain"
                                        />
                                }
                                    </View>
                                    <View style={{ backgroundColor: "transparent", flex: 8 }}>
                                        <Text style={[styles.answerTxt]}>{answer.containVariable ? _.replace(answer.answer, new RegExp("{{days}}"), answer.dynamicvalue ? answer.dynamicvalue : 2) : answer.answer} </Text>{}
                                    </View>
                                </TouchableOpacity>
                                <InputContainer
                                    answer={answer}
                                    getOtherValue={this.getOtherValue.bind(this)}
                                />
                            </View>
                            :
                            <TouchableOpacity style={styles.row} onPress={() => this.props.selectAnswer(answer)}>
                                <View style={{ backgroundColor: "transparent", flex: 2 }}>
                                {
                                    answer.selected ?
                                        <Image source={checked}
                                            style={{
                                                width: 24, height: 24,
                                            }}
                                            resizeMethod='resize'
                                            resizeMode="contain"
                                        />
                                        :
                                        <Image
                                            source={unchecked}
                                            style={{
                                                width: 24,
                                                height: 24,
                                            }}
                                            resizeMethod='resize'
                                            resizeMode="contain"
                                        />
                                }
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
class InputContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            otherOption: ""
        }
    }
    handleValueChange = (otherOption) => {
        // this.setState({
        //     otherOption
        // }, () => this.props.getOtherValue({ inputValue: otherOption, answer: this.props.answer }))
        this.props.getOtherValue({ inputValue: otherOption, answer: this.props.answer })
    }
    render() {
        // console.log("InputContainer.answer", this.props.answer.dynamicvalue)
        return (
            <>
                {
                    this.props.answer.selected ?
                    <CustomTextInput
                        value={this.props.answer.dynamicvalue}
                        placeholder="Type your reason here"
                        onChangeText={this.handleValueChange.bind(this)}
                    />
                    : undefined
                }
            </>
        )
    }
}
class RenderOptions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDate: false
        }
    }
    selectDate(label, indexValue, answer) {
        // console.log("label",label)
        // console.log("indexValue",indexValue)
        // console.log("answer", answer)
        this.setState({
            showDate: !this.state.showDate
        }, () => this.props.selectOptions(label, indexValue, answer))
    }
    renderOptions(answer, dynamicvalue) {
        return days.map((facility, i) => {
            return (
                <TouchableOpacity
                    key={i}
                    style={{ backgroundColor: dynamicvalue === facility.label ? "#F5F5F5" : "#fff", height: 42, justifyContent: "center", paddingHorizontal: 16 }}
                    onPress={() => this.selectDate(facility.label, facility.i, answer)}>
                    <Text style={{ color: dynamicvalue === facility.label ? global.gradientsecondry : "#000" }}> {facility.label} </Text>
                </TouchableOpacity>
            )
        })
    }
    renderPickeroption() {
        return days.map((facility, i) => {
            return <Picker.Item key={i} value={facility.id} label={facility.label} />
        })
    }
    render() {
        return (
            <>
                {
                    IS_ANDROID ?
                        <>
                            <TouchableOpacity
                                style={{ backgroundColor: "transparent", flex: 8 }}
                                onPress={() => this.setState({ showDate: true })}
                            >
                                <Text style={[styles.answerTxt]}>

                                    {this.props.answer.containVariable ? _.replace(this.props.answer.answer, new RegExp("{{days}}"), this.props.answer.dynamicvalue ? this.props.answer.dynamicvalue : 2) : this.props.answer.answer}
                                </Text>
                            </TouchableOpacity>
                            <Modal backdropOpacity={0.5}
                                isVisible={this.state.showDate}
                                onBackdropPress={() => this.setState({ showDate: false })}
                                onBackButtonPress={() => this.setState({ showDate: false })}
                                style={{ padding: 0, marginTop: '50%' }}>
                                <View>
                                    {
                                        this.renderOptions(this.props.answer, this.props.dynamicvalue)
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
                                    {this.props.answer.containVariable ? _.replace(this.props.answer.answer, new RegExp("{{days}}"), this.props.answer.dynamicvalue ? this.props.answer.dynamicvalue : 2) : this.props.answer.answer}
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
                                            selectedValue={this.props.dynamicvalue}
                                            style={{ height: 50, width: IS_ANDROID ? 80 : undefined }}
                                            onValueChange={(itemValue, itemIndex) => this.selectDate(itemValue, itemIndex, this.props.answer)}
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
            </>

        )
    }
}
