'use client';

import { AuthDialog } from '@/components/auth-dialog';
import { Chat } from '@/components/chat';
import { ChatInput } from '@/components/chat-input';
import { ChatPicker } from '@/components/chat-picker';
import { ChatSettings } from '@/components/chat-settings';
import { NavBar } from '@/components/navbar';
import { Preview } from '@/components/preview';
import { AuthViewType, useAuth } from '@/lib/auth';
import { Message, toAISDKMessages, toMessageImage } from '@/lib/messages';
import { LLMModelConfig } from '@/lib/models';
import modelsList from '@/lib/models.json';
import { FragmentSchema, fragmentSchema as schema } from '@/lib/schema';
import { supabase } from '@/lib/supabase';
import templates, { TemplateId } from '@/lib/templates';
import { ExecutionResult } from '@/lib/types';
import { DeepPartial } from 'ai';
import { experimental_useObject as useObject } from 'ai/react';
import { usePostHog } from 'posthog-js/react';
import { SetStateAction, useEffect, useState, useRef, useCallback } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import Modal from '@/components/Dialog'
import Sidebar from './Sidebar'
import { useTheme } from 'next-themes'
import { getTokeninfo, userLogout, getConfigs, getTemplates, template_list } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast'
import { toPrompt } from '@/lib/prompt'
import { parse } from "partial-json";

var func = () => { }


export default function Home() {
  const [chatInput, setChatInput] = useLocalStorage('chat', '')
  const [files, setFiles] = useState<File[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<'auto' | TemplateId>(
    'auto',
  )
  const [languageModel, setLanguageModel] = useLocalStorage<LLMModelConfig>(
    'languageModel',
    {
      model: '2',
    },
  )

  const [serverValue, setserverChange] = useState<'none' | TemplateId>(
    'none',
  )

  const [toolsValue, setToolsChange] = useState('mcp')
  const [toolsMsg, setToolsMsg] = useState('')
  const [isMcpSelected, setIsMcpSelected] = useState(true)
  const [isArtifactsSelected, setIsArtifactsSelected] = useState(false)

  const posthog = usePostHog()

  const [result, setResult] = useState<ExecutionResult>()
  const [messages, setMessages] = useState<Message[]>([])
  const [fragment, setFragment] = useState<DeepPartial<FragmentSchema>>()
  const [currentTab, setCurrentTab] = useState<'code' | 'fragment'>('code')
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)
  const [isAuthDialogOpen, setAuthDialog] = useState(false)
  const [authView, setAuthView] = useState<AuthViewType>('sign_in')
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [userInfo, setUserInfo] = useState({});
  const { session, apiKey } = useAuth(setAuthDialog, setAuthView)
  const [azureLoading, setAzureLoading] = useState(false)
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userConfigs, setUserConfigs] = useState([])
  const [llmSettingsOpen, setLlmSettingsOpen] = useState(false);
  const [templatesList, setTemplatesList] = useState([])
  const [codeTemplateMap, setCodeTemplateMap] = useState([])

  const { setTheme, theme } = useTheme()
  var the = theme

  if (typeof window !== 'undefined') {
    // 只有在浏览器环境中执行的代码
    the = theme || window.localStorage.getItem('theme')
  }


  const sidebarRef = useRef();

  const currentModel = modelsList.models.find(
    (model) => model.id === languageModel.model,
  )
  const currentTemplate =
    selectedTemplate === 'auto'
      ? templates
      : { [selectedTemplate]: templates[selectedTemplate] }
  const lastMessage = messages[messages.length - 1]

  const { object, submit, isLoading: isSubmitting, stop, error } = useObject({
    api:
      currentModel?.id === 'o1-preview' || currentModel?.id === 'o1-mini'
        ? '/api/chat-o1'
        : '/api/chat2',
    schema,
    onError: (error) => {
      if (error.message.includes('request limit')) {
        setIsRateLimited(true)
      }
    },
    onFinish: async ({ object: fragment, error }) => {
      if (!error) {
        // send it to /api/sandbox
        console.log('fragment', fragment)
        setIsPreviewLoading(true)
        posthog.capture('fragment_generated', {
          template: fragment?.template,
        })

        const response = await fetch('/api/sandbox', {
          method: 'POST',
          body: JSON.stringify({
            fragment,
            userID: session?.user?.id,
            apiKey,
          }),
        })

        const result = await response.json()
        console.log('result', result)
        posthog.capture('sandbox_created', { url: result.url })

        setResult(result)
        setCurrentPreview({ fragment, result })
        setMessage({ result })
        setCurrentTab('fragment')
        setIsPreviewLoading(false)
      }
    },
  })

  function setMessage(message: Partial<Message>, index?: number) {
    setMessages((previousMessages) => {
      const updatedMessages = [...previousMessages]
      updatedMessages[index ?? previousMessages.length - 1] = {
        ...previousMessages[index ?? previousMessages.length - 1],
        ...message,
      }

      return updatedMessages
    })
  }

  var getConfigsData = async () => {
    var rs = await getConfigs()
    if (rs.data?.code == 200) {
      var data = rs.data.data
      setUserConfigs(data)
    }
  }

  useEffect(() => {
    console.log('object', object)
    if (object) {
      // console.log(object)
      setFragment(object)
      const content: Message['content'] = [
        { type: 'text', text: object.commentary || '' },
        { type: 'code', text: object.code || '' },
      ]

      if (!lastMessage || lastMessage.role !== 'assistant') {
        addMessage({
          role: 'assistant',
          content,
          object,
        })
      }

      if (lastMessage && lastMessage.role === 'assistant') {
        setMessage({
          content,
          object,
        })
      }
    }
  }, [object])

  useEffect(() => {
    if (error) stop()
  }, [error])


  const checkAuthAndFetchUser = async () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await getTokeninfo();
        if (response.data?.code === 200) {
          setUserInfo(response.data.data);
          setIsLoading(false);
        } else {
          localStorage.removeItem('authToken');
          router.push('/login');
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        localStorage.removeItem('authToken');
        router.push('/login');
      }
    }
  };

  var getTemplatesData = async () => {
    var rs = await getTemplates()
    if (rs.data?.code == 200) {
      var data = rs.data.data
      setTemplatesList(data)
    }
  }

  var getTemplateListData = async () => {
    var rs = await template_list()
    if (rs.data?.code == 200) {
      var data = rs.data.data
      var obj = {}
      data.forEach((item) => {
        obj[item.template_name] = item
      })
      setCodeTemplateMap(obj)
    }
  }

  useEffect(() => {
    checkAuthAndFetchUser();
    getConfigsData()
    getTemplatesData()
    getTemplateListData()
  }, []); // Added empty dependency array

  const handleSubmitAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!session) {
      return setAuthDialog(true)
    }

    if (isSubmitting) {
      stop()
    }
    var current = null
    userConfigs.forEach((item) => {
      if (languageModel.model == String(item.template_id)) current = item
    })
    if (!current) {
      toast({
        title: "Error",
        description: "Set LLM Settings first"
      })
      setLlmSettingsOpen(true)
      return
    }

    const content: Message['content'] = [{ type: 'text', text: chatInput }]
    const images = await toMessageImage(files)

    if (images.length > 0) {
      images.forEach((image) => {
        content.push({ type: 'image', image })
      })
    }

    const updatedMessages = addMessage({
      role: 'user',
      content,
    })

    var index = updatedMessages.length - 1
    var text = updatedMessages[index].content[0].text

    var msg = updatedMessages.map((item) => {
      if (item.role == 'ai') {
        item.role = 'assistant'
      }
      return item
    })

    func = async () => {

      var sidebar = sidebarRef.current
      var obj = sidebar.state.selectedItem
      submit({
        userID: session?.user?.id,
        messages: toAISDKMessages(msg),
        template: currentTemplate,
        model: currentModel,
        config: languageModel,
        token: window.localStorage.getItem('authToken'),
        nextData: {
          chat_id: obj ? obj.id : null, llm_config_id: current.id,
        }
      })
    }

    // 走自己模型
    if (true) {
      var sidebar = sidebarRef.current
      var selectedItem = sidebar.state.selectedItem

      var reqData = {
        query: text,
        chat_id: selectedItem ? selectedItem.id : null,
        llm_config_id: current.id,
      }

      // 处理代码逻辑
      if (isArtifactsSelected) {
        reqData = {
          ...reqData,
          code: true,
          artifacts_template_id: 0,
        }
        if (selectedTemplate != 'auto') {
          reqData.artifacts_template_id = codeTemplateMap[selectedTemplate].id
        }
      }

      sendMsg(reqData, messages.length)
    } else {
      //走生成代码
      func()
    }

    setChatInput('')
    setFiles([])
    setCurrentTab('code')

    posthog.capture('chat_submit', {
      template: selectedTemplate,
      model: languageModel.model,
    })
  }

  // 走自己模型处理消息
  var sendMsg = async (params = {}, msgIndex) => {
    setAzureLoading(true)

    var serverName = serverValue
    if (serverName == 'none') serverName = ''
    var reqData = {
      "server_id": parseInt(serverName),
      ...params,
    };

    var url = `${process.env.NEXT_PUBLIC_API_URL}/chat/stream_agent`
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

      var isAddCodeItem = false

      // 循环读取reponse中的内容
      while (shouldContinue) {
        const { done, value } = await reader.read();

        if (done) {
          console.log('结束了')
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
                  setToolsMsg(str2)
                  isTools = true
                }


                // 处理消息
                if (obj.type == 'message') {
                  str += obj.content
                  setMessage({
                    role: 'ai',
                    content: [
                      {
                        type: 'text',
                        text: str,
                      },
                    ],
                  }, msgIndex + 1)
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
                    setFragment(itemObj)

                    const content2: Message['content'] = [
                      { type: 'text', text: itemObj.commentary || '' },
                      { type: 'code', text: itemObj.code || '' },
                    ]
                    
                    if (!isAddCodeItem) {
                      isAddCodeItem = true
                      addMessage({
                        role: 'assistant',
                        content:content2,
                        object: itemObj,
                      })

                    }
              
                    if (isAddCodeItem) {
                      setMessage({
                        content:content2,
                        object: itemObj,
                      })

                      console.log({
                        role: 'assistant',
                        content:content2,
                        object: itemObj,
                      })

                    }

                  }
                }

              }
            })
          }
        }
      }

      if (!isTools) {
        setToolsMsg('')
      }
      if (!reqData.chat_id) {
        var sidebar = sidebarRef.current
        sidebar.getList((data) => {
          if (data[0]) {
            sidebar.handleChatSelect(data[0].id)
          }
        })
      }

     

      // 处理code逻辑
      if (reqData.code == true) {
        var fragment = JSON.parse(str)
        setIsPreviewLoading(true)
        posthog.capture('fragment_generated', {
          template: fragment?.template,
        })

        const response = await fetch('/api/sandbox', {
          method: 'POST',
          body: JSON.stringify({
            fragment,
            userID: session?.user?.id,
            apiKey,
          }),
        })

        const result = await response.json()
        console.log('result', result)
        posthog.capture('sandbox_created', { url: result.url })

        setResult(result)
        setCurrentPreview({ fragment, result })
        setMessage({ result })
        setCurrentTab('fragment')
        setIsPreviewLoading(false)
      }

      setAzureLoading(false)
    } catch (error) {
      setAzureLoading(false)
    }
  };

  function retry() {
    submit({
      userID: session?.user?.id,
      messages: toAISDKMessages(messages),
      template: currentTemplate,
      model: currentModel,
      config: languageModel,
    })
  }

  function addMessage(message: Message) {
    setMessages((previousMessages) => [...previousMessages, message])
    return [...messages, message]
  }

  function handleSaveInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setChatInput(e.target.value)
  }

  function handleFileChange(change: SetStateAction<File[]>) {
    setFiles(change)
  }

  async function logout() {
    router.push('/login');
    await userLogout()
    localStorage.removeItem('authToken');
  }

  function handleLanguageModelChange(e: LLMModelConfig) {
    setLanguageModel({ ...languageModel, ...e })
  }

  function handleSocialClick(target: 'github' | 'x' | 'discord') {
    if (target === 'github') {
      window.open('https://github.com/e2b-dev/fragments', '_blank')
    } else if (target === 'x') {
      window.open('https://x.com/e2b_dev', '_blank')
    } else if (target === 'discord') {
      window.open('https://discord.gg/U7KEcGErtQ', '_blank')
    }

    posthog.capture(`${target}_click`)
  }

  function handleClearChat() {
    stop()
    setChatInput('')
    setFiles([])
    setMessages([])
    setFragment(undefined)
    setResult(undefined)
    setCurrentTab('code')
    setIsPreviewLoading(false)
  }

  function setCurrentPreview(preview: {
    fragment: DeepPartial<FragmentSchema> | undefined
    result: ExecutionResult | undefined
  }) {
    setFragment(preview.fragment)
    setResult(preview.result)
  }

  function handleUndo() {
    setMessages((previousMessages) => [...previousMessages.slice(0, -2)])
    setCurrentPreview({ fragment: undefined, result: undefined })
  }

  var initMsg = () => {
    setMessages([])

    if (typeof window !== 'undefined') {
      // 只有在浏览器环境中执行的代码
      window.localStorage.setItem('selectedChat', '')
    }
  }

  var tempItem = templatesList.find((item: any) => item.id == languageModel.model)


  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      ) : (
        <main className="flex min-h-screen max-h-screen">
          {supabase && (
            <AuthDialog
              open={isAuthDialogOpen}
              setOpen={setAuthDialog}
              view={authView}
              supabase={supabase}
            />
          )}

          {
            true && <>
              <Sidebar
                theme={the}
                ref={sidebarRef}
                disabled={isSubmitting || azureLoading}
                onAdd={() => {
                  initMsg()
                }}
                setMessages={setMessages}
              />
            </>
          }
          <div className="grid w-full md:grid-cols-2">
            <div
              className={`flex flex-col w-full max-h-full max-w-[800px] mx-auto px-4 overflow-auto ${fragment ? 'col-span-1' : 'col-span-2'}`}
              style={{ position: 'relative' }}
            >
              <NavBar
                session={session}
                showLogin={() => setAuthDialog(true)}
                signOut={logout}
                onSocialClick={handleSocialClick}
                onClear={handleClearChat}
                canClear={messages.length > 0}
                canUndo={messages.length > 1 && !isSubmitting}
                onUndo={handleUndo}
                userInfo={userInfo}
              />
              <Chat
                messages={messages}
                isLoading={isSubmitting || azureLoading}
                setCurrentPreview={setCurrentPreview}
              />
              <ChatInput
                retry={retry}
                isErrored={error !== undefined}
                isLoading={isSubmitting}
                isRateLimited={isRateLimited}
                stop={stop}
                input={chatInput}
                handleInputChange={handleSaveInputChange}
                handleSubmit={handleSubmitAuth}
                isMultiModal={currentModel?.multiModal || false}
                files={files}
                handleFileChange={handleFileChange}
                toolsMsg={toolsMsg}
                isMcpSelected={isMcpSelected}
                isArtifactsSelected={isArtifactsSelected}
                onMcpClick={() => {
                  setIsMcpSelected(!isMcpSelected)
                  setIsArtifactsSelected(false)
                }}
                onArtifactsClick={() => {
                  setIsArtifactsSelected(!isArtifactsSelected)
                  setIsMcpSelected(false)
                }}
              >
                <ChatPicker
                  templates={templates}
                  selectedTemplate={selectedTemplate}
                  onSelectedTemplateChange={setSelectedTemplate}
                  models={modelsList.models}
                  languageModel={languageModel}
                  onLanguageModelChange={handleLanguageModelChange}

                  serverValue={serverValue}
                  serverChange={setserverChange}

                  toolsValue={toolsValue}
                  toolsChange={setToolsChange}
                  templatesList={templatesList}
                  codeTemplateMap={codeTemplateMap}
                  isMcpSelected={isMcpSelected}
                  isArtifactsSelected={isArtifactsSelected}
                />
                {
                  isMcpSelected && <div>
                    <Modal />
                  </div>
                }

                {
                  true && <div id="llm-settings">
                    <ChatSettings
                      languageModel={languageModel}
                      onLanguageModelChange={handleLanguageModelChange}
                      apiKeyConfigurable={!process.env.NEXT_PUBLIC_NO_API_KEY_INPUT}
                      baseURLConfigurable={!process.env.NEXT_PUBLIC_NO_BASE_URL_INPUT}
                      llmSettingsOpen={llmSettingsOpen}
                      onLlmSettingsOpenChange={setLlmSettingsOpen}
                      userConfigs={userConfigs}
                      templatesList={templatesList}
                      getConfigsData={getConfigsData}
                      apiKeyTitle={tempItem?.api_key_variable}
                      baseURLTitle={tempItem?.base_url_variable}
                      modelTitle={tempItem?.model_variable}
                    />
                  </div>
                }

              </ChatInput>

            </div>
            <Preview
              apiKey={apiKey}
              selectedTab={currentTab}
              onSelectedTabChange={setCurrentTab}
              isChatLoading={isSubmitting}
              isPreviewLoading={isPreviewLoading}
              fragment={fragment}
              result={result as ExecutionResult}
              onClose={() => setFragment(undefined)}
            />
          </div>
        </main>
      )}
    </>
  )
}