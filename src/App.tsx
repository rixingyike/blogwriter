import { useState, useEffect, useRef } from "react";
import "./App.css";
import { invoke } from "@tauri-apps/api/core";
import { MilkdownEditor } from "./components/MilkdownEditor";
import DefaultContent from "./DefaultContent";
import { Editor } from '@milkdown/react';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'solarized'>('light');
  console.log('App组件渲染');

  const [markdown, setMarkdown] = useState(DefaultContent);
  const [fileMenuOpen, setFileMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [formatMenuOpen, setFormatMenuOpen] = useState(false);
  
  // 保存编辑器实例的引用
  const editorRef = useRef<Editor | null>(null);

  // 格式菜单功能
  const applyFormat = (format: string) => {
    console.log(`应用格式: ${format}`);
    
    if (!editorRef.current) {
      console.error('编辑器实例未初始化');
      return;
    }
    
    // 使用 Milkdown 的命令系统
    switch (format) {
      case 'bold':
        // 使用 setMarkdown 方法插入加粗文本
        setMarkdown(`${markdown} **加粗文本** `);
        break;
      case 'italic':
        // 使用 setMarkdown 方法插入斜体文本
        setMarkdown(`${markdown} *斜体文本* `);
        break;
      case 'code':
        // 使用 setMarkdown 方法插入代码文本
        setMarkdown(`${markdown} \`代码\` `);
        break;
      case 'link':
        // 简单实现，实际应该弹出对话框让用户输入URL
        const url = prompt('请输入链接地址:', 'https://');
        if (url) {
          setMarkdown(`${markdown} [链接文本](${url}) `);
        }
        break;
      case 'image':
        // 简单实现，实际应该弹出对话框让用户输入图片URL和描述
        const imageUrl = prompt('请输入图片地址:', 'https://');
        if (imageUrl) {
          const alt = prompt('请输入图片描述:', '') || '图片';
          setMarkdown(`${markdown} ![${alt}](${imageUrl}) `);
        }
        break;
      case 'strikethrough':
        // 使用 setMarkdown 方法插入删除线文本
        setMarkdown(`${markdown} ~~删除线文本~~ `);
        break;
      case 'highlight':
        // 使用 setMarkdown 方法插入高亮文本
        setMarkdown(`${markdown} ==高亮文本== `);
        break;
      case 'underline':
        // 使用 setMarkdown 方法插入下划线文本
        setMarkdown(`${markdown} <u>下划线文本</u> `);
        break;
      case 'comment':
        // 使用 setMarkdown 方法插入注释
        setMarkdown(`${markdown} <!-- 注释内容 --> `);
        break;
      case 'openLink':
        console.log('打开链接功能需要实现');
        break;
      case 'copyLink':
        console.log('复制链接地址功能需要实现');
        break;
      case 'clearFormat':
        console.log('清除样式功能需要实现');
        break;
      default:
        console.log(`未知格式: ${format}`);
        break;
    }
  };

  // 文件菜单功能
  const saveFile = async () => {
    try {
      await invoke('save_file', { content: markdown });
      alert('文件保存成功');
    } catch (err) {
      console.error('保存文件失败:', err);
      alert('保存文件失败');
    }
  };

  const openFile = async () => {
    try {
      const content: string = await invoke('open_file');
      setMarkdown(content);
    } catch (err) {
      console.error('打开文件失败:', err);
      alert('打开文件失败');
    }
  };

  // 格式菜单功能
  const handleBold = () => applyFormat('bold');
  const handleItalic = () => applyFormat('italic');
  const handleUnderline = () => applyFormat('underline');
  const handleCode = () => applyFormat('code');
  const handleStrikethrough = () => applyFormat('strikethrough');
  const handleHighlight = () => applyFormat('highlight');
  const handleComment = () => applyFormat('comment');
  const handleLink = () => applyFormat('link');
  const handleOpenLink = () => applyFormat('openLink');
  const handleCopyLink = () => applyFormat('copyLink');
  const handleImage = () => applyFormat('image');
  const handleClearFormat = () => applyFormat('clearFormat');

  // 确保主题在组件挂载后立即应用
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <main className={`container ${theme}`}>
      <div className="menu-bar">
        {/* 文件菜单 */}
        <div 
          className="file-menu" 
          onMouseEnter={() => setFileMenuOpen(true)}
          onMouseLeave={() => setFileMenuOpen(false)}
        >
          <button className="menu-button">文件</button>
          {fileMenuOpen && (
            <div className="menu-dropdown">
              <button onClick={saveFile}>保存</button>
              <button onClick={openFile}>打开</button>
            </div>
          )}
        </div>

        {/* 格式菜单 */}
        <div 
          className="format-menu" 
          onMouseEnter={() => setFormatMenuOpen(true)}
          onMouseLeave={() => setFormatMenuOpen(false)}
        >
          <button className="menu-button">格式</button>
          {formatMenuOpen && (
            <div className="menu-dropdown">
              <button onClick={handleBold}>加粗</button>
              <button onClick={handleItalic}>斜体</button>
              <button onClick={handleUnderline}>下划线</button>
              <button onClick={handleCode}>代码</button>
              <hr className="menu-divider" />
              <button onClick={handleStrikethrough}>删除线</button>
              <button onClick={handleHighlight}>高亮</button>
              <button onClick={handleComment}>注释</button>
              <hr className="menu-divider" />
              <button onClick={handleLink}>超链接</button>
              <button onClick={handleOpenLink}>打开链接</button>
              <button onClick={handleCopyLink}>复制链接地址</button>
              <button onClick={handleImage}>图像</button>
              <hr className="menu-divider" />
              <button onClick={handleClearFormat}>清除样式</button>
            </div>
          )}
        </div>

        {/* 主题菜单 */}
        <div 
          className="theme-menu" 
          onMouseEnter={() => setThemeMenuOpen(true)}
          onMouseLeave={() => setThemeMenuOpen(false)}
        >
          <button className="menu-button">主题</button>
          {themeMenuOpen && (
            <div className="menu-dropdown">
              <button onClick={() => setTheme('light')}>浅色</button>
              <button onClick={() => setTheme('dark')}>深色</button>
              <button onClick={() => setTheme('solarized')}>Solarized</button>
            </div>
          )}
        </div>
      </div>

      <div className="editor-container">
        <MilkdownEditor 
          key={theme}
          value={markdown} 
          onChange={(value) => {
            console.log('编辑器内容更新', value.substring(0, 20) + '...');
            setMarkdown(value);
          }} 
          theme={theme}
          onEditorReady={(editor) => {
            editorRef.current = editor;
            console.log('编辑器实例已准备就绪');
          }}
        />
      </div>
    </main>
  );
}

