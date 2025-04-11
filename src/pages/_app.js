// 全局样式（应用于所有页面和组件）
import '@/styles/global/index.scss'
import Head from 'next/head';
import React from 'react'
import GlobalLayout from "@/layouts/GlobalLayout";
import { useRouter } from 'next/navigation';
import { appWithTranslation } from 'next-i18next'
import Script from 'next/script';

function App(params) {
  const router = useRouter();

  var { Component, pageProps } = params
  
  // 使用在页面级别定义的布局（如果可用）
  const getLayout = Component.getLayout || ((page) => page)

  // 处理添加 base 后 首页404问题
  var url = params?.router?.state?.asPath
  if(url == '/' ){
    router.replace(`/home`);
    return <></>
  }
  var base = router.basePath || ''
  return (
    <GlobalLayout>
      <Head>
        <title>EFFLUX</title>
        <link rel="stylesheet" href="//at.alicdn.com/t/c/font_4863327_xx1vf0wwdo.css" />
        <Script src={`${base}/lib/loadjs.js`}></Script>
      </Head>
        {getLayout(<Component {...pageProps} />)}
    </GlobalLayout>
  );
}

export default appWithTranslation(App)