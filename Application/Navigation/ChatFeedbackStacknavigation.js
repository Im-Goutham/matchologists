/* 
FeedbackStacknavigation
author : abhishek kalia
 */
import { createStackNavigator } from 'react-navigation';
import MessageStackNavigation from './MessageStackNavigation'
// import FriendrequestFeedback from './Components/Notification/FriendrequestFeedback.js';
import FriendrequestFeedback from '../Components/Notification/FriendrequestFeedback';

const ChatFeedbackStacknavigation = createStackNavigator({
    MessageStackNavigation: {screen : MessageStackNavigation},
    chatfeedback : { screen : FriendrequestFeedback}
}, {
        index: 0,
        initialRouteName: 'MessageStackNavigation',
        headerMode: 'none',
        navigationOptions: {
            gesturesEnabled: false
        }
    }
);
export default ChatFeedbackStacknavigation;