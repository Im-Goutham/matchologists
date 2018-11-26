import React, { Component } from 'react';

export default class BaseFormComponent extends Component{
    handleChange = (event) => {
        let isFormValid = true;

        let form = { ...this.state.form };

        this.setState({ 
            form : {
                chat : {
                    value: event,
                    validate: false,
                    valid: false,
                    error: '',
                }
            }
        });
        console.log(form.chat.value)
    }

}