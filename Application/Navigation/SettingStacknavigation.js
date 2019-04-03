/* 
SettingStacknavigation
author : abhishek kalia
 */
import { createStackNavigator } from 'react-navigation';
import SettingScreen from '../Components/Setting';
import Changepassword from '../Components/AuthScreen/Changepassword'

const SettingStacknavigation = createStackNavigator({
    setting: { screen: SettingScreen },
    changepassword: { screen : Changepassword}
}, {
        index: 0,
        initialRouteName: 'setting',
        headerMode: 'none',
        navigationOptions: {
            gesturesEnabled: false
        }
    }
);
export default SettingStacknavigation;