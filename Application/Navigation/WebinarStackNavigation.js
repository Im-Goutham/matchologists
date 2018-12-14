/* 
navigation
author : abhishekkalia
 */
import { createStackNavigator } from 'react-navigation';
import Webinar from '../Components/Webinar';
import ScheduledWebinar from '../Components/Webinar/ScheduledWebinar'
import SubscribeScreen from '../Components/Webinar/SubscribeScreen'
import UpcomingWebinar from '../Components/Webinar/UpcomingWebinar'
const WebinarStackNavigation = createStackNavigator({
    subscribe: { screen: SubscribeScreen },
    list: { screen: ScheduledWebinar },
    upcomingwebinar: { screen: UpcomingWebinar },
    golive: { screen: Webinar },
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