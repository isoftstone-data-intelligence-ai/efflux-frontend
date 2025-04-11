import React from 'react';
import * as Select from '@radix-ui/react-select';
import styles from './index.module.scss';

import Image from 'next/image';
import { ChevronDown, Check } from 'lucide-react';
import classNames from 'classnames';

import { withConsumer } from '../../context';
import { connect } from 'react-redux';
import { update } from '@/utils/immutableUtil';
import { getConfigs, getTemplates } from '@/api/ai';
import ChatSettings from './ChatSettings';
import router from 'next/router';

@withConsumer
@connect(({ chat }) => ({
  userConfigs: chat.userConfigs,
  templatesList: chat.templatesList,
  selectedModel: chat.selectedModel,
}))
class Comp extends React.Component {
  componentDidMount() {
    const {
      value: { changeState },
    } = this.props;
    this.getConfigsData();
    this.getTemplatesData();

    var selectedModel = window.localStorage.getItem('selectedModel') || '1';
    changeState({ selectedModel: selectedModel });
  }

  getConfigsData = async () => {
    const {
      value: { changeState },
    } = this.props;
    var rs = await getConfigs();
    if (rs.data?.code == 200) {
      var data = rs.data.data;
      changeState({ userConfigs: data });
    }
  };

  getImg = (key) => {
    var base = ''
    if(router.basePath){
      base = router.basePath
    }

    console.log(router.basePath,222222)

      var map = {
        '1':`${base}/img/models/azure.png`,
        '2':`${base}/img/models/openai.png`,
        '4':`${base}/img/models/tongyi.png`,
        '5':`${base}/img/models/deepseek.png`,
        '3':`${base}/img/models/anthropic.png`,
      }
      return map[key]
  }

  getTemplatesData = async () => {
    const {
      value: { changeState },
    } = this.props;
    var rs = await getTemplates();
    if (rs.data?.code == 200) {
      var data = rs.data.data.map((item, i) => {
        return {
          ...item,
          icon: this.getImg(String(item.id)),
          id: String(item.id),
          name: item.provider,
          model: item.model_display_name,
        };
      });

      changeState({ templatesList: data });
    }
  };

  getSelectedModel = (value) => {
    const { templatesList } = this.props;
    return templatesList.find((model) => model.id === value);
  };

  chunk = (arr, size) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size),
    );
  };

  handleValueChange = (value) => {
    const {
      value: { changeState,controller },
    } = this.props;
    changeState({ selectedModel: value });
    window.localStorage.setItem('selectedModel', value);

    setTimeout(()=>{
      if(controller.ChatSettings){
        controller.ChatSettings.checkConfig()
      }
    },300)

  };

  shouldComponentUpdate = (np, ns) => update.call(this, np, ns);
  render() {
    const { templatesList, selectedModel } = this.props;
    const modelPairs = this.chunk(templatesList, 2);
    const currentModel = this.getSelectedModel(selectedModel);

    return (
      <div className={styles.container}>

        {currentModel && (
          <>
            <Select.Root
              value={selectedModel}
              onValueChange={this.handleValueChange}
            >
              <Select.Trigger
                className={classNames(styles.trigger, {
                  [styles.open]: true,
                })}
                aria-label="Select model"
              >
                <div className={styles.triggerContent}>
                  <div className={styles.modelIcon}>
                    <img
                      src={currentModel.icon}
                      alt={currentModel.name}
                      width={24}
                      height={24}
                    />
                  </div>
                  <div className={styles.modelInfo}>
                    <div className={styles.modelName}>{currentModel.name}</div>
                    <div className={styles.modelVersion}>
                      {currentModel.model}
                    </div>
                  </div>
                </div>
                <div className={styles.triggerRight}>
                  <Check size={16} className={styles.checkIcon} />
                  <Select.Icon
                    className={classNames(styles.selectIcon, {
                      [styles.open]: true,
                    })}
                  >
                    <ChevronDown size={16} />
                  </Select.Icon>
                </div>
              </Select.Trigger>

              <Select.Portal>
                <Select.Content
                  className={styles.content}
                  position="popper"
                  sideOffset={8}
                >
                  <Select.Viewport>
                    {modelPairs.map((pair, index) => (
                      <div key={index} className={styles.modelRow}>
                        {pair.map((model) => (
                          <Select.Item
                            key={model.id}
                            value={model.id}
                            className={classNames(styles.item, {
                              [styles.selected]: selectedModel === model.id,
                            })}
                          >
                            <div className={styles.modelIcon}>
                              <img
                                src={model.icon}
                                alt={model.name}
                                width={24}
                                height={24}
                              />
                            </div>
                            <div className={styles.modelInfo}>
                              <div className={styles.modelName}>
                                {model.name}
                              </div>
                              <div className={styles.modelVersion}>
                                {model.model}
                              </div>
                            </div>
                            <Check size={16} className={styles.itemCheckIcon} />
                          </Select.Item>
                        ))}
                      </div>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
            <ChatSettings getConfigsData={this.getConfigsData}/>
          </>
        )}
      </div>
    );
  }
}

export default Comp;
