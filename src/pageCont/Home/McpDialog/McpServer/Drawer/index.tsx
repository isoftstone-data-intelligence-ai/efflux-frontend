import React, { Component } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { getMcpList } from '@/api/ai'
import styles from './index.module.scss';

export default class extends Component {
  state = {
    list: [],
    loading: false,
  }
  componentDidMount = () => {
    this.getData()
  }

  getData = async () => {
    this.setState({ loading: true })
    try {
      var reqData = {
        page: 1,
        page_size: 10000,
      }
      var rs = await getMcpList(reqData)
      if (rs.data?.code == 200) {
        var data = rs.data.data
        this.setState({ list: data.records }, () => {
          this.state.list.forEach((item) => {
            if (!item.github_url) return
            // this.getGithub(item)
          })
        })
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      this.setState({ loading: false })
    }
  }

  getGithub = async (item) => {
    var response = await window.fetch(item.github_url);
    // 检查响应是否成功
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // 获取可读流的读取器
    const reader = response.body.getReader();
    let result = '';

    // 循环读取流数据
    while (true) {
      const { done, value } = await reader.read();
      if (done) break; // 读取完成

      // 将 Uint8Array 转换为文本并追加到结果中
      result += new TextDecoder().decode(value);
    }

    var obj = JSON.parse(result)
    item.github = obj
    this.forceUpdate()
  }

  onApply = (item) => {
    if (!this.props.addModal) return
    this.props.addModal.onOpen({ type: 'add',shop:true,shopData: item})
  }

  render() {
    const { list } = this.state
    const { open, onOpenChange, title, description } = this.props
    return (
      <div className="custom-drawer-wrapper">
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
          <Dialog.Portal>
           <div className={styles.container}>
           <Dialog.Overlay className="custom-drawer-overlay" />
            <Dialog.Content className="custom-drawer-content">
              <div className="custom-drawer-header">
                {title && (
                  <Dialog.Title className="custom-drawer-title">
                    {title}
                  </Dialog.Title>
                )}
                {description && (
                  <Dialog.Description className="custom-drawer-description">
                    {description}
                  </Dialog.Description>
                )}
                <Dialog.Close className="custom-drawer-close">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </Dialog.Close>
              </div>
              <div className="custom-drawer-body">
                {this.state.loading ? (
                  <div className="flex items-center justify-center" style={{ height: '100%' }}>
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
                  </div>
                ) : (
                  <div className="mcp-shop-grid">
                    {
                      list.map((item, i) => {
                        return (
                          <div className="mcp-shop-item">
                            <div className="mcp-shop-item-header">
                              <div className="mcp-shop-item-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                                  <path d="M3 3h18v2a3 3 0 1 1-6 0 3 3 0 1 1-6 0 3 3 0 1 1-6 0v-2z" />
                                  <path d="M3 10v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10" />
                                  <path d="M12 14v6" />
                                  <path d="M8 14v1" />
                                  <path d="M16 14v1" />
                                </svg>
                              </div>
                              <a href={item.github_html_url} target="_blank" className="github-link">
                                <svg className="github-icon" viewBox="0 0 16 16" fill="currentColor">
                                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                                </svg>
                                <span className="github-stars">{item.github_stars}</span>
                              </a>
                            </div>
                            <div className="mcp-shop-item-content">
                              <h3 className="mcp-shop-item-title">{item.server_name}</h3>
                              <p className="mcp-shop-item-description" style={{ marginBottom: '6px' }}>
                                {item.description}
                              </p>
                            </div>
                            <button className="mcp-shop-item-button" 
                            onClick={() => {
                              this.onApply(item)
                            }}
                            disabled={item.desktop_app}
                            >Apply</button>
                          </div>
                        )
                      })
                    }

                  </div>
                )}
              </div>
            </Dialog.Content>
           </div>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    )
  }
}