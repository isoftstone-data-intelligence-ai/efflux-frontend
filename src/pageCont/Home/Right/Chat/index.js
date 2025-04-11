import React, { Component } from 'react';
import styles from './index.module.scss';
import { connect } from 'react-redux';
import { withConsumer } from '../../context';
import Markdown from 'markdown-to-jsx';
import { LoaderIcon, Terminal } from 'lucide-react';
import classNames from 'classnames';
import { update } from '@/utils/immutableUtil';
import { CodeView } from '@/components/basicComp/CodeView';
import { useState, useEffect, forwardRef } from 'react';
import { useTheme } from 'next-themes';
import router from 'next/router';

// 计算单双数
var isEven = (number) => {
  return number % 2 === 0;
};

const ThemeStyle = () => {
  const { theme } = useTheme();
  useEffect(() => {
    // 创建 link 元素
    const link = document.createElement('link');
    link.rel = 'stylesheet';

    var base = '';
    if (router.basePath) {
      base = router.basePath;
    }

    link.href =
      theme === 'dark'
        ? `${base}/lib/github-markdown-css/github-markdown-dark.css`
        : `${base}/lib/github-markdown-css/github-markdown.css`; // 根据主题选择样式

    // 添加到 document.head
    document.head.appendChild(link);

    // 清理函数，卸载之前引入的样式
    return () => {
      document.head.removeChild(link);
    };
  }, [theme]);
  return <></>;
};

@withConsumer
@connect(({ chat, user }) => ({
  messages: chat.messages,
  user: user.user,
  selectedChat: chat.selectedChat,
  selectedChatInit: chat.selectedChatInit,
  chatLoading: chat.chatLoading,
  itemIndex: chat.itemIndex,
  currentTab: chat.currentTab,
  msgLoading: chat.msgLoading,
}))
class Comp extends Component {
  componentDidMount = async () => {
    const {
      value: { setController },
    } = this.props;
    setController('Chat', this);
  };

  //获取展示内容
  getShowText = (textStr = '') => {
    // 代码段截取符号
    const char = '```';
    // 存放代码段符号下标的数组
    const positions = [0];
    // 获取代码段符号位置
    let pos = textStr.indexOf(char);
    while (pos !== -1) {
      positions.push(pos);
      pos = textStr.indexOf(char, pos + 1);
    }
    const arr = [];
    // 根据代码段符号下标获取代码段
    for (let i = 0; i < positions.length; i++) {
      if (!isEven(i + 1)) {
        const str =
          positions?.length > i + 1
            ? textStr
                .substring(positions[i], positions[i + 1])
                .replace('```', '')
            : textStr.substring(positions[i]).replace('```', '');
        arr.push({
          type: 2,
          num: positions[i],
          message: str,
        });
      }
      if (!isEven(i)) {
        const str = textStr
          .substring(positions[i], positions[i + 1])
          .replace('```', '');
        arr.push({
          type: 1,
          num: positions[i],
          message: str,
        });
      }
    }

    return (
      <div className={classNames([styles.chatrow])}>
        <div className={styles.chatWrap}>
          <div className={styles.chatContent}>
            {arr.map((val) => {
              // 获取第一个回车符的下标
              const nindex = val.message.indexOf('\n');
              // 代码类型
              const codeType =
                val.type == 1 ? val.message.substring(0, nindex) : false;
              // 代码输出
              const codeMessage =
                val.type == 1 && nindex !== -1
                  ? val.message.substring(nindex)
                  : val.message;

              // md格式
              if (val.type == 1 && codeType == 'markdown') {
                return (
                  <div className={styles.markdownBody + ' markdown-body'}>
                    <Markdown>
                      {String(codeMessage).replace(/\n$/, '')}
                    </Markdown>
                  </div>
                );
              }

              // 代码格式
              if (val.type == 1) {
                return (
                  <div>
                    <CodeView
                      code={codeMessage}
                      lang={codeType || 'javascript'}
                    />
                  </div>
                );
              }

              return (
                <div className={styles.markdownBody + ' markdown-body'}>
                  <Markdown>{val.message}</Markdown>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  sandbox = async (fragment = {}, index) => {
    const {
      itemIndex,
      value: { changeState, controller, getSandbox },
    } = this.props;
    var rs = await getSandbox(fragment);
    const result = await rs.json();

    var ind = itemIndex;
    if (index != undefined) {
      ind = index;
    }

    changeState({
      codeResult: result,
    });

    var ChatInput = controller.ChatInput;
    if (ChatInput) {
      ChatInput.setMessage({ result }, ind, false);
    }
  };

  shouldComponentUpdate = (np, ns) => update.call(this, np, ns);
  render() {
    const {
      messages,
      selectedChat,
      selectedChatInit,
      chatLoading,
      currentTab,
      msgLoading,
    } = this.props;
    const {
      value: { changeState, setSidebar },
    } = this.props;

    if (!selectedChat && selectedChatInit && messages.length === 0) {
      return <div></div>;
    }

    return (
      <div className={styles.container}>
        <ThemeStyle />
        {msgLoading ? (
          <div
            className="flex items-center justify-center"
            style={{ height: '100%' }}
          >
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        ) : (
          <div className={styles.compCont}>
            <div
              id="chat-container"
              className="flex flex-col gap-2 overflow-y-auto max-h-full"
            >
              {messages.length === 0 ? (
                <div className="welcome-message"></div>
              ) : (
                messages.map((message, index) => {
                  if (message.initData === true) return null;
                  return (
                    <div
                      className={`flex flex-col whitespace-pre-wrap ${
                        message.role !== 'user'
                          ? styles.msgItemAi
                          : styles.msgItemUser
                      }`}
                      key={index}
                      style={{
                        maxWidth: message.role === 'user' ? '100%' : '100%',
                      }}
                    >
                      {message.content.map((content, id) => {
                        if (content.type === 'image') {
                          return (
                            <img
                              key={id}
                              src={content.image}
                              alt="fragment"
                              className="mr-2 inline-block w-12 h-12 object-cover rounded-lg bg-white mb-2"
                            />
                          );
                        }
                        if (message.role == 'user') {
                          return content.text;
                        }
                        if (content.type === 'text') {
                          return <div>{this.getShowText(content.text)}</div>;
                        }
                      })}

                      {/* 生成代码区域 */}
                      {message.object && (
                        <div
                          onClick={async () => {
                            changeState({
                              openPreview: true,
                              fragment: message.object,
                              result: message.result,
                              itemIndex: index,
                            });

                            setTimeout(() => {
                              setSidebar(false);
                            }, 100);

                            if (!message.result && currentTab === 'fragment') {
                              this.sandbox(message.object, index);
                            }
                          }}
                          className="py-2 pl-2 w-full md:w-max flex items-center border rounded-xl select-none hover:bg-white dark:hover:bg-white/5 hover:cursor-pointer"
                        >
                          <div className={styles.codeIcon}>
                            <Terminal strokeWidth={2} />
                          </div>
                          <div className="pl-2 pr-4 flex flex-col">
                            <span className="font-bold font-sans text-sm text-primary">
                              {message.object.title}
                            </span>
                            <span className="font-sans text-sm text-muted-foreground">
                              Click to see fragment
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              {chatLoading && (
                <div>
                  <div
                    className="flex items-center gap-1 text-sm text-muted-foreground"
                    style={{
                      height: '30px',
                      overflow: 'hidden',
                      marginBottom: '10px',
                    }}
                  >
                    <LoaderIcon
                      strokeWidth={2}
                      className="animate-spin w-4 h-4"
                    />
                    <span>Generating...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Comp;
