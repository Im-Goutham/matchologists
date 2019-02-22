/* 
SettingStacknavigation
author : abhishek kalia
 */
import { createStackNavigator } from 'react-navigation';
import SettingScreen from '../Components/Setting'

const SettingStacknavigation = createStackNavigator({
    setting: { screen: SettingScreen },
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