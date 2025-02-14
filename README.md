# EFFLUX

[English](./README.md) | [简体中文](./README_CN.md)

## Online Demo
Experience Efflux in action through our [online demo](http://47.236.204.213:3000/login).

## Features

- Based on Next.js 14 (App Router, Server Actions), shadcn/ui, TailwindCSS, Vercel AI SDK.
- Uses the [E2B SDK](https://github.com/e2b-dev/code-interpreter) by [E2B](https://e2b.dev) to securely execute code generated by AI.
- Streaming in the UI.
- Can install and use any package from npm, pip.


## Get started


### 1. Clone the repository

In your terminal:

```
git clone https://github.com/isoftstone-data-intelligence-ai/efflux-frontend.git
```

### 2. Install the dependencies

Enter the repository:

```
cd efflux-frontend
```

Run the following to install the required dependencies:

```
npm i
```

### 3. Set the environment variables

Create a `.env.local` file and set the following:

```sh
# Get your API key here - https://e2b.dev/
E2B_API_KEY="your-e2b-api-key"

# Get your Azure API key here https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/create-resource?tabs=portal
AZURE_API_KEY=

# API URL
NEXT_PUBLIC_API_URL=

# OpenAI API Key
OPENAI_API_KEY=

# Other providers
ANTHROPIC_API_KEY=
GROQ_API_KEY=
FIREWORKS_API_KEY=
TOGETHER_API_KEY=
GOOGLE_AI_API_KEY=
GOOGLE_VERTEX_CREDENTIALS=
MISTRAL_API_KEY=
XAI_API_KEY=

### Optional env vars

# Domain of the site
NEXT_PUBLIC_SITE_URL=

# Disabling API key and base URL input in the chat
NEXT_PUBLIC_NO_API_KEY_INPUT=
NEXT_PUBLIC_NO_BASE_URL_INPUT=

# Rate limit
RATE_LIMIT_MAX_REQUESTS=
RATE_LIMIT_WINDOW=

# Vercel/Upstash KV (short URLs, rate limiting)
KV_REST_API_URL=
KV_REST_API_TOKEN=

# Supabase (auth)
SUPABASE_URL=
SUPABASE_ANON_KEY=

# PostHog (analytics)
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
```

### 4. Start the development server

```
npm run dev
```

### 5. Build the web app

```
npm run build
