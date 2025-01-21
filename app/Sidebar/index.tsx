import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import './index.css'
import { getChatList } from '@/lib/api'


export default class extends React.Component {
  state = {
    open: false,
    selectedChat: null,
    selectedItem: null,
    chats: []
  };

  componentDidMount = async () => {
    this.getList((data) => {
      var selectedChat = window.localStorage.getItem('selectedChat')
      var selectedItem = null
      data.forEach((item) => {
        if (String(item.id) == selectedChat) {
          selectedItem = item
        }
      })

      var obj = {
        selectedChat: selectedChat ? parseInt(selectedChat) : null,
        selectedItem: selectedItem,
      }

      if(selectedItem){
        this.props.setMessages(selectedItem.chat_messages)
      }
      
      this.setState(obj)
    })
  }

  getList = async (back = () => { }) => {
    var rs = await getChatList({ userId: 1 })
    if (rs.data?.code == 200) {
      var data = rs.data.data
      this.setState({ chats: data }, () => {
        back(data)
      })
    }
  }

  newChat = () => {
    this.setState({ selectedChat: null, selectedItem: null });
    this.setState({ open: false });
    this.props.onAdd()
  }
  handleChatSelect = (chatId: string) => {
    var { chats } = this.state
    var obj = {}
    chats.forEach((item) => {
      if (item.id == chatId) obj = item
    })
    this.setState({ selectedChat: chatId, selectedItem: obj });
    window.localStorage.setItem('selectedChat', chatId)
    this.props.setMessages(obj.chat_messages)
  };

  render() {
    const { open, selectedChat, chats } = this.state;
    const { theme = 'light', disabled } = this.props;

    return (
      <div className="sidebar-wrapper">
        <Dialog.Root open={open} onOpenChange={(val) => { this.setState({ open: val }) }}>
          <Dialog.Trigger asChild>
            <button className={`trigger-button ${theme}`} type="button" disabled={disabled}>
              <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
              </svg>
            </button>
          </Dialog.Trigger>

          <Dialog.Content className={`drawer-content ${theme}`}>
            <Dialog.Title className="sr-only">Navigation Menu</Dialog.Title>
            <Dialog.Description className="sr-only">
              Navigation menu for accessing different sections of the application
            </Dialog.Description>

            <div className={`w-64 h-screen bg-white border-r border-gray-200 ${theme}`} style={{overflow: 'auto'}}>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-black text-xl font-bold">Chat</div>
                  <Dialog.Close className={`close-button ${theme}`}>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                    </svg>
                  </Dialog.Close>
                </div>
                <button className="w-full py-2 px-4 bg-gray-100 text-gray-800 rounded-md text-sm font-medium" onClick={() => this.newChat()}>
                  New Chat
                </button>
              </div>

              <div className="border-t border-gray-200 my-4"></div>

              <div className="px-4">
                <h2 className="text-gray-500 text-xs font-medium mb-2">Recent Chats</h2>
                <div className="space-y-2">
                  {chats.map(chat => (
                    <div
                      key={chat.id}
                      onClick={() => this.handleChatSelect(chat.id)}
                      className={`relative group py-2 px-4 rounded-md text-sm font-medium flex justify-between items-center cursor-pointer ${selectedChat === chat.id ? 'bg-gray-100 selected-chat' : ''
                        }`}
                    >
                      <span>{chat.summary}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Root>
      </div>
    )
  }
}