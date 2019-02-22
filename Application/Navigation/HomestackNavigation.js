/* 
HomestackNavigation
author : abhishek kalia
 */
import { createStackNavigator } from 'react-navigation';
import HomeScreen from '../Components/Home'
import Userprofile from '../Components/Userprofile'
import SearchMember from '../Components/SearchMember'
import AboutUs from "../Components/CmsContent/aboutUs";

const HomestackNavigation = createStackNavigator({
    Home: { screen: HomeScreen },
    userprofile: { screen: Userprofile },
    searchmember: { screen: SearchMember },
    aboutus: { screen: AboutUs }
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