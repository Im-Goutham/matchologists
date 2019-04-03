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
import SpeedDatingStacknavigation from './SpeedDatingStacknavigation';
import ChatFeedbackStacknavigation from './ChatFeedbackStacknavigation';
import Editprofile from '../Components/Basicinfo/Editprofile';
import EventListStacknavigation  from "./EventListStacknavigation";
const window_width = metrics.DEVICE_WIDTH

export default createDrawerNavigator(
    {
        homePage: {
            screen: HomestackNavigation
        },
        updateinformation: {
            screen: Editprofile
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
            screen: ChatFeedbackStacknavigation
        },
        eventList : {
            screen: EventListStacknavigation
        },
        speeddating : {
            screen:SpeedDatingStacknavigation
        }
    },
    {
        initialRouteName: 'homePage',
        contentComponent: Sidebar,
        drawerWidth: window_width
    }
);
