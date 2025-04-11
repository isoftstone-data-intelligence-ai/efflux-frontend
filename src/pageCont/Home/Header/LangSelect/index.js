import React, { Component } from 'react';
import styles from './index.module.scss';
import { connect } from 'react-redux';
import * as Select from '@radix-ui/react-select';
import { update } from '@/utils/immutableUtil';
import { withTranslation } from 'next-i18next';

const languages = [
  { value: 'zh-CN', label: '中文' },
  { value: 'en-US', label: 'English' },
];

@withTranslation()
class LangSelect extends Component {
  onChange = (value) => {
    const { i18n } = this.props
    i18n.changeLanguage(value)
    this.props.dispatch({
      type: 'global/setState',
      payload: {
        language: value,
      },
    });
    window.localStorage.setItem('language',value)
  };
  renderMcpDropdown() {
    const { language } = this.props;
    return (
      <Select.Root
        value={language}
        onValueChange={(value) => {
          console.log(value);
          this.onChange(value);
        }}
      >
        <Select.Trigger
          className={styles.personaTrigger}
          aria-label="Select persona"
        >
          <div className={styles.personaButton}>
            <i
              className="iconfont icon-a-bianzu34"
              style={{ fontSize: '22px' }}
            />
            <Select.Value placeholder="Persona" />
          </div>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className={styles.selectContent}
            position="popper"
            side="top"
            sideOffset={5}
            align="start"
          >
            <Select.Viewport>
              {languages.map((item) => (
                <Select.Item
                  key={String(item.value)}
                  value={String(item.value)}
                  className={styles.selectItem}
                >
                  <Select.ItemText>
                    <div className={styles.itemText}>{item.label}</div>
                  </Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    );
  }

  shouldComponentUpdate = (np, ns) => update.call(this, np, ns);

  render() {
    return <div>{this.renderMcpDropdown()}</div>;
  }
}

export default connect(({ global }) => ({
  language: global.language,
}))(LangSelect);
