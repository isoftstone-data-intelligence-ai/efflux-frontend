import React, { Component } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import * as Select from '@radix-ui/react-select';
import { connect } from 'react-redux';
import { withConsumer } from '../../context';
import TextareaAutosize from 'react-textarea-autosize';
import styles from './index.module.scss';
import Image from 'next/image';
import {
  Sparkles,
  ChevronDown,
  ArrowRight,
  Square,
  Paperclip,
  Server,
  Star,
} from 'lucide-react';

import router from 'next/router';
import { template_list, getServerList } from '@/api/ai';
import { toast } from '@/components/basicComp/Toast';
import env from '@/consts/environment';
import { parse } from "partial-json";
import { update } from '@/utils/immutableUtil';

@withConsumer
@connect(({ chat }) => ({
  selectedChat: chat.selectedChat,
  selectedChatInit: chat.selectedChatInit,
  messages: chat.messages,
  chatLoading:chat.chatLoading
}))
class Comp extends Component {
  textareaRef = React.createRef()
  state = {
    activeTab: 'mcp',
    inputValue: '',
    codeTemplateMap: {},
    selectedTemplate: 'auto',
    mcpList: [],
    selectMcp: 'none',
    suggestions: [
      { id: 1, text: 'Login Page',value:'Create a modern, responsive login page for a fictional SaaS company.'},
      { id: 2, text: 'Clone Screenshot',value:'Please recreate the UI shown in the attached screenshot as accurately as possible.'},
    ],

    toolsMsg:'',
  };
  componentDidMount = () => {
    const {
      value: { setController },
    } = this.props;
    setController('ChatInput', this);
    this.getTemplateListData();
    this.getMcp();

  };

  getTemplateListData = async () => {
    var rs = await template_list();
    if (rs.data?.code == 200) {
      var data = rs.data.data;
      var obj = {};
      data.forEach((item) => {
        obj[item.template_name] = item;
      });
      this.setState({ codeTemplateMap: obj });
    }
  };

  getMcp = async () => {
    var rs = await getServerList();
    if (rs.data?.code == 200) {
      var data = rs.data.data;
      this.setState({ mcpList: data });
    }
  };

  handleTabChange = (value) => {
    this.setState({ activeTab: value });
  };

  handleRegenerate = () => {
    console.log('Regenerating...');
  };

  handleSuggestionClick = (suggestion) => {
    const { chatLoading } = this.props;
    if (chatLoading) return 
    this.setState({ inputValue: suggestion.value }, () => {
      this.handleSubmit();
    });
  };

  handleSubmit = () => {
    const { inputValue,activeTab,codeTemplateMap,selectedTemplate } = this.state;
    const {
      chatLoading,
      selectedChat,
      value: { controller, changeState, scrollToBottom },
    } = this.props;
    var store = window.getStore();
    if (!inputValue.trim()) return;
    if (chatLoading) return 

    var { chat } = store.getState();

    
    // 判断用户配置
    var current;
    if (controller.ChatSettings) {
      current = controller?.ChatSettings?.checkConfig();
      if (!current) {
        toast.error('Please configure your LLM settings');
        return;
      }
    }

    changeState({
      chatLoading: true,
    });

    // 添加用户消息
    var messages = [...chat.messages];
    messages.push({
      role: 'user',
      content: [
        {
          type: 'text',
          text: inputValue,
        },
      ],
      object: null,
    });

    // 机器人空数据
    messages.push({
      role: 'assistant',
      content: [],
      object: null,
      initData:true,
    });

    changeState({
      messages: messages,
      chatLoading: true,
    });

    this.setState({ inputValue: '' });

    setTimeout(() => {
      scrollToBottom();
    }, 20);

    
    var reqData = {
      query: inputValue,
      chat_id: selectedChat || null,
      llm_config_id: current.id,
    }

    // 处理代码逻辑
    if (activeTab == 'artifacts') {
      reqData = {
        ...reqData,
        code: true,
        artifacts_template_id: 0,
      }
      if (selectedTemplate != 'auto') {
        reqData.artifacts_template_id = codeTemplateMap[selectedTemplate].id
      }
    }

    setTimeout(() => {
      this.sendMsg(reqData)
    }, 100);
    
  };

  sendMsg = async (params = {}) => {
    const {
      messages,
      value: { changeState,controller,getSandbox,setSidebar },
    } = this.props;

    const { selectMcp } = this.state

    var serverName = selectMcp
    if (serverName == 'none') serverName = ''
    var reqData = {
      "server_id": parseInt(serverName),
      ...params,
    };

    var url = `${env.apiUrl}/chat/stream_agent`
    const response = await window.fetch(url, {
      mode: 'cors',
      credentials: 'omit',
      method: 'POST',
      body: JSON.stringify(reqData),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        Authorization: localStorage.getItem('authToken'),
      },
    });
    try {
      //获取UTF8的解码
      const encode = new TextDecoder('utf-8');

      // 获取body的reader
      const reader = response.body.getReader();

      var str = ''
      var str2 = ''

      let shouldContinue = true;

      var isTools = false

      // 循环读取reponse中的内容
      while (shouldContinue) {
        const { done, value } = await reader.read();

        if (done) {
          console.log('结束了')
          changeState({ chatLoading: false });
          break;
        }

        // 解码内容
        const text = encode.decode(value);

        // 当获取错误token时，输出错误信息
        if (text === '<ERR>') {
          break;
        } else {
          // 获取正常信息时，逐字追加输出
          if (text) {
            var attr = text.split('\n')
            attr.forEach((item) => {
              if (item) {
                var obj = JSON.parse(item)
                console.log(obj)

                // 处理工具调用
                if (obj.type == 'tool_call') {
                  str2 += obj.content
                  this.setState({ toolsMsg: str2 });
                  isTools = true
                }

                // 处理消息
                if (obj.type == 'message') {
                  str += obj.content
                  this.setMessage({
                    role: 'ai',
                    content: [
                      {
                        type: 'text',
                        text: str,
                      },
                    ],
                    initData:false,
                  })
                }

                // 处理生成代码
                if (obj.type == 'code') {
                  var content = obj.content || ''
                  // Remove code block markers with any language identifier
                  content = content.replace(/```[\w-]*\n?/g, '')
                  str += content
                  str = str.replace(/^[\w-]*\n?/, '')
                  if (str.length > 4) {
                    var itemObj = parse(str)
                    changeState({fragment:itemObj})

                    const content2 = [
                      { type: 'text', text: itemObj.commentary || '' },
                      { type: 'code', text: itemObj.code || '' },
                    ]
                    
                    this.setMessage({
                      content:content2,
                      object: itemObj,
                      initData:false,
                    })
                  }
                }

              }
            })
          }
        }
      }

      // console.log(str)

      if (!isTools) {
        this.setState({toolsMsg:''})
      }

      // 处理toolsMsg
      setTimeout(() => {
        this.setState({toolsMsg:''})
      }, 2000)
      

      // 处理侧边栏选中
      if (!reqData.chat_id) {
        // 侧边栏
        var sidebar = controller.Left
        if(!sidebar) return
        sidebar.getList((data) => {
          var obj = data[0]
          if (obj) {
            changeState({ selectedChat: obj.id, selectedItem: obj });
            if (typeof window !== 'undefined') {
              window.localStorage.setItem('selectedChat', obj.id);
            }
          }
        })
      }

      // 处理code逻辑
      if (reqData.code == true) {
        var fragment = JSON.parse(str)
        var rs = await getSandbox(fragment);
        const result = await rs.json();

        changeState({
          openPreview:true,
          codeResult: result,
          itemIndex: messages.length -1,
          currentTab:'fragment',
        });

        setTimeout(()=>{
          setSidebar(false)
        },100)

        var ChatInput = controller.ChatInput;
        if (ChatInput) {
          ChatInput.setMessage({ result });
        }
      }


    } catch (error) {
      console.log(error)
      changeState({ chatLoading: false});
    }

    changeState({ chatLoading: false});
  };

  setMessage = (item, index,isScroll = true) => {
    const {
      value: { changeState, scrollToBottom },
    } = this.props;
    var store = window.getStore();
    var { chat } = store.getState();
    var messages = [...chat.messages];

    var i = messages.length - 1
    if (index !== undefined)  i = index

    messages[i] = { ...messages[i], ...item };
    changeState({messages: messages});

    if(isScroll){
      setTimeout(() => {
        scrollToBottom();
      }, 20);
    }
  };

  renderPersonaDropdown() {
    const { codeTemplateMap, selectedTemplate } = this.state;
    return (
      <Select.Root
        value={selectedTemplate}
        onValueChange={(value) => this.setState({ selectedTemplate: value })}
      >
        <Select.Trigger
          className={styles.personaTrigger}
          aria-label="Select persona"
        >
          <div className={styles.personaButton}>
            <Select.Value placeholder="Persona" />
            <Select.Icon>
              <ChevronDown size={16} />
            </Select.Icon>
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
              <Select.Item
                value="auto"
                key={'auto'}
                className={styles.selectItem}
              >
                <Select.ItemText>
                  <div className={styles.itemText}>
                    <Sparkles
                      className="flex text-[#a1a1aa]"
                      width={14}
                      height={14}
                      style={{ marginRight: '10px' }}
                    />
                    {'Auto'}
                  </div>
                </Select.ItemText>
              </Select.Item>
              {Object.entries(codeTemplateMap).map(([templateId, template]) => (
                <Select.Item
                  key={templateId}
                  value={templateId}
                  className={styles.selectItem}
                >
                  <Select.ItemText>
                    <div className={styles.itemText}>
                      <img
                        className="flex"
                        src={`${router.basePath}/img/templates/${templateId}.svg`}
                        alt={templateId}
                        width={14}
                        height={14}
                        style={{ marginRight: '10px' }}
                      />
                      {template.name}
                    </div>
                  </Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    );
  }

  renderActionButtons() {
    const { inputValue } = this.state;
    const isDisabled = false;

    return (
      <div className={styles.actionButtons}>
        <button className={styles.button2} disabled={true} onClick={() => {}}>
          <i
            className={"iconfont icon-fujian " +styles.buttonIcon}
            style={{ fontSize: '22px' }}
          ></i>
        </button>
        {true ? (
          <button
            className={styles.submitButton}
            disabled={isDisabled}
            onClick={this.handleSubmit}
          >
            {/* <ArrowRight size={22} className={styles.buttonIcon} /> */}
            <i
              className={"iconfont icon-qianjin " +styles.buttonIcon}
              style={{ fontSize: '20px' }}
            ></i>
          </button>
        ) : (
          <button
            className={styles.regenerateButton}
            disabled={isDisabled}
            onClick={this.handleRegenerate}
          >
            <Square size={18} className={styles.buttonIcon} />
          </button>
        )}
      </div>
    );
  }

  renderMcpDropdown() {
    const { mcpList, selectMcp } = this.state;
    return (
      <Select.Root
        value={selectMcp}
        onValueChange={(value) => this.setState({ selectMcp: value })}
      >
        <Select.Trigger
          className={styles.personaTrigger}
          aria-label="Select persona"
        >
          <div className={styles.personaButton}>
            <Server className="w-4 h-4" style={{ color: '#a1a1aa' }} />
            <Select.Value placeholder="Persona" />
            <Select.Icon>
              <ChevronDown size={16} />
            </Select.Icon>
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
              <Select.Item
                value="none"
                key={'none'}
                className={styles.selectItem}
              >
                <Select.ItemText>
                  <div className={styles.itemText}>{'none'}</div>
                </Select.ItemText>
              </Select.Item>
              {mcpList.map((item) => (
                <Select.Item
                  key={String(item.id)}
                  value={String(item.id)}
                  className={styles.selectItem}
                >
                  <Select.ItemText>
                    <div className={styles.itemText}>{item.server_name}</div>
                  </Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    );
  }

  renderSuggestions() {
    const { suggestions } = this.state;
    if (!suggestions || suggestions.length === 0) return null;

    return (
      <div className={styles.suggestionsContainer}>
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            className={styles.suggestionItem}
            onClick={() => this.handleSuggestionClick(suggestion)}
          >
             <i
              className="iconfont icon-tuijian"
              style={{ fontSize: '18px' }}
            ></i>
            <span>{suggestion.text}</span>
          </button>
        ))}
      </div>
    );
  }

  shouldComponentUpdate = (np, ns) => update.call(this, np, ns);
  render() {
    const { activeTab, inputValue,toolsMsg } = this.state;
    const { selectedChat,selectedChatInit,messages } = this.props;

    var isCenter = false
    if (!selectedChat && selectedChatInit && messages.length == 0) {
      isCenter = true
    }

    if(!selectedChatInit) return <></>
  
    var placeholder = 'Describe your app...';

    return (
      <div className={styles.container}>

      {
        toolsMsg && <>
         <div style={{width:'100%',marginBottom:'0',marginTop:'6px'}} className="flex items-center gap-2 px-4 py-2 mb-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
          <div className="flex-shrink-0 w-5 h-5 text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
          </div>
          <div className="flex-1 text-sm text-blue-700 dark:text-blue-300 break-words whitespace-pre-wrap overflow-auto max-h-24">
            {toolsMsg}
          </div>
        </div>
      </>
      }

        <div className={styles.chatInput}>
          <Tabs.Root value={activeTab} onValueChange={this.handleTabChange}>
            <Tabs.List
              className={styles.tabs}
              aria-label="Choose interface type"
            >
              <Tabs.Trigger className={styles.tab} value="mcp">
                MCP
              </Tabs.Trigger>
              <Tabs.Trigger className={styles.tab} value="artifacts">
                Artifacts
              </Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </div>

        <div className={styles.inputWrapper}>
          <TextareaAutosize
            autoFocus={true}
            className={styles.input}
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => {
              this.setState({ inputValue: e.target.value });
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSubmit();
              }
            }}
            minRows={1}
            maxRows={5}
            ref={this.textareaRef}
          />

          <div className={styles.options}>
            <div>
              {activeTab == 'mcp' && <>{this.renderMcpDropdown()}</>}

              {activeTab == 'artifacts' &&
                Object.keys(this.state.codeTemplateMap).length > 0 && (
                  <>{this.renderPersonaDropdown()}</>
                )}
            </div>
            {this.renderActionButtons()}
          </div>
        </div>

        {!isCenter && (
          <div
            className={styles.callWord}
            style={{ 
              height: activeTab == 'artifacts' ? '80px' : '0',
              marginTop: activeTab == 'artifacts' ? '21px' : '0',
            }}
          >
            <div className={styles.title}>Pick one and try it 😊</div>
            {this.renderSuggestions()}
          </div>
        )}

        {isCenter && (
          <div
            className={styles.callWord}
            style={{ height:'80px'}}
          >
            {activeTab == 'artifacts' && (
              <>
                <div className={styles.title}>Pick one and try it 😊</div>
                {this.renderSuggestions()}
              </>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Comp;
