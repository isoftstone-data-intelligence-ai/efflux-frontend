// import "prismjs/plugins/line-numbers/prism-line-numbers.js";
// import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import styles from './index.module.scss';
// import './code-theme.css'
import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-typescript'
import { useEffect } from 'react'

export function CodeView({ code, lang }) {
  useEffect(() => {
    Prism.highlightAll()
  }, [code])

  return (
    <div className={styles.codeCont}>
      <pre
      className="p-4 pt-2"
        style={{
          fontSize: 12,
          backgroundColor: 'transparent',
          borderRadius: 0,
          margin: 0,
        }}
      >
        <code className={`language-${lang}`}>{code}</code>
      </pre>
    </div>
  )
}
