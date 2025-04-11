import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withConsumer } from '../../context';
import styles from './index.module.scss';
import classNames from 'classnames';
import { FragmentCode } from '@/components/basicComp/FragmentCode';
import { FragmentPreview } from '@/components/fragment-preview';
import Header from './Header';
import { update } from '@/utils/immutableUtil';

@withConsumer
@connect(({ chat }) => ({
  fragment: chat.fragment,
  codeResult: chat.codeResult,
  itemIndex: chat.itemIndex,
  currentTab: chat.currentTab,
  openPreview: chat.openPreview,
}))
class Comp extends Component {
  shouldComponentUpdate = (np, ns) => update.call(this, np, ns);
  render() {
    const { fragment, codeResult, itemIndex, currentTab, openPreview } =
      this.props;
    const {
      value: { changeState, controller },
    } = this.props;
    return (
      <div
        className={classNames([
          styles.preview,
          openPreview ? styles.previewOpen:'',
        ])}
      >
        
        {
          currentTab === 'code' && (
            <Header onClose={() => {
              changeState({openPreview:false})
            }}></Header>
          )
        }

        <div className={styles.code}>
          <div className={styles.codeCont}>
            {currentTab === 'code' && (
              <>
                
                {fragment.code && fragment.file_path && (
                  <div>
                    <FragmentCode
                      files={[
                        {
                          name: fragment.file_path,
                          content: fragment.code,
                        },
                      ]}
                    />
                  </div>
                )}
              </>
            )}

            {currentTab === 'fragment' && (
              <>
                {codeResult && (
                  <FragmentPreview
                    result={codeResult}
                    onClose={() => {
                      changeState({ openPreview: false });
                    }}
                  />
                )}
              </>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <div
            className={styles.switch}
            onClick={() => {
              var newValue = currentTab === 'code' ? 'fragment' : 'code';
              changeState({
                currentTab: newValue,
              });

              if (newValue === 'fragment' && Object.keys(codeResult) == 0) {
                var Chat = controller.Chat;
                if (Chat) {
                  Chat.sandbox(fragment, itemIndex);
                }
              }
            }}
          >
            <div className={styles.switchItem} />
            <div className={styles.switchItem} />
            <div
              className={classNames(styles.slider, {
                [styles.right]: currentTab === 'fragment',
                [styles.active]: currentTab === 'fragment',
              })}
            >
              {currentTab === 'code' ? '</>' : '</>'}
            </div>
          </div>
          <div className={styles.right}>
            {true && (
              <>
                <button
                  className={styles.button1}
                  style={{ marginRight: '24px' }}
                  onClick={() => {
                    window.handleCopyCode?.();
                  }}
                >
                  Copy Code
                </button>

                <button
                  className={styles.button1}
                  onClick={() => {
                    window.download?.();
                  }}
                >
                  Download Code
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Comp;
