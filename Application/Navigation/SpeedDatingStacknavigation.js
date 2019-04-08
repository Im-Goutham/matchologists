/* 
SettingStacknavigation
author : abhishek kalia
 */
import { createStackNavigator } from 'react-navigation';
import Speeddating from '../Components/Speeddating';
import SpeedDatingCall from '../Components/Speeddating/SpeedDatingCall';
import Speeddatingfeedback from '../Components/Speeddating/Speeddatingfeedback'
// import FriendrequestFeedback from '../Components/Notification/FriendrequestFeedback'
import Userprofile from '../Components/Userprofile'

const SpeedDatingStacknavigation = createStackNavigator({
    speeddating: { screen: Speeddating },
    speeddatinglivecall: { screen: SpeedDatingCall },
    speeddatingfeedback: { screen: Speeddatingfeedback },
    speeddatinguserprofile : { screen : Userprofile}
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