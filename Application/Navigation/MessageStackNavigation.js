/* 
MessageStacknavigation
author : abhishekkalia
 */

import { createStackNavigator } from 'react-navigation';
import Chatroom from '../Components/Chatroom'
import ChatScreen from '../Components/Chatroom/ChatScreen'
import SpeeddatingliveCall from '../Components/Chatroom/SpeeddatingliveCall';
import UserChatlist from '../Components/Chatroom/UserChatlist'
import LiveCall from '../Components/Chatroom/LiveCall'

const MessageStacknavigation = createStackNavigator({
    chatroom: { screen: Chatroom },
    chatlist: { screen: UserChatlist },
    chatscreen: { screen: Chatroom },
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