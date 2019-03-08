// import React from 'react';
import SocketIOClient from 'socket.io-client';
import { baseurl as URL } from '../../../app.json';
let SocketChat = {
    connectSocket(){
        return this.socket = SocketIOClient(URL); 
        // console.log("socket",  this.socket)
    },
    userConnect(userId , resolve){
       return resolve( this.socket.emit('userConnect', {userId : userId })); 
    },
    socketSubscribe(data ,resolve){
       return resolve (this.socket.on('testSocket', (data) => { return resolve(data)}));
    },
    userdisConnect(userid, resolve ){
        return resolve ( this.socket.emit('userDisconnect', {userId : userid }))
    }
}
module.exports = SocketChat;
