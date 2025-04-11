import React, { Component } from 'react';
import styles from './index.module.scss';
import { withRouter } from 'next/router';
import Head from 'next/head';
import styled from 'styled-components';
import environment from '@/consts/environment';


const Title = styled.div`
    font-size: 24px;
    color: ${({ theme }) => theme};
`;
@withRouter
class Comp extends Component {
  componentDidMount = () => {
    console.log(environment)
  };
  render() {
    return (
      <>
        <Head>
          <title>首页</title>
        </Head>
        <div className={styles.pageCont}>
          <div className={styles.color}>sass 样式</div>
          <div className="color">styled-jsx 样式</div>
          <style jsx>{`
            .color {
              color: green;
              font-size:24px;
            }
          `}</style>

          <Title theme={'blue'}>
            <div>styled-components 样式</div>
          </Title>
        </div>
      </>
    );
  }
}

export default Comp;