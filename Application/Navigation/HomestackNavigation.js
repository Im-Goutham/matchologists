/* 
navigation
author : abhishekkalia
 */
import { createStackNavigator } from 'react-navigation';
import HomeScreen from '../Components/Home'
import  Userprofile from '../Components/Userprofile'
import  SearchMember from '../Components/SearchMember'

const HomestackNavigation = createStackNavigator({
    Home: { screen: HomeScreen },
    userprofile: {screen: Userprofile},
    searchmember: {screen: SearchMember}
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