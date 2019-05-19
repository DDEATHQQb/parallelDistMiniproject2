import React, { Component } from "react";
import { Button } from "react-bootstrap";

export class OtherGroupItem extends Component {
  onJoinGroupClick = e => {
    let groupID = this.props.groupID;
    let userID = localStorage.getItem("userID");
    let joinGroupInfo = {
      groupID: groupID,
      userID: userID
    };
    this.props.joinGroup(joinGroupInfo);
  };

  render() {
    return (
      <div className="groupItem">
        <span> GroupID</span>
        <span> {this.props.groupID}</span>
        <span> {this.props.groupName}</span>
        <Button
          variant="primary"
          type="submit"
          onClick={this.onJoinGroupClick}
          style={{ float: "right", fontSize: "15px", padding: "3px" }}
        >
          Join
        </Button>
      </div>
    );
  }
}

export default OtherGroupItem;
