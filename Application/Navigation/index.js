/* 
navigation
author : abhishekkalia
 */
import { createStackNavigator } from 'react-navigation';
import AuthScreen from '../Components/AuthScreen'
import LoginForm from '../Components/AuthScreen/LoginForm';
import SignupForm from '../Components/AuthScreen/SignupForm';
import ForgotPassword from '../Components/AuthScreen/ForgotPassword'
import Questionnaire from '../Components/Questionnaire'
import ProfileScreen from '../Components/Profile';
import AppDrawerNavigator from './Appdrawer';
import I18n from '../i18n/I18n';
import Basicinfo from '../Components/Basicinfo'
const App = createStackNavigator({
    home: { screen: AppDrawerNavigator },
    auth: { screen: AuthScreen },
    login: { screen: LoginForm },
    signup: { screen: SignupForm },
    forgotpassword: { screen: ForgotPassword },
    profile: { screen: ProfileScreen },
    questionnaire: { screen: Questionnaire },
    basicinfo : {screen :Basicinfo}
}, {
        index: 0,
        initialRouteName: 'auth',
        headerMode: 'none',
        navigationOptions: {
            gesturesEnabled: false
        }
    }
);
export default App;