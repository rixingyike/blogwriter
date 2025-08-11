import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";
import { invoke } from "@tauri-apps/api/core";
import { MilkdownEditor } from "./components/MilkdownEditor";
import DefaultContent from "./DefaultContent";
import { useInstance } from '@milkdown/react';
import { callCommand } from '@milkdown/kit/utils';
import * as commands from '@milkdown/kit/preset/commonmark';
import { Ctx } from '@milkdown/kit/ctx';
import { toggleStrikethroughCommand } from '@milkdown/kit/preset/gfm';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'solarized'>('light');
  console.log('App组件渲染');

  const [markdown, setMarkdown] = useState(DefaultContent);
  const [fileMenuOpen, setFileMenuOpen] = useState(false);
  const [formatMenuOpen, setFormatMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [linkSubmenuOpen, setLinkSubmenuOpen] = useState(false);

  // 保存编辑器实例的引用
  const editorRef = useRef<any>(null);

  // 使用 useInstance 钩子获取编辑器实例
  const [loading, get] = useInstance();

  // 创建 action 函数，参考 Tooltip.tsx 的实现
  const action = useCallback((fn: (ctx: any) => void) => {
    if (loading) return;
    get().action(fn);
  }, [loading, get]);

  // 格式菜单功能
  const applyFormat = (format: string) => {
    console.log(`应用格式: ${format}`);

    if (loading) {
      console.error('编辑器实例未初始化或正在加载');
      return;
    }

    // 使用 Milkdown 的命令系统
    switch (format) {
      case 'bold':
        // 使用 callCommand 调用加粗命令
        action(callCommand(commands.toggleStrongCommand.key));
        break;
      case 'italic':
        // 使用 callCommand 调用斜体命令
        action(callCommand(commands.toggleEmphasisCommand.key));
        break;
      case 'underline':
        // 下划线功能 - 暂时禁用
        console.log('下划线功能暂时不可用');
        break;
      case 'code':
        // 使用 callCommand 调用行内代码命令
        action(callCommand(commands.toggleInlineCodeCommand.key));
        break;
      case 'strikethrough':
        // 删除线功能 - 使用 callCommand 调用删除线命令
        action(callCommand(toggleStrikethroughCommand.key));
        break;
      case 'highlight':
        // 高亮功能 - 暂时使用提示信息
        console.log('高亮功能 - 需要进一步实现');
        break;
      case 'comment':
        // 注释功能 - 暂时使用提示信息
        console.log('注释功能 - 需要进一步实现');
        break;
      case 'link':
        // 使用 callCommand 调用链接命令
        action(callCommand(commands.toggleLinkCommand.key));
        break;
      case 'image':
        // 图片功能 - 暂时使用提示信息
        console.log('图片功能 - 需要进一步实现');
        break;
      case 'openLink':
        // 打开当前选中的链接 - 简化实现
        console.log('打开链接功能 - 需要选中链接文本');
        break;
      case 'copyLink':
        // 复制当前选中链接的地址 - 简化实现
        console.log('复制链接地址功能 - 需要选中链接文本');
        break;
      case 'clearFormat':
        // 清除当前选中的格式 - 简化实现
        console.log('清除格式功能 - 需要选中文本');
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
              <button onClick={handleCode}>代码</button>
              <hr className="menu-divider" />
              <button onClick={handleStrikethrough}>删除线</button>
              <button onClick={handleHighlight}>高亮</button>
              <button onClick={handleComment}>注释</button>
              <hr className="menu-divider" />
              <div 
                className="menu-item-with-submenu"
                onMouseEnter={() => setLinkSubmenuOpen(true)}
                onMouseLeave={() => setLinkSubmenuOpen(false)}
              >
                <button className="submenu-trigger">超链接</button>
                {linkSubmenuOpen && (
                  <div className="submenu">
                    <button onClick={handleOpenLink}>打开链接</button>
                    <button onClick={handleCopyLink}>复制链接地址</button>
                  </div>
                )}
              </div>
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

