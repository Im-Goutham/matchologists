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
    TouchableWithoutFeedback
} from 'react-native'
import { Image } from 'react-native-animatable'
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import I18n from 'react-native-i18n';
import { CheckBox } from 'react-native-elements'

import checked from '../../../assets/icons/checked.png'
import unchecked from '../../../assets/icons/unchecked.png'
import { questionary } from './questions.json'
import { avenirheavy, primarybg } from '../../../global.json'
import CustomButton from '../CustomButton'

import metrics from '../../config/metrics'



if (Platform.OS === 'android') UIManager.setLayoutAnimationEnabledExperimental(true)

export default class Questionnaire extends Component {

    constructor() {
        super();
        this.state = {
            questions: questionary,
            questionNum: 1,
            progressWidth: 50
        }
    }

    componentDidMount() {
        this.calculateProgressWidth();
    }

    calculateProgressWidth() {
        let { questionNum, questions } = this.state;
        let progressWidth = (metrics.DEVICE_WIDTH - 40) / questions.length;
        console.log('metrics.DEVICE_WIDTH-40  is ', metrics.DEVICE_WIDTH - 40)
        console.log('progressWidth  is ', progressWidth);
        progressWidth = progressWidth * questionNum;
        this.setState({ progressWidth });
    }

    skipQuestion() {
        console.log('calleddd is  ');
        let { questionNum, questions } = this.state;
        questionNum = questionNum + 1;
        console.log('question is  ', questionNum, 'total ', questions.length);
        if (questionNum <= questions.length) {
            this.setState({ questionNum }, () => {
                this.calculateProgressWidth();
            });
        }
    }

    selectAnswer(key) {
        let { questions, questionNum } = this.state;
        let questionData = questions[questionNum - 1];
        var selected = questionData.options[key].selected;
        selected = !selected;
        if (selected) {
            questionData.options.map((answer, key1) => {
                questionData.options[key1].selected = false;
            })
        }
        questionData.options[key].selected = selected;
        questions[questionNum - 1] = questionData;
        this.setState({ questions });
    }


    renderOptions(data) {
        return data.map((answer, key) => {
            return <View key={key}>
                {
                    answer.selected ? (
                        <LinearGradient
                            colors={['rgb(220,57, 134)', 'rgb(40,40,120)']}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 1 }}
                            style={[styles.answerBtn, { backgroundColor: 'white' }]}
                        >
                            <TouchableOpacity
                                style={[styles.answerBtn, { backgroundColor: 'white', width: metrics.DEVICE_WIDTH - 60 - 2, height: 50, marginHorizontal: 5 }]}
                                onPress={() => this.selectAnswer(key)}
                            >
                                <Text style={[styles.answerTxt, { color: '#313138', fontFamily: 'Avenir-Heavy' }]}>{answer.val}</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    ) : (
                            <TouchableOpacity style={styles.answerBtn} onPress={() => this.selectAnswer(key)}>
                                <Text style={styles.answerTxt}>{answer.val}</Text>
                            </TouchableOpacity>
                        )
                }
            </View>
        })
    }
    renderCheckboxes(data) {
        return data.map((answer, key) => {
            return <LinearGradient
                key={key}
                colors={['rgb(220,57, 134)', 'rgb(40,40,120)']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
                style={[{
                    backgroundColor: 'red',
                    // width : 100, 
                    // height:50
                }]}
            >
                <CheckBox
                    checkedIcon={<Icon name="check-square-o" size={24} color="#000" />}
                    center={true}
                    checked={true}
                    color="transparent"
                    containerStyle={{ backgroundColor: ['rgb(220,57, 134)', 'rgb(40,40,120)'] }}
                />

            </LinearGradient>
        })
    }




    render() {

        let { questionNum, questions, progressWidth } = this.state;
        let questionData = questions[questionNum - 1];

        return (
            <SafeAreaView>
                {Platform.OS === 'android' ? <StatusBar barStyle="dark-content" backgroundColor="#fff" /> : undefined}
                <View style={{ marginHorizontal: 20 }}>
                    <View style={styles.totalProgress}>
                        <View style={[styles.progress, { width: progressWidth }]}></View>
                    </View>
                    <Text style={styles.questionNum}>Question {questionNum}/{questions.length}</Text>
                </View>

                <ScrollView
                    style={styles.container}
                >
                    <View style={{ paddingHorizontal: 10 }}>
                        <View style={styles.questionBox}>
                            <Text style={styles.questionTitle}>About Yourself</Text>
                            <Text style={styles.question}>{questionData.question}</Text>
                        </View>
                        <View style={styles.answerBox}>
                            {
                                questionData.type == 'options' ? (
                                    this.renderOptions(questionData.options)
                                ) : (
                                        questionData.type == 'checkbox' ? (
                                            this.renderCheckboxes(questionData.options)
                                        ) : (
                                                this.renderOptions(questionData.options)
                                            )

                                    )
                            }
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => this.skipQuestion()}>
                        <Text style={styles.skipTxt}>SKIP</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
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
        paddingVertical: 50
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
        paddingVertical: 10
    },
    answerBtn: {
        height: 52,
        borderRadius: 26,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(233,233,234)',
        marginVertical: 10
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