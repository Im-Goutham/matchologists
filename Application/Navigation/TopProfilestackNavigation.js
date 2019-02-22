/* 
TopProfilestackNavigation
author : abhishekkalia
 */
import { createStackNavigator } from 'react-navigation';
import TopProfile from '../Components/TopProfile'

const TopProfilestackNavigation = createStackNavigator({
    top10: { screen: TopProfile },
}, {
        index: 0,
        initialRouteName: 'top10',
        headerMode: 'none',
        navigationOptions: {
            gesturesEnabled: false
        }
    }
);
export default TopProfilestackNavigation;