/* 
AppStack
author : abhishek kalia
 */
import { Platform } from "react-native";
import { createStackNavigator, createSwitchNavigator } from 'react-navigation';
import AuthScreen from '../Components/AuthScreen'
import LoginForm from '../Components/AuthScreen/LoginForm';
import SignupForm from '../Components/AuthScreen/SignupForm';
import ForgotPassword from '../Components/AuthScreen/ForgotPassword'
import Questionnaire from '../Components/Questionnaire'
import ProfileScreen from '../Components/Profile';
import AppDrawerNavigator from './Appdrawer';
import Basicinfo from '../Components/Basicinfo'
import AuthLoadingScreen from './AuthLoading';
import CmsContent from '../Components/CmsContent';
// import RangeSlider from '../Components/RangeSlider'
forVertical = (props) => {
    const { layout, position, scene } = props,
        index = scene.index,
        height = layout.initHeight,
        translateY = 0;
    translateX = position.interpolate({
        inputRange: ([index - 1, index, index + 1]),
        outputRange: ([height, 0, 0]),
    });
    const opacity = position.interpolate({
        inputRange: [index - 0.5, index],
        outputRange: [0.5, 1],
        extrapolate: 'clamp'
    });
    return { opacity, transform: [{ translateX }, { translateY }] };
}

const AppStack = createStackNavigator(
    {
        auth: { screen: AuthScreen },
        login: { screen: LoginForm },
        signup: { screen: SignupForm },
        forgotpassword: { screen: ForgotPassword },
        profile: { screen: ProfileScreen },
        questionnaire: { screen: Questionnaire },
        basicinfo: { screen: Basicinfo },
        cmscontent: { screen: CmsContent },
        // rangeslider:{screen:RangeSlider}
    },
    {
        mode: "modal",
        initialRouteName: 'auth',
        headerMode: "screen",
        navigationOptions: {
            header: null,
            gesturesEnabled: false,
        },
        transitionConfig: () => (Platform.OS === "ios" ? { screenInterpolator: forVertical } : {}),
        cardStyle: Platform.OS === "ios" ? { backgroundColor: "#FFF" } : {},
    }
);

const App = createSwitchNavigator(
    {
        AuthLoading: { screen: AuthLoadingScreen },
        appstack: { screen: AppStack },
        home: { screen: AppDrawerNavigator }
    },
    {
        initialRouteName: 'AuthLoading',
        // initialRoute:'',
        resetOnBlur:true,
        // paths:""
    }
);

export default App
