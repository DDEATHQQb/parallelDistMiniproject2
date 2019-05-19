import React, { Component } from "react";
import MessageItem from "./MessageItem";
export class MessageList extends Component {
  render() {
    return this.props.messages.map(messageItem => (
      <MessageItem
        userID={messageItem.ChatuserID}
        content={messageItem.message}
        time={messageItem.timeSend}
      />
    ));
  }
}

export default MessageList;
