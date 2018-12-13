import { StyleSheet } from 'react-native';

var styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingVertical : 20
        // justifyContent: 'center',
        // alignItems: 'center',
        // backgroundColor: '#F5FCFF',
    },
    profile: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#F5FCFF',
    },
    menu: {
        flex: 5,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#000',
    },
    logout: {
        // flex: 2,
        height: '15%',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'blue',
    },
    label: {
        fontSize: 22,
        fontFamily: 'Avenir-Book',
        color: "rgba(255, 255, 255, 0.6)",
        lineHeight : 52,
        // opacity: 0.6
    },
    usertitle:{
        fontSize: 30,
        fontFamily: 'Avenir-Medium',
        color: "#FFFFFF",
        alignSelf : 'center',
        // backgroundColor : "red",
        // lineHeight : 60

    }
})

export default styles;