/**
 * home page
 * Author :abhishekkalia
 */

import React, { Component } from 'react';
import { Text, View } from 'react-native';
import styles from './style'

export default class Sidebar extends Component {
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Text>View Profile</Text>
                <Text>View Matche</Text>
                <Text>Favorites List</Text>
                <Text>Change Password</Text>
                <Text>About Us</Text>
                <Text>Privacy</Text>
                <Text>Terms&Conditions</Text>
                <Text>Logout</Text>
            </View>
        );
    }
}
