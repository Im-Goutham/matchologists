import React from 'react';
import FlashMessage from "react-native-flash-message";

export default class extends React.Component {

  render() {
    return <FlashMessage  position="top" animated={true} autoHide={true} />;
  }
}