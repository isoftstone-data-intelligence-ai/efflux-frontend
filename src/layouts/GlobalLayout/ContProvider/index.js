import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';
import { getTokeninfo } from '@/api/ai';
import { withTranslation } from 'next-i18next';

@withTranslation()
@connect(({}) => ({}))
class Comp extends React.Component {
  componentDidMount = async () => {
    this.init();
  };

  init = async () => {
    if (typeof window == 'undefined') return;
    this.initLang()
    const token = window.localStorage.getItem('authToken');
    var toLoginPage = () => {
      Router.push('/login');
    };

    if (!token) {
      toLoginPage();
      return;
    }

    const rs = await getTokeninfo();
    if (rs.data?.code == 200) {
      this.props.dispatch({
        type: 'user/setState',
        payload: {
          user: rs.data.data,
        },
      });
    }else{
      window.localStorage.setItem('authToken','')  
      toLoginPage();
    }
  };

  initLang = ()=>{
    const { i18n } = this.props
    var language = window.localStorage.getItem('language') || 'en-US';
    i18n.changeLanguage(language)
    this.props.dispatch({
      type: 'global/setState',
      payload: {
        language: language,
      },
    });
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}

export default Comp;
