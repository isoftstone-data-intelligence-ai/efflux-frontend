/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path')
const { getEvnData } = require('./config/environments')

//* 设置环境
var environment = process.env.PROJECT_ENV || 'localhost';
var env = getEvnData(environment)

// 非运行状态
if(!process.env.PROJECT_START){
  console.log('--------------------------------------------');
  console.log(`--------------当前环境是${environment}----------------`);
  console.log('--------------------------------------------');
  console.log(env);
}

var next = {}

// 静态打包
if(process.env.STATIC_EXPORT){
  next = {
    ...next,
    output:'export',
    assetPrefix: '/',
  }
}

const nextConfig = {

  ...next,

  // basePath: '/demo',
  // assetPrefix: '/demo/',

  // 开启 webpack5
  webpack5: true,

  // React严格模式
  reactStrictMode: true,

  compiler: {
    // 开启 styled-components
    styledComponents: true,
  },

  // sass配置
  sassOptions: {
    includePaths: [path.join(__dirname, '/src/styles')],
  },

  // 多环境配置
  env: env,
  
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    if (process.env.ANALYZE) {
      config.plugins.push(new withBundleAnalyzer());
    }

    return config;
  },

  // 国际化
  i18n: {
    locales: ['en-US', 'zh-CH'],
    defaultLocale: 'zh-CH',
  },

  // 本地代理
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://www.efflux.ai/api/:path*', // 代理到后端 API 地址
        // destination: 'http://10.16.81.63:8001/api/:path*',
      },

      {
        source: '/nextApi/:path*', // 自定义 API 前缀
        destination: '/api/:path*',    // 实际的 API 路径
      },
    ];
  },
}

module.exports =  nextConfig
