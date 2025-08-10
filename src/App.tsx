import { useState, useEffect } from "react";
import { marked } from "marked";
import "./App.css";
import { invoke } from "@tauri-apps/api/core";

function App() {
  const [markdown, setMarkdown] = useState('# Hello World\n\nStart writing your markdown here...');
  const [html, setHtml] = useState('');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const parsedHtml = marked.parse(markdown);
    if (typeof parsedHtml === 'string') {
      setHtml(parsedHtml);
    } else {
      parsedHtml.then(result => setHtml(result));
    }
  }, [markdown]);

  const formatText = (prefix: string, suffix: string, placeholder = '') => {
    const textarea = document.querySelector('.editor') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);
    const newText = markdown.substring(0, start) + prefix + 
                   (selectedText || placeholder) + suffix + 
                   markdown.substring(end);
    setMarkdown(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selectedText || placeholder).length
      );
    }, 0);
  };

  const saveFile = async () => {
    try {
      await invoke('save_file', { content: markdown });
    } catch (err) {
      console.error('保存文件失败:', err);
    }
  };

  const openFile = async () => {
    try {
      const content: string = await invoke('open_file');
      setMarkdown(content);
    } catch (err) {
      console.error('打开文件失败:', err);
    }
  };

  return (
    <main className={`container ${theme}`}>
      <div className="menu-bar">
        <div className="menu">
          <span>文件</span>
          <div className="menu-content">
            <button onClick={openFile}>打开</button>
            <button onClick={saveFile}>保存</button>
          </div>
        </div>
        <div className="menu">
          <span>格式</span>
          <div className="menu-content">
            <button onClick={() => formatText('**', '**', '加粗文本')}>加粗</button>
            <button onClick={() => formatText('*', '*', '斜体文本')}>斜体</button>
            <button onClick={() => formatText('`', '`', '代码')}>行内代码</button>
            <button onClick={() => formatText('```\n', '\n```', '代码块')}>代码块</button>
            <button onClick={() => formatText('# ', '', '标题')}>标题1</button>
            <button onClick={() => formatText('## ', '', '标题')}>标题2</button>
            <button onClick={() => formatText('### ', '', '标题')}>标题3</button>
            <button onClick={() => formatText('- ', '', '列表项')}>无序列表</button>
            <button onClick={() => formatText('1. ', '', '列表项')}>有序列表</button>
            <button onClick={() => formatText('> ', '', '引用文本')}>引用</button>
            <button onClick={() => formatText('[', '](url)', '链接文本')}>链接</button>
            <button onClick={() => formatText('![', '](url)', '图片描述')}>图片</button>
          </div>
        </div>
        <div className="menu">
          <span>主题</span>
          <div className="menu-content">
            <button onClick={() => setTheme('light')}>浅色</button>
            <button onClick={() => setTheme('dark')}>深色</button>
            <button onClick={() => setTheme('solarized')}>Solarized</button>
          </div>
        </div>
      </div>
      
      <div className="editor-container">
        <textarea
          className="editor"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
        />
        <div 
          className="preview"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </main>
  );
}

export default App;