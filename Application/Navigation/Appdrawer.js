/* 
createDrawerNavigator
author : abhishek kalia
 */
import { createDrawerNavigator } from 'react-navigation';
import Sidebar from '../Components/Sidebar'
import metrics from '../config/metrics'
import HomestackNavigation from './HomestackNavigation'
import SettingStacknavigation from './SettingStacknavigation'
import TopProfilestackNavigation from './TopProfilestackNavigation'
import CalenderStacknavigation from './CalenderStacknavigation'
import NotificationStacknavigation from './NotificationStacknavigation'
import FeedbackStacknavigation from './FeedbackStacknavigation';
import WebinarStackNavigation from './WebinarStackNavigation';
import MessageStackNavigation from './MessageStackNavigation';
import Notifications from '../Components/Notifications';

const window_width = metrics.DEVICE_WIDTH

export default createDrawerNavigator(
    {
        homePage: {
            screen: HomestackNavigation
        },
        notifications: {
            screen: Notifications
        },
        topprofile: {
            screen: TopProfilestackNavigation
        },
        setting: {
            screen: SettingStacknavigation
        },
        calender: {
            screen: CalenderStacknavigation
        },
        notification: {
            screen: NotificationStacknavigation
        },
        feedback: {
            screen: FeedbackStacknavigation
        },
        webinar: {
            screen: WebinarStackNavigation
        },
        message: {
            screen: MessageStackNavigation
        }
    },
    {
        initialRouteName: 'homePage',
        contentComponent: Sidebar,
        drawerWidth: window_width
    }
);
