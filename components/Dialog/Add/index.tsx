import React, { Component } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import * as Form from '@radix-ui/react-form'
import './index.css'
import { addMcpServer, getMcpServer, updateMcpServer } from '@/lib/api'
import { toast } from '@/components/ui/use-toast'

export default class extends Component {
  state = {
    open: false,
    id: '',
    type: 'add',

    serverName: '',
    command: '',
    arguments: '',
    env: '',
  }

  componentDidMount() {
    this.props.init(this)
  }

  onOpen = (data) => {
    this.setState({
      open: true,
      id: data.id,
      type: data.type,
    }, () => {
      if (data.type != 'add') {
        this.getDetails()
      }
    })
  }

  onClose = () => {
    this.setState({
      open: false,
      id: '',
      type: 'add',
      serverName: '',
      command: '',
      arguments: '',
      env: '',
    })
  }

  // 获取详情
  getDetails = async () => {
    const { id } = this.state
    try {
      var rs = await getMcpServer({ id })
      if (rs.data?.code == 200) {
        var data = rs.data.data
        var env  = data.env || {}
        this.setState({
          serverName: data.server_name,
          command: data.command,
          arguments: data.args.join(' '),
          env: Object.keys(env).map(key => `${key}=${env[key]}`).join('\n'),
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: rs.data?.msg || "Failed to get server details"
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get server details"
      })
    }
  }

  handleSubmit = async (event) => {
    const { type } = this.state
    event.preventDefault()
    event.stopPropagation()
    const formData = new FormData(event.target)

    var env = formData.get('env')
    var args = formData.get('arguments')

    var result = env.split('\n').map(item => item.trim());
    const envVars = result.reduce((acc, item) => {
      const [key, value] = item.split('=').map(part => part.trim());
      acc[key] = value;
      return acc;
    }, {});

    var reqData = {
      "user_id": 1,
      server_name: formData.get('server_name'),
      command: formData.get('command'),
      args: args.split(' '),
      env: env ? envVars : {},
    }

    if (type == 'add') {
      this.add(reqData)
    }
    if (type == 'update') {
      reqData.id = this.state.id
      this.update(reqData)
    }

  }

  add = async (reqData) => {
    try {
      var rs = await addMcpServer(reqData)
      if (rs.data?.code == 200) {
        this.onClose()
        this.props.getData()
        toast({
          title: "Success",
          description: "Server added successfully"
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: rs.data?.sub_message || "Failed to add server"
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add server"
      })
    }
  }

  update = async (reqData) => {
    try {
      var rs = await updateMcpServer(reqData)
      if (rs.data?.code == 200) {
        this.onClose()
        this.props.getData()
        toast({
          title: "Success",
          description: "Server updated successfully"
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: rs.data?.sub_message || "Failed to update server"
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update server"
      })
    }
  }

  handleInputChange = (field) => (event) => {
    this.setState({
      [field]: event.target.value
    })
  }

  handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.stopPropagation()
    }
  }

  render() {
    const { open, type, serverName, command, arguments: args, env } = this.state
    return (
      <Dialog.Root open={open} onOpenChange={(val) => { }}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog-content">
            <Dialog.Title className="dialog-title">
              {type === 'add' ? 'Add Server' : 'Update Server'}
            </Dialog.Title>

            <Form.Root className="form-root" onSubmit={this.handleSubmit} onClick={(e) => e.stopPropagation()}>
              <Form.Field className="form-field" name="server_name">
                <div className="field-row">
                  <Form.Label className="form-label">Server Name</Form.Label>
                  <Form.Message className="form-message" match="valueMissing">
                    Please enter server name
                  </Form.Message>
                </div>
                <Form.Control asChild>
                  <input
                    className="form-input"
                    type="text"
                    required
                    placeholder="Enter server name"
                    value={serverName}
                    onChange={this.handleInputChange('serverName')}
                    onKeyDown={this.handleKeyDown}
                  />
                </Form.Control>
              </Form.Field>

              <Form.Field className="form-field" name="command">
                <div className="field-row">
                  <Form.Label className="form-label">Command</Form.Label>
                  <Form.Message className="form-message" match="valueMissing">
                    Please enter command
                  </Form.Message>
                </div>
                <Form.Control asChild>
                  <input
                    className="form-input"
                    type="text"
                    required
                    placeholder="For example: npx, uvx"
                    value={command}
                    onChange={this.handleInputChange('command')}
                    onKeyDown={this.handleKeyDown}
                  />
                </Form.Control>
              </Form.Field>

              <Form.Field className="form-field" name="arguments">
                <div className="field-row">
                  <Form.Label className="form-label">Arguments</Form.Label>
                  <Form.Message className="form-message" match="valueMissing">
                    Please enter arguments
                  </Form.Message>
                </div>
                <Form.Control asChild>
                  <input
                    className="form-input"
                    type="text"
                    required
                    placeholder="Arguments"
                    value={args}
                    onChange={this.handleInputChange('arguments')}
                    onKeyDown={this.handleKeyDown}
                  />
                </Form.Control>
              </Form.Field>

              <Form.Field className="form-field" name="env">
                <div className="field-row">
                  <Form.Label className="form-label">Env</Form.Label>
                </div>
                <Form.Control asChild>
                  <textarea
                    className="form-textarea"
                    placeholder="Environment Variables"
                    rows={3}
                    value={env}
                    onChange={this.handleInputChange('env')}
                    onKeyDown={this.handleKeyDown}
                  />
                </Form.Control>
              </Form.Field>

              <div className="form-buttons">
                <button
                  type="button"
                  className="button cancel"
                  onClick={() => {
                    this.onClose()
                  }}
                >
                  Cancel
                </button>
                <Form.Submit asChild>
                  <button className="button submit">
                    {type === 'add' ? 'Add' : 'Update'}
                  </button>
                </Form.Submit>
              </div>
            </Form.Root>

            <Dialog.Close />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    )
  }
}
