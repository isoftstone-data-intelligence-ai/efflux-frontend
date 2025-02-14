# EFFLUX

[English](./README.md) | [简体中文](./README_CN.md)

## 在线演示
您可以通过访问我们的[在线演示](http://47.236.204.213:3000/login)来体验Efflux的功能。

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
