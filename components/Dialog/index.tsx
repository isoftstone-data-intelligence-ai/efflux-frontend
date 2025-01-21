import React, { Component } from 'react';
import './index.css'
import * as Dialog from '@radix-ui/react-dialog'
import Image from 'next/image'
import { getServerList, delMcpServer } from '@/lib/api'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip'
import { Button } from '../ui/button'
import DeleteConfirmation from '../DeleteConfirmation'
import Add from './Add'

export default class extends Component {
  addModal = null
  state = {
    list: [],
    delOpen: false,
    open: false,
    addOpen: false,
    id: 0,
    type: 'add',
  }
  componentDidMount() {
    this.getData()
  }
  getData = async () => {
    var rs = await getServerList({userId:1})
    if (rs.data?.code == 200) {
      var data = rs.data.data
      this.setState({ list: data })
    }
  }
  render() {
    const { id, type, delOpen, open, list, addOpen } = this.state
    return (
      <div>
        <Dialog.Root open={open} onOpenChange={(val) => {
          this.setState({ open: val })
          if (val) {  
            this.getData()
          }
        }}>
          <Dialog.Trigger className="">
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button type='button' variant="ghost" size="icon" className="text-muted-foreground h-6 w-6 rounded-sm">
                    <Image
                      className="flex"
                      src={require('./img/config_s.svg')}
                      alt={'Servers SettingsLLM'}
                      width={14}
                      height={14}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>MCP settings</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Dialog.Trigger>
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
                        this.setState({ open: false })
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
                      <ul>
                        <li className="text-blue-600 font-medium">MCP Server</li>
                      </ul>
                    </div>

                    <div
                      className="flex-1 p-4"
                      style={{
                        height: '600px',
                        overflow: 'auto',
                      }}
                    >
                      <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center space-x-4">
                          {/* <button class="px-4 py-2 bg-gray-200 text-sm font-medium rounded-lg">All</button>
                            <button class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg">Installed</button> */}
                        </div>
                        <div
                          class="text-blue-600 text-lg"
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            this.addModal.onOpen({type: 'add'})
                          }}
                        >
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"
                              fill="currentColor"
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {list.map((item, i) => {
                          return (
                            <div
                              key={i}
                              className="bg-white border border-gray-300 rounded-lg p-4"
                              style={{ position: 'relative' }}
                            >
                              <p
                                className="font-semibold"
                                style={{ color: '#09090B' }}
                              >
                                {item.server_name}
                              </p>
                              <p className="text-sm text-gray-600">
                                Command: {item.command}
                              </p>
                              <p className="text-sm text-gray-600">
                                Arguments:
                                {item.args.map((str) => {
                                  return str + ' '
                                })}
                              </p>

                              {
                                item.env && Object.keys(item.env).length > 0 &&
                                <p className="text-sm text-gray-600">
                                  <div>Environment Variables:</div>
                                  {Object.keys(item.env).map((key) => {
                                    return (
                                      <span key={key}>
                                        {key}={item.env[key]}
                                        <br />
                                      </span>
                                    )
                                  })}
                                </p>
                              }
                            
                              <div
                                className="absolute top-4 right-4 text-blue-600 text-sm font-medium"
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                  this.setState({ id: item.id, delOpen: true })
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
                                    d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z"
                                    fill="currentColor"
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                  ></path>
                                </svg>
                              </div>
                              <div
                                className="absolute top-4 right-10 text-blue-600 text-sm font-medium"
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                  this.addModal.onOpen({id: item.id,type: 'update'})
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
                                    d="M12.1464 1.14645C12.3417 0.951184 12.6583 0.951184 12.8535 1.14645L14.8535 3.14645C15.0488 3.34171 15.0488 3.65829 14.8535 3.85355L10.9109 7.79618C10.8349 7.87218 10.7471 7.93543 10.651 7.9835L6.72359 9.94721C6.53109 10.0435 6.29861 10.0057 6.14643 9.85355C5.99425 9.70137 5.95652 9.46889 6.05277 9.27639L8.01648 5.34897C8.06455 5.25283 8.1278 5.16507 8.2038 5.08907L12.1464 1.14645ZM12.5 2.20711L8.91091 5.79618L7.87266 7.87267L8.12731 8.12732L10.2038 7.08907L13.7929 3.5L12.5 2.20711ZM9.99998 2L8.99998 3H4.9C4.47171 3 4.18056 3.00039 3.95552 3.01877C3.73631 3.03668 3.62421 3.06915 3.54601 3.10899C3.35785 3.20487 3.20487 3.35785 3.10899 3.54601C3.06915 3.62421 3.03669 3.73631 3.01878 3.95552C3.00039 4.18056 3 4.47171 3 4.9V11.1C3 11.5283 3.00039 11.8194 3.01878 12.0445C3.03669 12.2637 3.06915 12.3758 3.10899 12.454C3.20487 12.6422 3.35785 12.7951 3.54601 12.891C3.62421 12.9309 3.73631 12.9633 3.95552 12.9812C4.18056 12.9996 4.47171 13 4.9 13H11.1C11.5283 13 11.8194 12.9996 12.0445 12.9812C12.2637 12.9633 12.3758 12.9309 12.454 12.891C12.6422 12.7951 12.7951 12.6422 12.891 12.454C12.9309 12.3758 12.9633 12.2637 12.9812 12.0445C12.9996 11.8194 13 11.5283 13 11.1V6.99998L14 5.99998V11.1V11.1207C14 11.5231 14 11.8553 13.9779 12.1259C13.9549 12.407 13.9057 12.6653 13.782 12.908C13.5903 13.2843 13.2843 13.5903 12.908 13.782C12.6653 13.9057 12.407 13.9549 12.1259 13.9779C11.8553 14 11.5231 14 11.1207 14H11.1H4.9H4.87934C4.47686 14 4.14468 14 3.87409 13.9779C3.59304 13.9549 3.33469 13.9057 3.09202 13.782C2.7157 13.5903 2.40973 13.2843 2.21799 12.908C2.09434 12.6653 2.04506 12.407 2.0221 12.1259C1.99999 11.8553 1.99999 11.5231 2 11.1207V11.1206V11.1V4.9V4.87935V4.87932V4.87931C1.99999 4.47685 1.99999 4.14468 2.0221 3.87409C2.04506 3.59304 2.09434 3.33469 2.21799 3.09202C2.40973 2.71569 2.7157 2.40973 3.09202 2.21799C3.33469 2.09434 3.59304 2.04506 3.87409 2.0221C4.14468 1.99999 4.47685 1.99999 4.87932 2H4.87935H4.9H9.99998Z"
                                    fill="currentColor"
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                  ></path>
                                </svg>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <DeleteConfirmation
                open={delOpen}
                title="Delete Confirmation"
                description="Are you sure you want to delete this item?"
                cancelText="Cancel"
                confirmText="Delete"
                onOpenChange={(val) => {
                  this.setState({ delOpen: val })
                }}
                onConfirm={async () => {
                  var reqData = {
                    id:id,
                  }
                  var rs = await delMcpServer(reqData)
                  if (rs.data?.code == 200) {
                    this.getData()
                    this.setState({ delOpen: false })
                  }
                }}
              />

              <Add
                init={(This) => {
                  console.log('init', This)
                  this.addModal = This
                }}
                getData={this.getData}
              />
            </div>
          </Dialog.Content>
        </Dialog.Root>
      </div>
    );
  }
}
