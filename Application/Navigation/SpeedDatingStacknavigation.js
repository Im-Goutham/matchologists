/* 
SettingStacknavigation
author : abhishek kalia
 */
import { createStackNavigator } from 'react-navigation';
import Speeddating from '../Components/Speeddating';
import SpeedDatingCall from '../Components/Speeddating/SpeedDatingCall';
import FriendrequestFeedback from '../Components/Notification/FriendrequestFeedback'

const SpeedDatingStacknavigation = createStackNavigator({
    speeddating: { screen: Speeddating },
    speeddatinglivecall: { screen: SpeedDatingCall },
    speeddatingfeedback: { screen: FriendrequestFeedback }
}, {
        index: 0,
        initialRouteName: 'speeddatinglivecall',
        headerMode: 'none',
        navigationOptions: {
            gesturesEnabled: false
        }
    }
);
export default SpeedDatingStacknavigation;