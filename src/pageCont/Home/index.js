import React, { Component } from 'react';
import styles from './index.module.scss';
import { withRouter } from 'next/router';
import router from 'next/router';

import { withTranslation } from 'next-i18next';

import { connect } from 'react-redux';
import { update } from '@/utils/immutableUtil';
import Eventproxy from 'eventproxy';
import { Context } from './context';
import { initEvent } from './event';

import Header from './Header';
import Left from './Left';
import Right from './Right';
import McpDialog from './McpDialog'


@withTranslation('common')
@withRouter
@connect(({}) => ({}))
class Comp extends Component {
  controller = {};
  state = {
    // 事件对象
    event: new Eventproxy(),
  };

  componentDidMount() {
    this.init();
  }
  // 初始化
  init = async () => {
    const { event } = this.state;
    initEvent(event, this);
  };

  changeState = (obj) => {
    this.props.dispatch({
      type: 'chat/setState',
      payload: obj,
    });
  };

  // 设置组件控制器
  setController = (name, compThis) => {
    this.controller[name] = compThis;
  };

  //输入框选中
  inputFocus = ()=>{
    const controller = this.controller
    if(controller.ChatInput){
      controller.ChatInput?.textareaRef?.current?.focus()
    }
  }

  // 调用js沙箱
  getSandbox = async (fragment) => {
    var apiKey = process.env.e2bApiKey
    var url = '/nextApi/sandbox'

    if(router.basePath!='/'){
      url = `${router.basePath}/api/sandbox`
    }

    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        fragment:fragment,
        userID: '1111',
        apiKey:apiKey,
      }),
    })
    return response
  }

  // 滚动到底部
  scrollToBottom = ()=>{
    const chatContainer = document.getElementById('chat-container');
    if(!chatContainer) return
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  // 设置侧边栏
  setSidebar = (val)=>{
    this.props.dispatch({
      type: 'global/setState',
      payload: {sidebarOpen:val},
    });
  }

  shouldComponentUpdate = (np, ns) => update.call(this, np, ns);
  render() {
    // Context 全局参数 （所有后代都可获取调用）
    var store = {
      ...this.state,
      controller: this.controller,
      changeState: this.changeState,
      setController: this.setController,
      inputFocus:this.inputFocus,
      scrollToBottom:this.scrollToBottom,
      getSandbox:this.getSandbox,
      setSidebar:this.setSidebar,
    };
    return (
      <Context.Provider value={store}>
        <div className={styles.pageCont}>
          <Header />

          <div className={styles.body}>
            <Left
              init={(This) => {
                this.setController('Left', This);
              }}
            />
            <div className={styles.right}>
              <Right
                init={(This) => {
                  this.setController('Left', This);
                }}
              />
            </div>
          </div>

          <McpDialog />
        </div>
      </Context.Provider>
    );
  }
}

export default Comp;
