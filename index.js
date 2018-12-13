
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './Application/Navigation';
import CountrySelection from './Application/Components/AuthScreen/CountrySelection'
AppRegistry.registerComponent(appName, () => App);
