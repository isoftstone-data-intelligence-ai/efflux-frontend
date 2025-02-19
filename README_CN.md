# EFFLUX

[English](./README.md) | [简体中文](./README_CN.md)

## Efflux是什么?

Efflux 是一款新一代 AI 交互平台 —— 一个强大、轻量且高度灵活的框架，可无缝集成最先进的大语言模型（LLMs）、生成式前端技术以及 MCP（模型上下文协议）服务器。它重新定义了 AI 驱动应用的部署和扩展方式，可以通过接入海量社区工具，构建普惠AI生态。

Efflux 可以是：

* **基于 LLM 的聊天机器人**，能够与用户进行自然语言对话。

* **文本到组件（Text-to-Artifact）生成工具**，帮助开发者轻松创建代码片段 —— 只需描述你的想法即可。Efflux 能实时渲染生成的 UI 代码，让你能够立即测试和迭代。

* **开箱即用的 MCP（模型上下文协议）主机**，通过更广泛的数据访问和集成自定义工具释放 LLM 潜力。

## 特性

- 基于 Next.js 14 (App Router, Server Actions)、shadcn/ui、TailwindCSS 和 Vercel AI SDK 构建
- 使用 [E2B](https://e2b.dev) 开发的 [E2B SDK](https://github.com/e2b-dev/code-interpreter) 来安全执行 AI 生成的代码
- UI 流式响应
- 支持安装和使用任何 npm、pip 包

## 快速开始

### 1. 克隆仓库

在终端中执行：

```
git clone https://github.com/isoftstone-data-intelligence-ai/efflux-frontend.git
```

### 2. 安装依赖

进入项目目录：

```
cd efflux-frontend
```

运行以下命令安装所需依赖：

```
npm i
```

### 3. 配置环境变量

创建 `.env.local` 文件并设置以下环境变量：

```sh
# 在此获取 E2B API 密钥 - https://e2b.dev/
E2B_API_KEY="your-e2b-api-key"

# 在此获取 Azure API 密钥 https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/create-resource?tabs=portal
AZURE_API_KEY=

# API 地址
NEXT_PUBLIC_API_URL=

# OpenAI API 密钥
OPENAI_API_KEY=

# 其他服务提供商
ANTHROPIC_API_KEY=
GROQ_API_KEY=
FIREWORKS_API_KEY=
TOGETHER_API_KEY=
GOOGLE_AI_API_KEY=
GOOGLE_VERTEX_CREDENTIALS=
MISTRAL_API_KEY=
XAI_API_KEY=

### 可选环境变量

# 站点域名
NEXT_PUBLIC_SITE_URL=

# 禁用聊天中的 API 密钥和基础 URL 输入
NEXT_PUBLIC_NO_API_KEY_INPUT=
NEXT_PUBLIC_NO_BASE_URL_INPUT=

# 速率限制
RATE_LIMIT_MAX_REQUESTS=
RATE_LIMIT_WINDOW=

# Vercel/Upstash KV（短 URL、速率限制）
KV_REST_API_URL=
KV_REST_API_TOKEN=

# Supabase（认证）
SUPABASE_URL=
SUPABASE_ANON_KEY=

# PostHog（分析）
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
```

### 4. 启动开发服务器

```
npm run dev
```

### 5. 构建网页应用

```
npm run build
```


## 文档

有关更多信息和指导，请查看 [Efflux Docs](http://localhost:8080/efflux-frontend/zh/)。