
import {AppRegistry} from 'react-native';
// import App from './App';
import {name as appName} from './app.json';

import App from './Application/Navigation';
// import Auth from './Application/Components/Auth'
import ForgotPassword from './Application/Components/AuthScreen/ForgotPassword'
import Questionnaire from './Application/Components/Questionnaire'
// import  Userprofile from './Application/Components/Userprofile'
// import SearchMember from './Application/Components/SearchMember/index'

AppRegistry.registerComponent(appName, () => App);
