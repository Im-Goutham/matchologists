import React from "react";
import {View, Text ,TouchableOpacity } from "react-native";
import TouchableView from "../../Application/Components/TouchableView";
class parent extends React.Component{
    constructor(props){
        super(props);
        this.state={
            button : true
        }
    }
    clickme=(event)=>{
        console.log(event)
    }
    render(){
        return(
            <View>
                <Child callback={this.clickme} buttonVlaue={ this.state.button}/>
                </View>
        )
    }
}

class Child extends React.Component{
    constructor(props){
        super(props);
        this.state={
            initvalue : this.props.buttonVlaue
        }
    }
    componentWillReceiveProps(nextprop, nextState){
        this.setState({
            initvalue:nextprop.buttonVlaue
        })
    }
    somefunction(){
        return initvalue
    }

    render(){
        const {callback} = this.props;
        return(
            <TouchableOpacity onPress={()=>this.somefunction()}>
            {initvalue ? <Text> play</Text>
                </TouchableOpacity>
        )
    }
}