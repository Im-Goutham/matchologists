EventListStacknavigation/* 
NotificationStacknavigation
author : abhishek kalia
 */
import { createStackNavigator } from 'react-navigation';
import EventsList from '../Components/EventsList';
import Eventrules from '../Components/EventsList/Eventrules'

const EventListStacknavigation = createStackNavigator({
    eventsList: { screen: EventsList },
    eventrules : {screen : Eventrules}
}, {
        index: 0,
        initialRouteName: 'eventsList',
        headerMode: 'none',
        navigationOptions: {
            gesturesEnabled: false
        }
    }
);
export default EventListStacknavigation;