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
// import { CheckBox } from 'react-native-elements'

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
            progressWidth: 50,
            selectedanswer: 2
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
    selectanswerkey(selectedanswer) {
        // console.warn("selectanswer key",Number(selectedanswer))
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
            return <View key={key} style={{}}>
                {
                    answer.selected ?
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                // backgroundColor:"red", 
                                paddingVertical: 5,
                                marginVertical: 10
                            }}
                            onPress={() => this.selectAnswer(key)}
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
                                <Text style={[styles.answerTxt]}>{answer.val}</Text>
                            </View>
                        </TouchableOpacity>
                        //  < CheckBox selectedanswer={this.state.selectedanswer} answer={answer} selectanswer={this.selectanswerkey} />
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
                            onPress={() => this.selectAnswer(key)}
                        >
                            <View style={{ backgroundColor: "transparent", flex: 2 }}>
                                <Image
                                    source={unchecked}
                                    style={{
                                        width: 24, height: 24,
                                        // alignSelf:"center"
                                    }}
                                    resizeMethod='resize'
                                    resizeMode="contain"
                                />
                            </View>
                            <View style={{ backgroundColor: "transparent", flex: 8 }}>
                                <Text style={[styles.answerTxt]}>{answer.val}</Text>
                            </View>
                        </TouchableOpacity>

                }
            </View>
        })
    }
    renderMeasureheight(data) {
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
        /*         
        return <View>
            {this.createTable()}
        </View>*/
    }
    createTable = () => {
        var heights = [],
            min = 4.0,
            max = 6;
        for (var i = min, l = max; i < l; i += 0.1) {
            heights.push(
                <TouchableOpacity style={styles.answerBtn} onPress={() => this.selectAnswer(key)}>
                    <Text style={styles.answerTxt}>{i.toFixed(1)}</Text>
                </TouchableOpacity>
            );
        }
        return heights
    }
    temprender(data) {
        return (
            <View style={{ flex: 1, flexDirection: "row", }}>
                <View style={{ flex: 1 }}>
                    <Image source={require('../../../assets/icons/upsidediamond.png')}
                        style={{
                            width: 24,
                            height: 24,
                            alignSelf: "center"
                        }}
                        resizeMethod='resize'
                        resizeMode="contain"
                    />
                    {this.renderMatchprefrence(data)}
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
                <View style={{ flex: 1 }}>
                    <Image source={require('../../../assets/icons/upsidediamond.png')}
                        style={{
                            width: 24,
                            height: 24,
                            alignSelf: "center"
                        }}
                        resizeMethod='resize'
                        resizeMode="contain"
                    />
                    {this.renderMatchprefrence(data)}
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
                                    <Text style={styles.answerTxt}>{answer.val}</Text>
                                </TouchableOpacity>
                            )
                    }

                </View>
            )
        })

    }

    render() {
        let { questionNum, questions, progressWidth } = this.state;
        let questionData = questions[questionNum - 1];
        console.log('questions are ', questionData);

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar
                    backgroundColor={Platform.OS === 'android' ? "#fff" : undefined}
                    barStyle="dark-content" />
                <View style={{height:54, marginHorizontal: 20, justifyContent:"flex-end"}}>
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
                            <Text style={styles.questionTitle}>{questionData.relatedto}</Text>
                            <Text style={styles.question}>{questionData.question}</Text>
                            {questionData.type == 'Measure_Height' ? <Text style={styles.questionTitle}>{questionData.heightTitle}</Text> : undefined}

                        </View>
                        <View style={styles.answerBox}>
                            {questionData.type == 'Measure_Height' ? <Image source={require('../../../assets/icons/upsidediamond.png')}
                                style={{
                                    width: 24,
                                    height: 24,
                                    alignSelf: "center"
                                }}
                                resizeMethod='resize'
                                resizeMode="contain"
                            /> : undefined}

                            {
                                questionData.type == 'options' ?
                                    (this.renderOptions(questionData.options)) : (
                                        questionData.type == 'checkbox' ? (this.renderCheckboxes(questionData.options)) : (questionData.type == 'matchprefrence' ? this.temprender(questionData.options) : this.renderMeasureheight(questionData.options))
                                    )
                            }
                            {questionData.type == 'Measure_Height' ? <Image source={require('../../../assets/icons/downsidediamond.png')}
                                style={{
                                    width: 24,
                                    height: 24,
                                    alignSelf: "center"
                                }}
                                resizeMethod='resize'
                                resizeMode="contain"
                            /> : undefined}

                            <LinearGradient
                                colors={['rgb(220,57, 134)', 'rgb(40,40,120)']}
                                start={{ x: 0, y: 1 }}
                                end={{ x: 1, y: 1 }}
                                style={{ borderRadius: 5, marginVertical: 20 }}
                            >
                                <TouchableOpacity style={{ height: 50, justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: "#fff", fontSize: 17, fontFamily: 'Avenir-Heavy' }}>SAVE</Text>
                                </TouchableOpacity>
                            </LinearGradient>
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
/* class CheckBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedanswer: ''
        }
    }
    select(selectedanswer) {
        this.setState({ selectedanswer: selectedanswer });
        // return this.props.selectanswer(selectedanswer)
    }
    render() {
        return (
            <TouchableOpacity
                key={this.props.answer.key}
                style={{
                    flex: 1,
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    // backgroundColor:"red", 
                    paddingVertical: 5,
                    marginVertical: 1
                }}
                onPress={() => this.select(this.props.answer.key)} >
                <View style={{ backgroundColor: "transparent", flex: 2 }}>
                    <Image
                        source={
                            this.state.selectedanswer === this.props.answer.key ?
                                require('../../../assets/icons/checked.png') :
                                require('../../../assets/icons/unchecked.png')
                        }
                        style={{
                            width: 24, height: 24,
                            // alignSelf:"center"
                        }}
                        resizeMethod='resize'
                        resizeMode="contain"
                    />
                </View>
                <View style={{ backgroundColor: "transparent", flex: 8 }}>
                    <Text style={[styles.answerTxt]}>{this.props.answer.val}</Text>
                </View>
            </TouchableOpacity>
        )
    }
} */
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
        paddingVertical: 40
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