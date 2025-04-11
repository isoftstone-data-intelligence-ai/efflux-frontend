import React, { Component } from 'react';
import styles from './index.module.scss';

import * as Popover from '@radix-ui/react-popover';
import {
  MessageSquare,
  Edit2,
  Trash2,
  Plus,
  MoreHorizontal,
} from 'lucide-react';
import moment from 'moment';
import router from 'next/router';
import classNames from 'classnames';

import { getChatList, getChatDetail, userLogout } from '@/api/ai';
import { connect } from 'react-redux';
import { update } from '@/utils/immutableUtil';
import { withConsumer } from '../context';

import Avatar from '@/components/basicComp/Avatar';

let lastCallTime = 0;
const THROTTLE_DELAY = 1000;

@withConsumer
@connect(({ global, chat, user }) => ({
  chat: chat,
  user: user,
  sidebarOpen: global.sidebarOpen,
  msgLoading:chat.msgLoading,
}))
class Comp extends Component {
  componentDidMount = async () => {
    this.props.init(this);
    const {
      value: { changeState,event },
    } = this.props;
    this.throttledGetList((data) => {
      var selectedChat = '';
      if (typeof window !== 'undefined') {
        selectedChat = window.localStorage.getItem('selectedChat');
      }

      var selectedItem = null;
      data.forEach((item) => {
        if (String(item.id) == selectedChat) {
          selectedItem = item;
        }
      });

      var obj = {
        selectedChat: selectedChat ? parseInt(selectedChat) : null,
        selectedItem: selectedItem,
        selectedChatInit:true,
      };

      if (selectedItem) {
        this.getChatDetail(parseInt(selectedChat));
      }else{
        event.emit('newChat');
      }

      changeState(obj);
    });
  };

  throttledGetList = (callback = () => {}) => {
    const now = Date.now();
    if (now - lastCallTime >= THROTTLE_DELAY) {
      this.getList(callback);
      lastCallTime = now;
    }
  };

  getList = async (back = () => {}) => {
    const {
      value: { changeState },
    } = this.props;
    var rs = await getChatList();
    if (rs.data?.code == 200) {
      var data = rs.data.data.map((item) => {
        return {
          ...item,
          title: item.summary,
          date: item.created_at,
        };
      });
      changeState({ chatsList: data });
      setTimeout(() => {
        back(data);
      }, 10);
    }
  };

  newChat = () => {
    const {
      value: { event },
    } = this.props;
    event.emit('newChat');
  };

  handleChatSelect = (chatId) => {
    const {
      value: { changeState },
      chat,
    } = this.props;
    var { chatsList } = chat;
    var obj = {};
    chatsList.forEach((item) => {
      if (item.id == chatId) obj = item;
    });
    changeState({ selectedChat: chatId, selectedItem: obj });
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('selectedChat', chatId);
    }
    this.getChatDetail(chatId);
  };

  getChatDetail = async (chatId) => {
    const {
      value: { event,changeState },
    } = this.props;
    changeState({msgLoading:true})
    var rs = await getChatDetail({ id: chatId });
    changeState({msgLoading:false})
    if (rs.data?.code == 200) {
      var data = rs.data.data;
      event.emit('onChatClick', data.chat_messages);
    }
  };

  logout = async () => {
    userLogout();
    if (window) {
      localStorage.removeItem('authToken');
    }
    router.push('/login');
  };

  shouldComponentUpdate = (np, ns) => update.call(this, np, ns);
  render() {
    const {
      sidebarOpen,
      chat: { chatsList },
      user: { user },
    } = this.props;

    const truncateText = (text, maxLength = 30) => {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    };

    const renderChatItem = (chat) => (
      <Popover.Root key={chat.id}>
        <div
          className={`${styles.chatItem} ${
            chat.id === this.props.chat.selectedChat ? styles.selected : ''
          }`}
          role="listitem"
          onClick={() => {
            this.handleChatSelect(chat.id);
          }}
        >
          <MessageSquare className={styles.chatIcon} size={16} />
          <div className={styles.chatContent}>
            <span className={styles.chatTitle} title={chat.title}>
              {truncateText(chat.title)}
            </span>
          </div>
          <Popover.Trigger asChild>
            <button
              className={styles.moreIcon}
              aria-label={`More options for chat: ${chat.title}`}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <MoreHorizontal size={15} />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className={styles.popoverContent}
              sideOffset={5}
              align="end"
              side="bottom"
              onOpenAutoFocus={(e) => e.preventDefault()}
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <div className={styles.actions} role="menu">
                <Popover.Close asChild>
                  <button
                    className={styles.actionBtn}
                    role="menuitem"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Edit chat:', chat.id);
                    }}
                  >
                    <Edit2 size={13} />
                    <span>Edit</span>
                  </button>
                </Popover.Close>
                <Popover.Close asChild>
                  <button
                    className={styles.actionBtn}
                    role="menuitem"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Delete chat:', chat.id);
                    }}
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                </Popover.Close>
              </div>
              <Popover.Arrow className={styles.popoverArrow} />
            </Popover.Content>
          </Popover.Portal>
        </div>
      </Popover.Root>
    );

    const groupedChats = chatsList.reduce((acc, chat) => {
      const dateKey = moment(new Date(chat.date)).isSame(new Date(), 'day')
        ? 'Today'
        : moment(new Date(chat.date)).format('YYYY-MM-DD');

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(chat);
      return acc;
    }, {});

    // if (!sidebarOpen) return null;

    var name = user.name;

    return (
      <div className={ classNames([styles.left,{[styles.leftHidden]:!sidebarOpen}])}>
        <div className={styles.newChat}>
          <button className={styles.newChatBtn} onClick={() => this.newChat()}>
            <Plus size={16} />
            New Chat
          </button>
        </div>

        <div className={styles.chatContainer}>
          {Object.entries(groupedChats).map(([date, chats]) => (
            <div key={date} className={styles.dateSection}>
              <div className={styles.dateLabel}>{date}</div>
              <div className={styles.chatList} role="list">
                {chats.map(renderChatItem)}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.userSection}>
          <Popover.Root>
            <Popover.Trigger asChild>
              <button className={styles.userButton}>
                <div className={styles.avatar}>
                  <Avatar name={name} />
                </div>
                <span className={styles.userName2}>{name}</span>
              </button>
            </Popover.Trigger>

            <Popover.Portal>
              <Popover.Content
                className={styles.userPopover}
                sideOffset={4}
                align="start"
              >
                <div className={styles.userHeader}>
                  <div className={styles.userName}>{name}</div>
                </div>
                {/* <button className={styles.menuItem}>
                  <i className="iconfont icon-a-bianzu32"></i>
                  <span>Contact Us</span>
                </button>
                <button className={styles.menuItem}>
                  <i className="iconfont icon-a-bianzu32"></i>
                  <span>User Feedback</span>
                </button> */}
                <button
                  className={styles.menuItem}
                  onClick={() => {
                    this.logout();
                  }}
                >
                  <i className="iconfont icon-a-bianzu32"></i>
                  <span>Sign Out</span>
                </button>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
      </div>
    );
  }
}

export default Comp;
