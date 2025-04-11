import React, { Component } from 'react';
import styles from './index.module.scss';
import * as Dialog from '@radix-ui/react-dialog';
import Image from 'next/image';
import McpServer from './McpServer';

import { withConsumer } from '../context';
import { connect } from 'react-redux';
import { update } from '@/utils/immutableUtil';
@withConsumer
@connect(({ chat }) => ({
  mcpServerOpen: chat.mcpServerOpen,
}))
class Comp extends Component {
  state = {
    selectedMenu: 'mcp',
  };

  getComp = (key) => {
    var maps = {
      mcp: McpServer,
    };
    return maps[key];
  };

  shouldComponentUpdate = (np, ns) => update.call(this, np, ns);
  render() {
    const { mcpServerOpen } = this.props;
    const { changeState } = this.props.value;
    const { selectedMenu } = this.state;

    var menuList = [{ name: 'MCP Server', key: 'mcp', icon: '🖥️' }];

    var Comp = this.getComp(selectedMenu);

    return (
      <div className={styles.container}>
        <Dialog.Root
          open={mcpServerOpen}
          onOpenChange={(val) => {
            changeState({ mcpServerOpen: val });
          }}
        >
          <Dialog.Overlay className="overlay" />
          <Dialog.Content
            className="content"
            style={{ width: 'auto', padding: 0 }}
          >
            <div>
              <div className="flex justify-center items-center">
                <div className="bg-gray-100 rounded-lg shadow-lg  flex flex-col">
                  <div
                    className="flex items-center justify-between px-4 py-2 bg-gray-200 rounded-t-lg"
                    style={{ height: '36px' }}
                  >
                    <div className="flex items-center space-x-2 ml-auto"></div>
                    <div
                      className="text-gray-600 cursor-pointer"
                      onClick={() => {
                        changeState({ mcpServerOpen: false });
                      }}
                    >
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
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <div
                    className="flex flex-1"
                    style={{
                      minWidth: '800px',
                    }}
                  >
                    <div className="w-1/4 bg-white border-r border-gray-300 p-4">
                      <ul className="space-y-2">
                        {menuList.map((item, i) => (
                          <li
                            key={i}
                            className={`flex items-center px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                              selectedMenu === item.key
                                ? 'bg-blue-100 text-blue-600'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            onClick={() =>
                              this.setState({ selectedMenu: item.key })
                            }
                          >
                            <span className="mr-2">{item.icon}</span>
                            <span className="font-medium">{item.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div
                      className="flex-1 p-4"
                      style={{
                        height: '600px',
                        overflow: 'auto',
                      }}
                    >
                      <Comp />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Root>
      </div>
    );
  }
}

export default Comp;
