/* 
navigation
author : abhishekkalia
 */
import { createStackNavigator } from 'react-navigation';
import AuthScreen from '../Components/AuthScreen'
import LoginForm from '../Components/AuthScreen/LoginForm';
import SignupForm from '../Components/AuthScreen/SignupForm';
import Webinar from '../Components/Webinar';
import Questionnaire from '../Components/Questionnaire'
import ProfileScreen from '../Components/Profile';
import AppDrawerNavigator from './Appdrawer';
import I18n from '../i18n/I18n';
const App = createStackNavigator({
    Home: { screen: AppDrawerNavigator },
    Auth: { screen: AuthScreen },
    login: { screen: LoginForm },
    signup: { screen: SignupForm },
    profile: { screen: ProfileScreen },
    questionnaire: { screen: Questionnaire },
    webinar: { screen: Webinar }
}, {
        index: 0,
        initialRouteName: 'Auth',
        headerMode: 'none',
        navigationOptions: {
            gesturesEnabled: false
        }
    }
);
export default App;