/* 
CalenderStacknavigation
author : abhishek kalia
 */
import { createStackNavigator } from 'react-navigation';
import MyCalender from '../Components/MyCalender'

const CalenderStacknavigation = createStackNavigator({
    mycalender: { screen: MyCalender },
}, {
        index: 0,
        initialRouteName: 'mycalender',
        headerMode: 'none',
        navigationOptions: {
            gesturesEnabled: false
        }
    }
);
export default CalenderStacknavigation;