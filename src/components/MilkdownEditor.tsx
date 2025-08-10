import { FC, useRef } from 'react';
import { Crepe } from '@milkdown/crepe';
import { Milkdown, useEditor, Editor } from '@milkdown/react';

import '@milkdown/crepe/theme/common/style.css';
import '@milkdown/crepe/theme/frame.css';
import './MilkdownEditor.css';

interface MilkdownEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  theme?: 'light' | 'dark' | 'solarized';
  onEditorReady?: (editor: Editor) => void;
}

export const MilkdownEditor: FC<MilkdownEditorProps> = ({
  value = '# 欢迎使用 Milkdown\n\n这是一个示例段落，点击左侧可以看到菜单。\n\n## 二级标题\n\n再来一个段落。',
  onChange,
  theme = 'light',
  onEditorReady
}) => {
  const editorRef = useRef<Editor | null>(null);

  useEditor((root) => {
    const crepe = new Crepe({
      root,
      defaultValue: value,
      onChange: (markdown) => {
        if (onChange) {
          onChange(markdown);
        }
      }
    });
    
    // 保存编辑器实例以便外部访问
    if (onEditorReady) {
      // 在编辑器准备好后调用回调
      setTimeout(() => {
        // Crepe 实例本身就是 Editor 实例
        editorRef.current = crepe;
        if (editorRef.current) {
          onEditorReady(editorRef.current);
        }
      }, 100);
    }
    
    return crepe;
  }, [theme, value]);

  return <Milkdown />;
};