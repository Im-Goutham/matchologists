import {createDrawerNavigator,createStackNavigator} from 'react-navigation';

import HomeScreen from '../Components/Home'
import Sidebar from '../Components/Sidebar'
import Chatroom from '../Components/Chatroom'
import metrics from '../config/metrics'

const window_width = metrics.DEVICE_WIDTH

export default createDrawerNavigator(
    {
        homePage: {
            screen: HomeScreen
        },
    },
    {
        initialRouteName: 'homePage',
        contentComponent: Sidebar,
        drawerWidth: window_width
    });
