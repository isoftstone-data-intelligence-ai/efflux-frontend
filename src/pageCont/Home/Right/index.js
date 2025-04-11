import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withConsumer } from '../context';
import styles from './index.module.scss';
import classNames from 'classnames';

import { update } from '@/utils/immutableUtil';
import Chat from './Chat';
import ChatInput from './ChatInput';
import Preview from './Preview';

@withConsumer
@connect(({ chat }) => ({
  selectedModel: chat.selectedModel,
  openPreview: chat.openPreview,
}))
class Comp extends Component {
  shouldComponentUpdate = (np, ns) => update.call(this, np, ns);
  render() {
    const { openPreview } = this.props;
    return (
      <div
        className={classNames([
          styles.container,
          { [styles.openPreview]: openPreview },
        ])}
      >
        <div className={styles.chat}>
          <div
            className={classNames(styles.chatCont, {
              [styles.max800]: !openPreview,
            })}
          >
            <Chat />
            <ChatInput />
          </div>
        </div>
        {openPreview && (
          <div className={styles.preview}>
            <Preview />
          </div>
        )}
      </div>
    );
  }
}

export default Comp;
