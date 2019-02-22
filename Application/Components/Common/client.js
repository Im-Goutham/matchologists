// import React from 'react';
import SocketIOClient from 'socket.io-client';

// class SocketChat extends React.Component {
//     constructor(props) {
//         super(props);
//         this.socket = SocketIOClient('http://10.2.2.43:4069/'); 
//         console.log("socket",  this.socket)
//         this.socket.on('testSocket', (data) => {
//             console.log('Data recieved from server', data); 
//         });
//         this.socket.emit('testEvent', 'Hi server'); 
//     }
// }


let SocketChat = {
    connectSocket(){
        this.socket = SocketIOClient('http://10.2.2.43:4069/'); 
        // console.log("socket",  this.socket)
        this.socket.on('testSocket', (data) => { console.log('Data recieved from server', data)});
    },
    userConnect(){
        this.socket.emit('userConnect', {userId : '123456798' }); 
    },
    userdisConnect(){
        this.socket.emit('userDisconnect', {userId : '123456798' }); 
    }
}
module.exports = SocketChat;
