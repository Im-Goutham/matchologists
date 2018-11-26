import React from "react";
import { createBottomTabNavigator } from "react-navigation";

import Publish from '../views/Publish';
import Webinar from '../views/Webinar';
import Chats from '../views/Chats';

export const Tab = createBottomTabNavigator(
    {
        Publish: {
            key :"Publish",
            screen: Publish,
        },
        Webinar: {
            key :"Webinar", 
            screen: Webinar,
        },
        Chats: {
            key :"Chats",
            screen: Chats,
        }
    }, {
        tabBarPosition: 'bottom',
        swipeEnabled: true,
        tabBarOptions: {
            activeTintColor: '#f2f2f2',
            activeBackgroundColor: "#2EC4B6",
            inactiveTintColor: '#666',
            labelStyle: {
                fontSize: 18,
                padding: 12
            }
        }
    }
);