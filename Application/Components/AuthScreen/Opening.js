import React, { Component, PropTypes } from 'react'
import { StyleSheet } from 'react-native'
import { Text, View } from 'react-native-animatable'
import LinearGradient from 'react-native-linear-gradient';

import { fontfamily } from '../../../global.json'
import CustomButton from '../CustomButton'
import metrics from '../../config/metrics'


export default class Opening extends Component {
    // static propTypes = {
    //   onCreateAccountPress: PropTypes.func.isRequired,
    //   onSignInPress: PropTypes.func.isRequired
    // }

    render() {
        return (
            <View style={styles.container}>
                <View animation={'zoomIn'} delay={600} duration={400} style={{ marginHorizontal: metrics.DEVICE_WIDTH * 0.1 }}>
                    <CustomButton
                        text={'SIGN UP'}
                        onPress={this.props.onCreateAccountPress}
                        buttonStyle={styles.createAccountButton}
                        textStyle={styles.createAccountButtonText}
                    />
                </View>
                <View style={styles.separatorContainer} animation={'zoomIn'} delay={700} duration={400}/>
 
                <View style={{ 
                    marginHorizontal: metrics.DEVICE_WIDTH * 0.05, 
                    paddingBottom: 52,
                    backgroundColor: "#fff", 
                    borderTopLeftRadius: 5, 
                    borderTopRightRadius: 5 
                    }}>
                    <View style={{ justifyContent: "center", alignItems: "center", height: 50 }}>
                        <Text style={{ color: "#696969", fontWeight: 'bold' }}>Already have an account ? <Text style={{ fontFamily: fontfamily,  color: 'rgb(40,40,120)' }}>Sign In</Text> </Text>
                    </View>
                    <View animation={'zoomIn'} delay={800} duration={400}>
                        <LinearGradient
                            colors={['rgb(220,57, 134)', 'rgb(40,40,120)']}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 1 }} style={styles.signInButton}>
                            <CustomButton
                                text={'SIGN IN'}
                                onPress={this.props.onSignInPress}
                                textStyle={styles.signInButtonText}
                            />
                        </LinearGradient>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        justifyContent: 'flex-end'
    },
    createAccountButton: {
        backgroundColor: '#fff'
    },
    createAccountButtonText: {
        color: 'rgb(40,40,120)'
    },
    separatorContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: 25
    },
    // separatorLine: {
    //     flex: 1,
    //     borderWidth: StyleSheet.hairlineWidth,
    //     height: StyleSheet.hairlineWidth,
    //     borderColor: '#9B9FA4'
    // },
    // separatorOr: {
    //     color: '#9B9FA4',
    //     marginHorizontal: 8
    // },
    signInButton: {
        marginHorizontal: metrics.DEVICE_WIDTH * 0.05,
        borderRadius: 5,
        width: metrics.DEVICE_WIDTH * 0.8
    },
    signInButtonText: {
        color: 'white'
    }
})
