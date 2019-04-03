
import { AppRegistry } from 'react-native';
import {name as appName} from './app.json';
// import App from './Application/Navigation';
import Root from './Application/Root';

// import CountrySelection from './Application/Components/AuthScreen/CountrySelection'
// import { App } from './Mob/index'
// import Sidebar from './Application/Components/Sidebar'
// import App  from "./shape/index";

AppRegistry.registerComponent(appName, () => Root);
require('./Application/Subscribe')
