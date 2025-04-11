import React, { Component } from 'react';
import { withRouter } from 'next/router';
import Head from 'next/head';

@withRouter
class Comp extends Component {
  
  componentDidMount() {
    this.props.router.push('/home');
  }
  
  render() {
    return (
      <>

      </>
    );
  }
}

export default Comp;
