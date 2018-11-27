/* 
navigation
author : abhishekkalia
 */
import { createStackNavigator } from 'react-navigation';
import AuthScreen from '../Components/AuthScreen'
import LoginForm from '../Components/AuthScreen/LoginForm';
import SignupForm from '../Components/AuthScreen/SignupForm';
import Webinar from '../Components/Webinar';

import ProfileScreen from '../Components/Profile';
import AppDrawerNavigator from './Appdrawer';
import I18n from '../i18n/I18n';
const App = createStackNavigator({
    Home: { screen: AppDrawerNavigator },
    Auth: { screen: AuthScreen },
    login: { screen: LoginForm },
    signup: { screen: SignupForm },
    webinar: { screen: Webinar }
}, {
        index: 0,
        initialRouteName: 'webinar',
        headerMode: 'none',
        navigationOptions: {
            gesturesEnabled: false
        }
    }
);
export default App;