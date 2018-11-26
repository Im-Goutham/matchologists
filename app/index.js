import React, { Component } from 'react';
import { Tab } from "./config/navigation";
import { Provider } from 'react-redux';
import store from '../Application/store';

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Tab />
            </Provider>
        );
    }
}