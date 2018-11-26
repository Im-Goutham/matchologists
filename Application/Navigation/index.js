/* 
navigation
author : abhishekkalia
 */
import { createStackNavigator } from 'react-navigation';
import ProfileScreen from '../Components/Profile';
import AppDrawerNavigator from './Appdrawer';
import I18n from '../i18n/I18n';
const App = createStackNavigator({
    Home: { screen: AppDrawerNavigator },
    Profile: { screen: ProfileScreen },
}, {
        // index: 0,
        // initialRouteName: 'home',
        headerMode: 'none',
        navigationOptions: {
            gesturesEnabled: false
        }
    }
);
export default App;