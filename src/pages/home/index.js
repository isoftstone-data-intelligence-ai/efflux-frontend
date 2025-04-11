'use client';
import React, { Component, useContext } from 'react';
import { withRouter } from 'next/router';
import Head from 'next/head';
import Home from '@/pageCont/Home';
import MenuLayout from '@/layouts/MenuLayout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

@withRouter
class Comp extends Component {
  componentDidMount = () => {};
  render() {
    return (
      <div style={{ height: '100%' }}>
        <Head>
          <title>EFFLUX</title>
          <meta name="viewport" content="width=device-width, initial-scale=0.38, user-scalable=no"></meta>
        </Head>
        <Home/>
      </div>
    );
  }
}

Comp.getLayout = function (page) {
  return (
      <MenuLayout >{page}</MenuLayout>
  );
};

export async function getStaticProps({ locale }) {
  return {
      props: {
          ...(await serverSideTranslations(locale, ['common'])),
      },
  };
}

export default Comp;
