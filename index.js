/** @format */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// import App from './Application/Navigation';
import Auth from './Application/Components/Auth'
import SignupForm from './Application/Components/AuthScreen/SignupForm'
import Questionnaire from './Application/Components/Questionnaire'



AppRegistry.registerComponent(appName, () => Questionnaire);
