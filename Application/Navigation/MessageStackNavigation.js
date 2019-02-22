/* 
MessageStacknavigation
author : abhishekkalia
 */

import { createStackNavigator } from 'react-navigation';
import ChatScreen from '../Components/Chatroom/ChatScreen'
import UserChatlist from '../Components/Chatroom/UserChatlist'
import LiveCall from '../Components/Chatroom/LiveCall'

const MessageStacknavigation = createStackNavigator({
    chatlist: { screen: UserChatlist },
    chatscreen: { screen: ChatScreen },
    livecall: { screen: LiveCall }

}, {
        index: 0,
        initialRouteName: 'chatlist',
        headerMode: 'none',
        navigationOptions: {
            gesturesEnabled: false
        }
    }
);
export default MessageStacknavigation;