# EFFLUX

[English](./README.md) | [简体中文](./README_CN.md)

## 特性

- 基于 Next.js 14 (App Router, Server Actions)、@radix-ui、TailwindCSS 和 Vercel AI SDK 构建
- 使用 [E2B](https://e2b.dev) 开发的 [E2B SDK](https://github.com/e2b-dev/code-interpreter) 来安全执行 AI 生成的代码
- UI 流式响应
- 支持安装和使用任何 npm、pip 包

## 界面预览

### 主界面
![主界面](./docs/images/drak.png)


### 白色主题
![白色主题](./docs/images/light.png)


### 代码生成
![代码生成](./docs/images/code.png)

### 代码预览
![代码预览](./docs/images/preview.png)

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
npm i --force
```

### 3. 配置环境变量
设置以下变量：
dev环境配置 `/config/environments/dev.js` 
test环境配置  `/config/environments/test.js`

```javascript
// 在此获取 E2B API 密钥 - https://e2b.dev/
module.exports = {
  'apiUrl': '/api',
  'e2bApiKey': 'your-e2b-api-key',
};
```

### 4. 启动开发服务器

```
npm run dev
```

### 5. 构建网页应用

```sh
npm run build

# 构建开发环境
# npm run build-dev 

# 构建测试环境
# npm run build-test
```