import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getServerList, getTemplates,getConfigs } from '@/lib/api'
import { LLMModel, LLMModelConfig } from '@/lib/models'
import { TemplateId, Templates } from '@/lib/templates'
import 'core-js/features/object/group-by.js'
import { Server, Sparkles } from 'lucide-react'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'

export function ChatPicker({
  templates,
  selectedTemplate,
  onSelectedTemplateChange,
  models,
  languageModel,
  onLanguageModelChange,

  serverValue,
  serverChange,

  toolsValue,
  toolsChange,
  templatesList,
  codeTemplateMap,
  isMcpSelected,
  isArtifactsSelected,
}: {
  templates: Templates
  selectedTemplate: 'auto' | TemplateId
  onSelectedTemplateChange: (template: 'auto' | TemplateId) => void
  models: LLMModel[]
  languageModel: LLMModelConfig
  onLanguageModelChange: (config: LLMModelConfig) => void
  serverValue: 'auto' | TemplateId
  serverChange: (template: 'auto' | TemplateId) => void
}) {
  const [list, setList] = useState([])

  var getData = async () => {
    var rs = await getServerList({ userId: 1 })
    if (rs.data?.code == 200) {
      var data = rs.data.data
      setList(data)
    }
  }


  useEffect(() => {
    getData()
  }, [])

  var tools = [
    { label: 'MCP', value: 'mcp' },
    { label: 'Artifacts', value: 'code' },
  ]

  return (
    <div className="flex items-center space-x-2">
      {/* <div className="flex flex-col">
        <Select
          name="Tools"
          defaultValue={toolsValue}
          onValueChange={toolsChange}
        >
          <SelectTrigger className="whitespace-nowrap border-none shadow-none focus:ring-0 px-0 py-0 h-6 text-xs">
            <SelectValue placeholder="Select a persona" />
          </SelectTrigger>
          <SelectContent side="top">
            <SelectGroup>
              <SelectLabel>Tools</SelectLabel>
              {tools.map((item) => (
                <SelectItem key={String(item.value)} value={String(item.value)}>
                  <div className="flex items-center space-x-2">
                    <span>{item.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div> */}
      <div className="flex flex-col" id='languageModel' style={{ display: toolsValue == 'mcp' ? 'block' : 'block' }}>
        <Select
          name="languageModel"
          defaultValue={languageModel.model}
          onValueChange={(e) => onLanguageModelChange({ model: e })}
        >
          <SelectTrigger className="whitespace-nowrap border-none shadow-none focus:ring-0 px-0 py-0 h-6 text-xs">
            <SelectValue placeholder="Language model" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(
              Object.groupBy(templatesList, ({ provider }) => provider),
            ).map(([provider, templatesList]) => (
              <SelectGroup key={provider}>
                <SelectLabel>{provider}</SelectLabel>
                {templatesList?.map((model) => (
                  <SelectItem key={String(model.id)} value={String(model.id)}>
                    <div className="flex items-center space-x-2">
                      <Image
                        className="flex"
                        src={`/demo/thirdparty/logos/${'openai'}.svg`}
                        alt={model.provider}
                        width={14}
                        height={14}
                      />
                      <span>{model.model_display_name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>

        {/* <Select
          name="languageModel"
          defaultValue={languageModel.model}
          onValueChange={(e) => onLanguageModelChange({ model: e })}
        >
          <SelectTrigger className="whitespace-nowrap border-none shadow-none focus:ring-0 px-0 py-0 h-6 text-xs">
            <SelectValue placeholder="Language model" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(
              Object.groupBy(models, ({ provider }) => provider),
            ).map(([provider, models]) => (
              <SelectGroup key={provider}>
                <SelectLabel>{provider}</SelectLabel>
                {models?.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex items-center space-x-2">
                      <Image
                        className="flex"
                        src={`/demo/thirdparty/logos/${model.providerId}.svg`}
                        alt={model.provider}
                        width={14}
                        height={14}
                      />
                      <span>{model.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select> */}
      </div>
      {
        isArtifactsSelected && <>
          <div className="flex flex-col" id='auto'>
            <Select
              name="template"
              defaultValue={selectedTemplate}
              onValueChange={onSelectedTemplateChange}
            >
              <SelectTrigger className="whitespace-nowrap border-none shadow-none focus:ring-0 px-0 py-0 h-6 text-xs">
                <SelectValue placeholder="Select a persona" />
              </SelectTrigger>
              <SelectContent side="top">
                <SelectGroup>
                  <SelectLabel>Persona</SelectLabel>
                  <SelectItem value="auto">
                    <div className="flex items-center space-x-2">
                      <Sparkles
                        className="flex text-[#a1a1aa]"
                        width={14}
                        height={14}
                      />
                      <span>Auto</span>
                    </div>
                  </SelectItem>
                  {Object.entries(codeTemplateMap).map(([templateId, template]) => (
                    <SelectItem key={templateId} value={templateId}>
                      <div className="flex items-center space-x-2">
                        <Image
                          className="flex"
                          src={`/demo/thirdparty/templates/${templateId}.svg`}
                          alt={templateId}
                          width={14}
                          height={14}
                        />
                        <span>{template.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </>
      }
      
      {
        isMcpSelected && <>
          <div className="flex flex-col server-select" id='server_name'>
            
            <Select
              name="server_name"
              defaultValue={serverValue}
              onValueChange={serverChange}
              onOpenChange={(open) => {
                if (open) {
                  getData()
                }
              }}
            >
              <SelectTrigger className="whitespace-nowrap border-none shadow-none focus:ring-0 px-0 py-0 h-6 text-xs">
                <Server className="w-4 h-4" style={{marginRight: '8px',color: '#a1a1aa'}}/>
              <SelectValue placeholder="Select a persona" />
              </SelectTrigger>
              <SelectContent side="top">
                <SelectGroup>
                  <SelectLabel className="flex items-center gap-2">
                    Servers
                  </SelectLabel>
                  <SelectItem value="none">
                    <div className="flex items-center space-x-2">
                      <span>none</span>
                    </div>
                  </SelectItem>
                  {list.map((item) => (
                    <SelectItem key={String(item.id)} value={String(item.id)}>
                      <div className="flex items-center space-x-2">
                        <span>{item.server_name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </>
      }

    </div>
  )
}
