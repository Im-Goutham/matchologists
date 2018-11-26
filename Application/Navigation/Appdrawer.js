import {createDrawerNavigator,createStackNavigator} from 'react-navigation';

import HomeScreen from '../Components/Home'
import Sidebar from '../Components/Sidebar'
import Chatroom from '../Components/Chatroom'
export default createDrawerNavigator(
    {
        homePage: {
            screen: Chatroom
        },
    },
    {
        initialRouteName: 'homePage',
        contentComponent: Sidebar,
        drawerWidth: 300
    });
