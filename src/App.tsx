import { useState, useEffect } from "react";
import "./App.css";
import { invoke } from "@tauri-apps/api/core";
import { MilkdownEditor } from "./components/MilkdownEditor";
import DefaultContent from "./DefaultContent";

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'solarized'>('light');
  console.log('App组件渲染');

  const [markdown, setMarkdown] = useState(DefaultContent);
  const [fileMenuOpen, setFileMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [formatMenuOpen, setFormatMenuOpen] = useState(false);

  // 格式菜单功能
  const applyFormat = (format: string) => {
    switch (format) {
      case 'bold':
        setMarkdown(`${markdown} **bold text** `);
        break;
      case 'italic':
        setMarkdown(`${markdown} *italic text* `);
        break;
      case 'code':
        setMarkdown(`${markdown} \`code\` `);
        break;
      case 'link':
        setMarkdown(`${markdown} [link text](url) `);
        break;
      default:
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
  const handleBold = () => console.log('加粗');
  const handleItalic = () => console.log('斜体');
  const handleUnderline = () => console.log('下划线');
  const handleCode = () => console.log('代码');
  const handleStrikethrough = () => console.log('删除线');
  const handleHighlight = () => console.log('高亮');
  const handleComment = () => console.log('注释');
  const handleLink = () => console.log('超链接');
  const handleOpenLink = () => console.log('打开链接');
  const handleCopyLink = () => console.log('复制链接地址');
  const handleImage = () => console.log('图像');
  const handleClearFormat = () => console.log('清除样式');

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
        />
      </div>
    </main>
  );
}

