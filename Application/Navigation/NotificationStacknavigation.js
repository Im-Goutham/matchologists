/* 
NotificationStacknavigation
author : abhishek kalia
 */
import { createStackNavigator } from 'react-navigation';
import Notification from '../Components/Notification';
import FriendrequestFeedback from '../Components/Notification/FriendrequestFeedback'
import RejectionFeedback from '../Components/Speeddating/RejectionFeedback'

const NotificationStacknavigation = createStackNavigator({
    notification: { screen: Notification },
    friendrequestfeedback : { screen: FriendrequestFeedback},
    rejectionfeedback : {screen: RejectionFeedback}

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