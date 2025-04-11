import React from 'react';
import styles from './index.module.scss';
import { ThemeToggle } from '@/components/theme-toggle.tsx';
import { connect } from 'react-redux';
import Select from './Select';
import LangSelect from './LangSelect';
import { withConsumer } from '../context';

var Comp = (props) => {
  const { value } = props

  var sidebaClick = () => {
    const { sidebarOpen } = props.global;
    value.setSidebar(!sidebarOpen)
    value.inputFocus()
  };

  return (
    <header className={styles.header}>
      <div className="flex items-center">
        <a href='/'>
          <i
            className="iconfont icon-logo"
            style={{ fontSize: '28px', marginRight: '46px' }}
          ></i>
        </a>
        
        <button className={styles.settingsButton} aria-label="Settings" onClick={sidebaClick}>
          <i
              className="iconfont icon-a-bianzu35"
              style={{ fontSize: '18px' }}
            ></i>
        </button>

        <Select />
      </div>

      <div className="flex items-center">
        <button 
          className={styles.button} onClick={()=>{
            value.changeState({ mcpServerOpen: true });
          }}
          style={{marginRight:'40px'}}
        >
          <i
            className="iconfont icon-a-bianzu32"
            style={{ fontSize: '18px' }}
          ></i>
          <span>MCP settings</span>
        </button>

        <ThemeToggle className={styles.settingsButton2} style={{marginRight:'24px'}}/>

        <LangSelect />
      </div>
    </header>
  );
};

Comp = withConsumer(Comp)
Comp = connect(({ global }) => ({
  global: global,
}))(Comp);

export default Comp;
