/* 
navigation
author : abhishekkalia
 */
import { createStackNavigator } from 'react-navigation';
import HomeScreen from '../Components/Home'
import  Userprofile from '../Components/Userprofile'

const HomestackNavigation = createStackNavigator({
    Home: { screen: HomeScreen },
    userprofile: {screen: Userprofile},
}, {
        index: 0,
        initialRouteName: 'Home',
        headerMode: 'none',
        navigationOptions: {
            gesturesEnabled: false
        }
    }
);
export default HomestackNavigation;