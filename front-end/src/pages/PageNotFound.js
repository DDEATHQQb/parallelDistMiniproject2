import React, { Component } from "react";

export class PageNotFound extends Component {
  render() {
    return (
      <div>
        <p style={{ fontSize: "50px", marginTop: "40vh", marginLeft: "40%" }}>
          {" "}
          invalid Url
        </p>
      </div>
    );
  }
}

export default PageNotFound;
