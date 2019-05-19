import React, { Component } from "react";

export class MessageItem extends Component {
  getMessageStlye = () => {
    let messageStyle = {
      marginLeft: "-10px",
      marginRight: "-10px",
      paddingTop: "10px",
      paddingBottom: "10px",
      paddingLeft: "20px",
      color: "white"
    };
    let userID = localStorage.getItem("userID");
    if (userID == this.props.userID) {
      messageStyle["backgroundColor"] = "#31B700";
    } else {
      messageStyle["backgroundColor"] = "#0085CA";
    }

    return messageStyle;
  };

  getMessageHeaderStlye = () => {
    let messageStyle = {};
    let userID = localStorage.getItem("userID");
    if (userID == this.props.userID) {
      messageStyle["backgroundColor"] = "#ADDC91";
    } else {
      messageStyle["backgroundColor"] = "#8BD3E6";
    }

    return messageStyle;
  };
  render() {
    return (
      <div className="messageDiv" style={this.getMessageHeaderStlye()}>
        <div style={this.getMessageHeaderStlye()}>
          <span style={{ marginLeft: "10px" }}> ClientID: </span>
          <span> {this.props.userID}</span>
          <div style={{ float: "right", marginRight: "10px" }}>
            <span> Sent At: </span>
            <span> {this.props.time}</span>
          </div>
        </div>

        <div style={this.getMessageStlye()}>
          <span>{this.props.content}</span>
        </div>
      </div>
    );
  }
}

const messageHeaderStyle = {
  backgroundColor: "#56B7E6",
  marginLeft: "-10px",
  marginRight: "-10px"
};

export default MessageItem;
