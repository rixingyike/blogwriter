import type { FC } from 'react';
import { Crepe } from '@milkdown/crepe';
import { Milkdown, useEditor } from '@milkdown/react';

import '@milkdown/crepe/theme/common/style.css';
import '@milkdown/crepe/theme/frame.css';
import './MilkdownEditor.css';

interface MilkdownEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  theme?: 'light' | 'dark' | 'solarized';
}

export const MilkdownEditor: FC<MilkdownEditorProps> = ({
  value = '# 欢迎使用 Milkdown\n\n这是一个示例段落，点击左侧可以看到菜单。\n\n## 二级标题\n\n再来一个段落。',
  theme = 'light'
}) => {
  useEditor((root) => {
    const crepe = new Crepe({
      root,
      defaultValue: value
    });
    return crepe;
  }, [theme]);

  return <Milkdown />;
};