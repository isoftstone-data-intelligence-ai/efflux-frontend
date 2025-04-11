import React from 'react';
import * as Popover from '@radix-ui/react-popover';
import { KeyRound } from 'lucide-react';
import styles from './index.module.scss';
import { withConsumer } from '../../../context';
import { addConfigs, updateConfigs } from '@/api/ai';
import { connect } from 'react-redux';

@withConsumer
@connect(({ chat }) => ({
  userConfigs: chat.userConfigs,
  templatesList: chat.templatesList,
  selectedModel: chat.selectedModel,
}))
class ChatSettings extends React.Component {
  state = {
    open: false,
    apiKey: '',
    baseUrl: '',
    model: '',
  };

  componentDidMount() {
    const { value: { setController } } = this.props;
    setController('ChatSettings', this)
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSave = async () => {
    const { templatesList, selectedModel, userConfigs } = this.props;
    const { apiKey, baseUrl, model } = this.state;

    var templatesItem;
    templatesList.forEach((item, i) => {
      if (item.id == selectedModel) templatesItem = item;
    });

    var current = null;
    userConfigs.forEach((item) => {
      if (selectedModel == String(item.template_id)) current = item;
    });

    var reqData = {
      template_id: templatesItem.id,
      provider: templatesItem.provider,
      api_key: apiKey,
      base_url: baseUrl,
      model: model,
      model_nickname: templatesItem.model_display_name,
      extra_config: {},
    };

    var func = addConfigs;
    if (current.id) {
      func = updateConfigs;
      reqData.id = current.id;
    }

    console.log(reqData);

    var rs = await func(reqData);
    if (rs.data?.code == 200) {
      this.props.getConfigsData();
    }
    this.setState({ open: false });
  };

  getCurrent = () => {
    const { userConfigs, selectedModel } = this.props;
    var current = null;
    userConfigs.forEach((item) => {
      if (selectedModel == String(item.template_id)) current = item;
    });
    return current;
  };

  checkConfig = ()=>{
    var current = this.getCurrent()
    if(!current){
      this.setState({
        open:true,
        apiKey: '',
        baseUrl: '',
        model: '',
      })
    }
    return current
  }

  render() {
    const { userConfigs, selectedModel } = this.props;
    const { apiKey, baseUrl, model } = this.state;

    return (
      <div style={{ marginRight: '32px' }}>
        <Popover.Root
          open={this.state.open}
          onOpenChange={(val) => {
            if (val) {
              //这里是打开模型
              var current = this.getCurrent() || {};
             
              this.setState({
                open: val,
                apiKey: current.api_key,
                baseUrl: current.base_url,
                model: current.model,
              });
              return;
            }
            this.setState({ open: val });
          }}
        >
          <Popover.Trigger asChild>
            <button className={styles.settingsButton} aria-label="Settings">
              <i
                className="iconfont icon-a-bianzu31"
                style={{ fontSize: '18px' }}
              ></i>
            </button>
          </Popover.Trigger>

          <Popover.Portal>
            <Popover.Content
              className={styles.content}
              sideOffset={4}
              align="start"
            >
              <div className={styles.field}>
                <label className={styles.label} htmlFor="apiKey">
                  API Key
                </label>
                <input
                  id="apiKey"
                  name="apiKey"
                  className={styles.input}
                  type="password"
                  value={apiKey}
                  onChange={this.handleInputChange}
                  placeholder="Enter API Key"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="baseUrl">
                  Base URL
                </label>
                <input
                  id="baseUrl"
                  name="baseUrl"
                  className={styles.input}
                  type="text"
                  value={baseUrl}
                  onChange={this.handleInputChange}
                  placeholder="Enter Base URL"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="model">
                  Model
                </label>
                <input
                  id="model"
                  name="model"
                  className={styles.input}
                  type="text"
                  value={model}
                  onChange={this.handleInputChange}
                  placeholder="Enter Model"
                />
              </div>

              <button className={styles.saveButton} onClick={this.handleSave}>
                Save
              </button>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    );
  }
}

export default ChatSettings;
