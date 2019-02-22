/* 
NotificationStacknavigation
author : abhishek kalia
 */
import { createStackNavigator } from 'react-navigation';
import Notification from '../Components/Notification'

const NotificationStacknavigation = createStackNavigator({
    notification: { screen: Notification },

}, {
        index: 0,
        initialRouteName: 'notification',
        headerMode: 'none',
        navigationOptions: {
            gesturesEnabled: false
        }
    }
);
export default NotificationStacknavigation;