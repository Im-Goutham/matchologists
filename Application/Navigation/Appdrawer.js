import {createDrawerNavigator,createStackNavigator} from 'react-navigation';

import HomeScreen from '../Components/Home'
import Sidebar from '../Components/Sidebar'
import Chatroom from '../Components/Chatroom'
import metrics from '../config/metrics'
import HomestackNavigation from './HomestackNavigation'
import SettingStacknavigation from './SettingStacknavigation'
import TopProfilestackNavigation from './TopProfilestackNavigation'
import CalenderStacknavigation from './CalenderStacknavigation'
import NotificationStacknavigation from './NotificationStacknavigation'
import FeedbackStacknavigation from './FeedbackStacknavigation';
import WebinarStackNavigation from './WebinarStackNavigation';

const window_width = metrics.DEVICE_WIDTH

export default createDrawerNavigator(
    {
        homePage: {
            screen: HomestackNavigation
        },
        topprofile:{
            screen:TopProfilestackNavigation
        },
        setting:{
            screen:SettingStacknavigation
        },
        calender:{
            screen : CalenderStacknavigation
        },
        notification:{
            screen : NotificationStacknavigation
        },
        feedback : {
            screen : FeedbackStacknavigation
        },
        Webinar : {
            screen : WebinarStackNavigation
        }
    },
    {
        initialRouteName: 'Webinar',
        contentComponent: Sidebar,
        drawerWidth: window_width
    });
