import React, { Component } from 'react';
import { View, FlatList, Text, Image, Animated, TouchableOpacity } from "react-native";
import _ from 'lodash';
import Loading from '../Loading';

export default class SpeedDatingUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isloading: true,
            speedDatingUsers: [],
        }
        this.springValue = new Animated.Value(0)
    }
    spring() {
        this.springValue.setValue(0.3)
        Animated.spring(
            this.springValue,
            {
                toValue: 1,
                friction: 1
            }
        ).start()
    }

    componentDidMount = () => {
        setInterval(() => {
            this.spring()
        }, 1000);

        this.setState({
            speedDatingUsers: this.props.speedDatingUser,
            isloading: this.props.isloading
        })
    }
    componentWillReceiveProps = (nextProps, nextState) => {
        const CurrentspeedDatingusers = _.map(nextProps.speedDatingUser, (obj, key) => {
            // console.log('heere', obj);
            return key == 0 ? { ...obj, isHighlight: true } : obj;
        });
        console.log("CurrentspeedDatingusers", CurrentspeedDatingusers)
        this.setState({
            speedDatingUsers: CurrentspeedDatingusers,
            isloading: nextProps.isloading
        })
    }
    renderRow = (item) => {
        return <TouchableOpacity
            disabled={item && item.callStatus==="ongoing" ? false : true}
            style={{
                backgroundColor: item.isOpen ? "#FFF" : "#F5F5F5",
                flexDirection: "row",
                paddingHorizontal: 15,
                paddingVertical: 16,
                opacity: item.isHighlight ? 1 : 0.5
            }} onPress={() => this.props.navigate('speeddatinguserprofile', { userId: item.userId })}>
            <View style={{ flex: 2, justifyContent: "center", alignItems: "center", backgroundColor: "transparent" }}>
                <Image source={item.profilePic ? { uri: item.profilePic } : require('../../images/applogo.png')} style={{ width: 60, height: 60, borderRadius: 30 }} resizeMethod="resize" resizemode="contain" />
            </View>
            <View style={{ flex: 8, backgroundColor: "transparent", justifyContent: "center", justifyContent: "center", paddingHorizontal: 15 }}>
                <Text style={{ color: "#3E3E47", fontSize: 17, fontFamily: "Avenir-Heavy", lineHeight: 22, }}>{item.fullName ? item.fullName : ''}</Text>
                <View style={{ justifyContent: 'space-between', alignItems: "flex-end" }}>
                    {
                       item && item.callStatus==="ongoing" ? <Animated.Image style={{ width: 40, height: 25, transform: [{ scale: this.springValue }] }}
                            source={require('../../images/icons/noun_live.png')}
                            resizeMethod="resize" resizemode="contain"
                        />
                            : undefined
                    }
                </View>
            </View>
        </TouchableOpacity>
    }
    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "75%",
                    backgroundColor: "#CED0CE",
                    marginLeft: "25%"
                }}
            />
        );
    };
    render() {
        if (this.state.isloading) {
            return <Loading />
        }
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.speedDatingUsers}
                    renderItem={({ item }) => this.renderRow(item)}
                    ItemSeparatorComponent={this.renderSeparator}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        )
    }
}
const styles = {
    container: {
        flex: 1
    }
}