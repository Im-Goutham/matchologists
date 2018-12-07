/* 
navigation
author : abhishekkalia
 */
import { createStackNavigator } from 'react-navigation';
import FeedBackInbox from '../Components/FeedBackInbox';
import FeedBackDetail from '../Components/FeedBackInbox/FeedBackDetail'
const FeedbackStacknavigation = createStackNavigator({
    feedBackinbox: { screen: FeedBackInbox },
    feedbackdetail:{screen:FeedBackDetail}

}, {
        index: 0,
        initialRouteName: 'feedBackinbox',
        headerMode: 'none',
        navigationOptions: {
            gesturesEnabled: false
        }
    }
);
export default FeedbackStacknavigation;