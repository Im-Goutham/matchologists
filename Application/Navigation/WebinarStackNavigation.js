/* 
navigation
author : abhishekkalia
 */
import { createStackNavigator } from 'react-navigation';
import Webinar from '../Components/Webinar';
import ScheduledWebinar from '../Components/Webinar/ScheduledWebinar'
const WebinarStackNavigation = createStackNavigator({
    list: {screen:ScheduledWebinar},
    webinar: { screen: Webinar },

}, {
        index: 0,
        initialRouteName: 'list',
        headerMode: 'none',
        navigationOptions: {
            gesturesEnabled: false
        }
    }
);
export default WebinarStackNavigation;