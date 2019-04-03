EventListStacknavigation/* 
NotificationStacknavigation
author : abhishek kalia
 */
import { createStackNavigator } from 'react-navigation';
import EventsList from '../Components/EventsList';

const EventListStacknavigation = createStackNavigator({
    eventsList: { screen: EventsList },

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