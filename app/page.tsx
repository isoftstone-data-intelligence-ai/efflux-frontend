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
import { SetStateAction, useEffect, useState, useRef } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import Modal from '@/components/Dialog'
import Sidebar from './Sidebar'
import { useTheme } from 'next-themes'

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
      model: 'isfot-ai',
    },
  )

  const [serverValue, setserverChange] = useState<'none' | TemplateId>(
    'none',
  )

  const [toolsValue, setToolsChange] = useState('mcp')
  const [chat, setChat] = useState('1')

  const posthog = usePostHog()

  const [result, setResult] = useState<ExecutionResult>()
  const [messages, setMessages] = useState<Message[]>([])
  const [fragment, setFragment] = useState<DeepPartial<FragmentSchema>>()
  const [currentTab, setCurrentTab] = useState<'code' | 'fragment'>('code')
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)
  const [isAuthDialogOpen, setAuthDialog] = useState(false)
  const [authView, setAuthView] = useState<AuthViewType>('sign_in')
  const [isRateLimited, setIsRateLimited] = useState(false)
  const { session, apiKey } = useAuth(setAuthDialog, setAuthView)
  const [azureLoading, setAzureLoading] = useState(false)

  const { setTheme, theme } = useTheme()
  var the = theme || window.localStorage.getItem('theme')

  const sidebarRef = useRef();

  const currentModel = modelsList.models.find(
    (model) => model.id === languageModel.model,
  )
  const currentTemplate =
    selectedTemplate === 'auto'
      ? templates
      : { [selectedTemplate]: templates[selectedTemplate] }
  const lastMessage = messages[messages.length - 1]

  const { object, submit, isLoading, stop, error } = useObject({
    api:
      currentModel?.id === 'o1-preview' || currentModel?.id === 'o1-mini'
        ? '/api/chat-o1'
        : '/api/chat',
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

  useEffect(() => {
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

  useEffect(() => {
    var sidebar = sidebarRef.current

  }, [])

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

  async function handleSubmitAuth(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!session) {
      return setAuthDialog(true)
    }

    if (isLoading) {
      stop()
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



    func = () => {
      var msg = updatedMessages.map((item) => {
        if (item.role == 'ai') {
          item.role = 'assistant'
        }
        return item
      })
      submit({
        userID: session?.user?.id,
        messages: toAISDKMessages(msg),
        template: currentTemplate,
        model: currentModel,
        config: languageModel,
      })
    }

    // 走自己模型
    if (toolsValue == 'mcp') {
      var sidebar = sidebarRef.current
      var obj = sidebar.state.selectedItem
      sendMsg({ query: text, chat_id: obj ? obj.id : null }, messages.length)
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
      },
    });
    try {
      //获取UTF8的解码
      const encode = new TextDecoder('utf-8');

      // 获取body的reader
      const reader = response.body.getReader();

      var str = ''

      let shouldContinue = true;

      // 循环读取reponse中的内容
      while (shouldContinue) {
        const { done, value } = await reader.read();

        if (done) {
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
                // 去写代码
                if (obj.type == 'coding') {
                  func()
                  shouldContinue = false
                  return
                }
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
                console.log(obj)
              }
            })
          }
        }
      }

      if(!reqData.chat_id){
        var sidebar = sidebarRef.current
        sidebar.getList((data)=>{
          if(data[0]){
            sidebar.handleChatSelect(data[0].id)
          }
        })
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

  function logout() {
    supabase
      ? supabase.auth.signOut()
      : console.warn('Supabase is not initialized')
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
    window.localStorage.setItem('selectedChat', '')
  }

  return (
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
        toolsValue == 'mcp' && <>
          <Sidebar
            theme={the}
            ref={sidebarRef}
            disabled={isLoading || azureLoading}
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
            canUndo={messages.length > 1 && !isLoading}
            onUndo={handleUndo}
          />
          <Chat
            messages={messages}
            isLoading={isLoading || azureLoading}
            setCurrentPreview={setCurrentPreview}
          />
          <ChatInput
            retry={retry}
            isErrored={error !== undefined}
            isLoading={isLoading}
            isRateLimited={isRateLimited}
            stop={stop}
            input={chatInput}
            handleInputChange={handleSaveInputChange}
            handleSubmit={handleSubmitAuth}
            isMultiModal={currentModel?.multiModal || false}
            files={files}
            handleFileChange={handleFileChange}
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
            />
            {
              toolsValue == 'mcp' && <div>
                <Modal />
              </div>
            }

            {
              toolsValue == 'code' && <>
                <ChatSettings
                  languageModel={languageModel}
                  onLanguageModelChange={handleLanguageModelChange}
                  apiKeyConfigurable={!process.env.NEXT_PUBLIC_NO_API_KEY_INPUT}
                  baseURLConfigurable={!process.env.NEXT_PUBLIC_NO_BASE_URL_INPUT}
                />
              </>
            }

          </ChatInput>

        </div>
        <Preview
          apiKey={apiKey}
          selectedTab={currentTab}
          onSelectedTabChange={setCurrentTab}
          isChatLoading={isLoading}
          isPreviewLoading={isPreviewLoading}
          fragment={fragment}
          result={result as ExecutionResult}
          onClose={() => setFragment(undefined)}
        />
      </div>
    </main>
  )
}