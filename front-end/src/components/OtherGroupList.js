import React, { Component } from "react";
import OtherGroupItem from "./OtherGroupItem";

export class OtherGroupList extends Component {
  render() {
    return this.props.otherGroups.map(groupItem => (
      <OtherGroupItem
        groupID={groupItem.groupID}
        //groupID={groupItem.groupId}
        groupName={groupItem.groupName}
        joinGroup={this.props.joinGroup}
      />
    ));
  }
}

export default OtherGroupList;
