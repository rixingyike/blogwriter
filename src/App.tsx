import { useState, useEffect } from "react";
import "./App.css";
// 使用 Crepe 的样式，不需要导入 milkdown.css
import { invoke } from "@tauri-apps/api/core";
import { MilkdownEditor } from "./components/MilkdownEditor";

function App() {
  console.log('App组件渲染');
  const [markdown, setMarkdown] = useState(`# 我的Markdown笔记

## 欢迎使用所见即所得编辑器

这是一个**所见即所得**的Markdown编辑器，你可以：

- 直接编辑文本
- 使用*斜体*、**粗体**等格式
- 创建列表和表格
- 插入代码块

### 代码示例

\`\`\`javascript
function hello() {
  console.log("Hello, Markdown!");
}
\`\`\`

### 表格示例

| 功能 | 描述 |
|------|------|
| 实时预览 | 边写边看效果 |
| 多种主题 | 支持浅色、深色和Solarized |
| 文件操作 | 可以保存和打开文件 |

> 提示：使用斜杠(/)命令可以快速插入各种格式。

祝你使用愉快！`);
  const [theme, setTheme] = useState<'light' | 'dark' | 'solarized'>('light');

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

  // 确保主题在组件挂载后立即应用
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

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
          <span>主题</span>
          <div className="menu-content">
            <button onClick={() => setTheme('light')}>浅色</button>
            <button onClick={() => setTheme('dark')}>深色</button>
            <button onClick={() => setTheme('solarized')}>Solarized</button>
          </div>
        </div>
      </div>
      
      <div className="editor-container">
        <MilkdownEditor 
          key={theme} // 添加key属性，确保主题变化时重新创建组件
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

export default App;