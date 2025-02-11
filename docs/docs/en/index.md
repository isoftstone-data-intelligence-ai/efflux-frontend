---
title: Overview
description:  # for seo optimization
keywords:     # for seo optimization
contributors:
    - Jun Ma
---

## What's Efflux?

Efflux, the next-generation AI interaction platform, is an advanced, lightweight, and flexible framework seamlessly integrating various AI-powered LLMs (large language models), generative front-end technologies, and MCP (Model Context Protocols) servers to achieve a new paradigm of deploying and scaling AI-driven applications.

Simply put, Efflux can serve as:

* a generative UI tool designed to help developers code UI components as simple as describing ideas. See [Generate Code](generate-code.md) for more details.

* an out-of-box MCP (Model Context Protocol) host to unlock the capabilities of connected MCP servers and loaded tools, enabling wider data access for large language models with standardized contexts. See [Work with MCP](work-with-mcp.md) for more details.

## ✨Core Features

- **Generative UI**
    - Chat-based interface with chat history management
    - Multi-LLM support (Claude, DeepSeek, etc.)
    - Artifacts dynamic rendering engine
    - Context memory management

- **Native MCP Support**
    - Parallel access to multiple MCP servers
    - Custom protocol adapter
    - Agent routing management

- **Intelligent Extension**
    - Plugin marketplace support
    - Workflow orchestration engine

## 🧩Architecture

```
EFFLUX
├── Core
│   ├── MCP Adapter       # Protocol translation layer
│   ├── Model Router      # Intelligent routing
│   └── Context Manager   # Dialog context management
├── Artifacts Engine      # Dynamic front-end rendering
├── Service Layer
│   ├── LLM Services      # Multiple LLM access
│   └── Agent Gateway     # Agent service gateway
├── Plugin System         # Extension module
└── Web Interface         # Interactive website
```

## 🚀Get Started

Setting up Efflux is just a few clicks away. For more details, visit [Get started](get-started.md).

## 🤝Contribute to Efflux

We’re committed to building Efflux as a collaborative, open-source project and ecosystem. Participation is not only welcomed – it's essential!

Here's how you can get involved:

* file issues to report bugs
* commit pull requests to improve codes and docs

For more details, visit [Contribute to Efflux](contribute.md).