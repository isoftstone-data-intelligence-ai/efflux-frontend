import { Duration } from '@/lib/duration'
import { getModelClient, getDefaultMode } from '@/lib/models'
import { LLMModel, LLMModelConfig } from '@/lib/models'
import { toPrompt } from '@/lib/prompt'
import ratelimit from '@/lib/ratelimit'
import { fragmentSchema as schema } from '@/lib/schema'
import { Templates } from '@/lib/templates'
import { streamObject, LanguageModel, CoreMessage } from 'ai'
import axios from 'axios'


export const maxDuration = 60

const rateLimitMaxRequests = process.env.RATE_LIMIT_MAX_REQUESTS
  ? parseInt(process.env.RATE_LIMIT_MAX_REQUESTS)
  : 10
const ratelimitWindow = process.env.RATE_LIMIT_WINDOW
  ? (process.env.RATE_LIMIT_WINDOW as Duration)
  : '1d'

export async function POST(req: Request) {
  const {
    messages,
    userID,
    template,
    model,
    config,
    token,
    nextData,
  }: {
    messages: CoreMessage[]
    userID: string
    template: Templates
    model: LLMModel
    config: LLMModelConfig
  } = await req.json()

  const limit = !config.apiKey
    ? await ratelimit(
        userID,
        rateLimitMaxRequests,
        ratelimitWindow,
      )
    : false

  if (limit) {
    return new Response('You have reached your request limit for the day.', {
      status: 429,
      headers: {
        'X-RateLimit-Limit': limit.amount.toString(),
        'X-RateLimit-Remaining': limit.remaining.toString(),
        'X-RateLimit-Reset': limit.reset.toString(),
      },
    })
  }

  const { model: modelNameString, apiKey: modelApiKey, ...modelParams } = config

  var obj = {
    system: toPrompt(template),
    messages,
    template:template,
  }
  
  
  var reqData = {
    ...nextData,
    code:true,
    query:`${JSON.stringify(obj)}
      
     就像网络接口的数据格式json字符串,去掉你的提示语，以及json数据结构外的内容 如下，代码部分放在code字段，其余字段看能否回填

    "{
      "commentary": "I will generate a simple 'Hello World' application using the Next.js template. This will include a basic page that displays 'Hello World' when accessed.",
      "template": "nextjs-developer",
      "title": "Hello World",
      "description": "A simple Next.js app that displays 'Hello World'.",
      "additional_dependencies": [],
      "has_additional_dependencies": false,
      "install_dependencies_command": "",
      "port": 3000,
      "file_path": "pages/index.tsx",
      "code": ""
    }"
`,
  };

  var data = ""
  try {
    const rs = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat/normal_chat`,reqData,{
      headers :{
        'Authorization': token,
      }
    })
    console.log('--------')
    console.log(rs.data)
    if(typeof rs.data == 'string'){
      data = rs.data.replace(/```json/g, '').replace(/```/g, '').trim();
    }
  } catch (error) {
    console.log(99999,error)
  }

  return new Response(
    new ReadableStream({
      async start(controller) {
        controller.enqueue(
          new TextEncoder().encode(
            data
          )
        );
        controller.close();
      },
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    }
  );
}
