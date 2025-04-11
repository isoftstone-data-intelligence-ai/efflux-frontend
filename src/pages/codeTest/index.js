import React, { useState, useEffect, useRef, useCallback } from 'react';
import { withRouter } from 'next/router';
import dynamic from 'next/dynamic';
import styles from './index.module.scss';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
});

var htmlStr =`<div>
  <div class="hello" contenteditable="true">Hello World!</div>
  <div class="hello2" contenteditable="true">Hello World22!</div>
</div>`

const CodeTest = () => {
  const [htmlCode, setHtmlCode] = useState(htmlStr);
  const [cssCode, setCssCode] = useState('.hello, .hello2 {\n  color: blue;\n  cursor: pointer;\n  padding: 10px;\n  border: 1px dashed transparent;\n}\n\n.hello:hover, .hello2:hover {\n  border-color: #666;\n}');
  const [jsCode, setJsCode] = useState(`// 监听内容变化
let lastSelection = null;
let isUpdating = false;
let activeElement = null;

// 初始化时等待DOM加载完成
setTimeout(() => {
  // 为所有可编辑元素添加事件监听
  document.querySelectorAll('[contenteditable="true"]').forEach(editor => {
    // 记录当前活动元素
    editor.addEventListener('focus', (e) => {
      activeElement = e.target;
    });

    // 处理输入事件
    editor.addEventListener('input', (e) => {
      if (isUpdating || !activeElement) return;
      
      const sel = window.getSelection();
      if (sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        lastSelection = {
          element: activeElement,
          offset: range.startOffset
        };
      }

      window.parent.postMessage({
        type: "contentUpdate",
        content: activeElement.innerHTML,
        elementPath: getElementPath(activeElement)
      }, "*");
    });
  });

  // 监听DOM变化
  const observer = new MutationObserver((mutations) => {
    if (!isUpdating) {
      requestAnimationFrame(restoreSelection);
    }
  });

  observer.observe(document.body, {
    characterData: true,
    childList: true,
    subtree: true
  });
}, 0);

// 获取元素的路径
function getElementPath(element) {
  const path = [];
  let current = element;
  
  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase();
    if (current.id) {
      selector += '#' + current.id;
    } else if (current.className) {
      selector += '.' + Array.from(current.classList).join('.');
    }
    path.unshift(selector);
    current = current.parentElement;
  }
  
  return path.join(' > ');
}

// 在DOM变化后恢复光标位置
const restoreSelection = () => {
  if (!lastSelection || isUpdating || !lastSelection.element) return;
  
  isUpdating = true;
  const sel = window.getSelection();
  const range = document.createRange();
  
  if (lastSelection.element.firstChild) {
    try {
      range.setStart(lastSelection.element.firstChild, Math.min(lastSelection.offset, lastSelection.element.firstChild.length));
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      lastSelection.element.focus();
    } catch (e) {
      console.log("Error restoring selection:", e);
    }
  }
  
  isUpdating = false;
};`);
  const [output, setOutput] = useState('');
  const iframeRef = useRef(null);
  const isUpdatingRef = useRef(false);

  const updatePreview = useCallback(() => {
    const combinedCode = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${cssCode}</style>
        </head>
        <body>
          ${htmlCode}
          <script>${jsCode}</script>
        </body>
      </html>
    `;
    setOutput(combinedCode);
  }, [htmlCode, cssCode, jsCode]);

  useEffect(() => {
    if (!isUpdatingRef.current) {
      updatePreview();
    }
  }, [htmlCode, cssCode, jsCode, updatePreview]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'contentUpdate') {
        isUpdatingRef.current = true;
        
        try {
          // 解析HTML并创建DOM
          const parser = new DOMParser();
          const doc = parser.parseFromString(htmlCode, 'text/html');
          
          // 使用提供的路径找到对应元素
          const pathParts = event.data.elementPath.split(' > ');
          let currentElement = doc.body.firstElementChild;
          
          // 遍历路径找到目标元素
          for (let i = 1; i < pathParts.length && currentElement; i++) {
            const part = pathParts[i];
            if (part.includes('#')) {
              currentElement = currentElement.querySelector(part);
            } else if (part.includes('.')) {
              currentElement = currentElement.querySelector(part);
            } else {
              currentElement = currentElement.querySelector(part);
            }
          }
          
          // 更新找到的元素内容
          if (currentElement) {
            currentElement.innerHTML = event.data.content;
            // 获取更新后的完整HTML，包括最外层的contenteditable属性
            const updatedHtml = doc.body.firstElementChild.outerHTML;
            if (updatedHtml !== htmlCode) {
              setHtmlCode(updatedHtml);
            }
          }
        } catch (error) {
          console.error('Error updating HTML:', error);
        }
        
        // 重置更新标志
        setTimeout(() => {
          isUpdatingRef.current = false;
        }, 0);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [htmlCode]);

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
  };

  return (
    <div className={styles.codeEditor}>
      <div className={styles.editorPanel}>
        <div className={styles.panelHeader}>HTML</div>
        <div className={styles.editor}>
          <MonacoEditor
            height="100%"
            defaultLanguage="html"
            value={htmlCode}
            onChange={(value) => {
              isUpdatingRef.current = false;
              setHtmlCode(value);
            }}
            theme="vs-light"
            options={editorOptions}
          />
        </div>
      </div>
      
      <div className={styles.editorPanel}>
        <div className={styles.panelHeader}>CSS</div>
        <div className={styles.editor}>
          <MonacoEditor
            height="100%"
            defaultLanguage="css"
            value={cssCode}
            onChange={setCssCode}
            theme="vs-light"
            options={editorOptions}
          />
        </div>
      </div>
      
      <div className={styles.editorPanel}>
        <div className={styles.panelHeader}>JavaScript</div>
        <div className={styles.editor}>
          <MonacoEditor
            height="100%"
            defaultLanguage="javascript"
            value={jsCode}
            onChange={setJsCode}
            theme="vs-light"
            options={editorOptions}
          />
        </div>
      </div>
      
      <div className={styles.editorPanel}>
        <div className={styles.panelHeader}>Preview</div>
        <iframe
          ref={iframeRef}
          className={styles.preview}
          srcDoc={output}
          title="preview"
          sandbox="allow-scripts"
        />
      </div>
    </div>
  );
};

export default withRouter(CodeTest);
