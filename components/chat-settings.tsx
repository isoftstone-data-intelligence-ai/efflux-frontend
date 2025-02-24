import { useState,useImperativeHandle} from 'react';
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { addConfigs,updateConfigs } from '@/lib/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'
import { LLMModelConfig } from '@/lib/models'
import { Settings2 } from 'lucide-react'

export function ChatSettings({
  apiKeyConfigurable,
  baseURLConfigurable,
  languageModel,
  onLanguageModelChange,
  llmSettingsOpen,
  onLlmSettingsOpenChange,
  templatesList,
  getConfigsData,
  userConfigs,
  apiKeyTitle,
  baseURLTitle,
  modelTitle,
}: {
  apiKeyConfigurable: boolean
  baseURLConfigurable: boolean
  languageModel: LLMModelConfig
  onLanguageModelChange: (model: LLMModelConfig) => void

  templatesList: any
  getConfigsData: () => void
  userConfigs: any
}) {

  const [apiKey, setApikey] = useState('')
  const [baseURL, setBaseURL] = useState('')
  const [model, setModel] = useState('')


    //这里是打开模型
    var current = {}
    userConfigs.forEach((item) => {
      if(languageModel.model == String(item.template_id)) current = item
    })

  return (
    <DropdownMenu
      open={llmSettingsOpen}
      onOpenChange={(val) => {
        if (val) {
          //这里是打开模型
          
          setApikey(current.api_key)
          setBaseURL(current.base_url)
          setModel(current.model)

         
         
        }
        onLlmSettingsOpenChange(val)
      }}
    >
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button id="llm-settings" variant="ghost" size="icon" className="text-muted-foreground h-6 w-6 rounded-sm">
                <Settings2 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>LLM settings</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent align="start">
        {apiKeyConfigurable && (
          <>
            <div className="flex flex-col gap-2 px-2 py-2">
              <Label htmlFor="apiKey">{apiKeyTitle}</Label>
              <Input
                name="apiKey"
                type="password"
                placeholder="Auto"
                required={true}
                value={apiKey}
                onChange={(e) =>
                  setApikey(e.target.value)
                }
                className="text-sm"
              />
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        {baseURLConfigurable && (
          <>
            <div className="flex flex-col gap-2 px-2 py-2">
              <Label htmlFor="baseURL">{baseURLTitle}</Label>
              <Input
                name="baseURL"
                type="text"
                placeholder="Auto"
                required={true}
                value={baseURL}
                onChange={(e) =>
                  setBaseURL(e.target.value)
                }
                className="text-sm"
              />
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        <div className="flex flex-col gap-2 px-2 py-2">
          <Label htmlFor="model">{modelTitle}</Label>
          <Input
            name="model"
            type="text"
            placeholder="Auto"
            required={true}
            value={model}
            onChange={(e) =>
              setModel(e.target.value)
            }
            className="text-sm"
          />
        </div>
        <DropdownMenuSeparator />
        {/* <div className="flex flex-col gap-1.5 px-2 py-2">
          <span className="text-sm font-medium">Parameters</span>
          <div className="flex space-x-4 items-center">
            <span className="text-sm flex-1 text-muted-foreground">
              Output tokens
            </span>
            <Input
              type="number"
              defaultValue={languageModel.maxTokens}
              min={50}
              max={10000}
              step={1}
              className="h-6 rounded-sm w-[84px] text-xs text-center tabular-nums"
              placeholder="Auto"
              onChange={(e) =>
                onLanguageModelChange({
                  maxTokens: parseFloat(e.target.value) || undefined,
                })
              }
            />
          </div>
          <div className="flex space-x-4 items-center">
            <span className="text-sm flex-1 text-muted-foreground">
              Temperature
            </span>
            <Input
              type="number"
              defaultValue={languageModel.temperature}
              min={0}
              max={5}
              step={0.01}
              className="h-6 rounded-sm w-[84px] text-xs text-center tabular-nums"
              placeholder="Auto"
              onChange={(e) =>
                onLanguageModelChange({
                  temperature: parseFloat(e.target.value) || undefined,
                })
              }
            />
          </div>
          <div className="flex space-x-4 items-center">
            <span className="text-sm flex-1 text-muted-foreground">Top P</span>
            <Input
              type="number"
              defaultValue={languageModel.topP}
              min={0}
              max={1}
              step={0.01}
              className="h-6 rounded-sm w-[84px] text-xs text-center tabular-nums"
              placeholder="Auto"
              onChange={(e) =>
                onLanguageModelChange({
                  topP: parseFloat(e.target.value) || undefined,
                })
              }
            />
          </div>
          <div className="flex space-x-4 items-center">
            <span className="text-sm flex-1 text-muted-foreground">Top K</span>
            <Input
              type="number"
              defaultValue={languageModel.topK}
              min={0}
              max={500}
              step={1}
              className="h-6 rounded-sm w-[84px] text-xs text-center tabular-nums"
              placeholder="Auto"
              onChange={(e) =>
                onLanguageModelChange({
                  topK: parseFloat(e.target.value) || undefined,
                })
              }
            />
          </div>
          <div className="flex space-x-4 items-center">
            <span className="text-sm flex-1 text-muted-foreground">
              Frequence penalty
            </span>
            <Input
              type="number"
              defaultValue={languageModel.frequencyPenalty}
              min={0}
              max={2}
              step={0.01}
              className="h-6 rounded-sm w-[84px] text-xs text-center tabular-nums"
              placeholder="Auto"
              onChange={(e) =>
                onLanguageModelChange({
                  frequencyPenalty: parseFloat(e.target.value) || undefined,
                })
              }
            />
          </div>
          <div className="flex space-x-4 items-center">
            <span className="text-sm flex-1 text-muted-foreground">
              Presence penalty
            </span>
            <Input
              type="number"
              defaultValue={languageModel.presencePenalty}
              min={0}
              max={2}
              step={0.01}
              className="h-6 rounded-sm w-[84px] text-xs text-center tabular-nums"
              placeholder="Auto"
              onChange={(e) =>
                onLanguageModelChange({
                  presencePenalty: parseFloat(e.target.value) || undefined,
                })
              }
            />
          </div>
        </div> */}
        <DropdownMenuSeparator />
        <div className="flex justify-end px-2 py-2">
          <Button
            onClick={async () => {

              var templatesItem
              templatesList.forEach((item, i) => {
                if (item.id == languageModel.model) templatesItem = item
              })

              console.log(templatesItem)
              console.log(templatesList)
              console.log(languageModel)
              console.log(current)

              var reqData = {
                "template_id": templatesItem.id,
                "provider": templatesItem.provider,
                "api_key": apiKey,
                "base_url": baseURL,
                "model": model,
                "model_nickname": templatesItem.model_display_name,
                "extra_config": {}
              }

              var func = addConfigs
              if(current.id){
                func = updateConfigs
                reqData.id = current.id
              }

              var rs = await func(reqData)
              if (rs.data?.code == 200) {
                getConfigsData()
              }
              
              onLlmSettingsOpenChange(false);
            }}
            className="w-20"
          >
            Save
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
