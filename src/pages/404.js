import React, { Component } from 'react';
import { withRouter } from 'next/router';

@withRouter
class Comp extends Component {
  render() {
    if(typeof window == 'undefined'){
        return <></>
    }
    return (
      <div>
        我是 404页面 - Page Not Found
      </div>
    );
  }
}
export default Comp;