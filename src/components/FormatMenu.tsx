import React from 'react';

interface FormatMenuProps {
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onCode: () => void;
  onStrikethrough: () => void;
  onHighlight: () => void;
  onComment: () => void;
  onLink: () => void;
  onOpenLink: () => void;
  onCopyLink: () => void;
  onImage: () => void;
  onClearFormat: () => void;
}

const FormatMenu: React.FC<FormatMenuProps> = ({
  onBold,
  onItalic,
  onUnderline,
  onCode,
  onStrikethrough,
  onHighlight,
  onComment,
  onLink,
  onOpenLink,
  onCopyLink,
  onImage,
  onClearFormat,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div 
      className="format-menu" 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="menu-button">格式</button>
      {isOpen && (
        <div className="menu-dropdown">
          <button onClick={onBold}>加粗</button>
          <button onClick={onItalic}>斜体</button>
          <button onClick={onUnderline}>下划线</button>
          <button onClick={onCode}>代码</button>
          <hr />
          <button onClick={onStrikethrough}>删除线</button>
          <button onClick={onHighlight}>高亮</button>
          <button onClick={onComment}>注释</button>
          <hr />
          <button onClick={onLink}>超链接</button>
          <div className="link-actions">
            <button onClick={onOpenLink}>打开链接</button>
            <button onClick={onCopyLink}>复制链接地址</button>
          </div>
          <button onClick={onImage}>图像</button>
          <button onClick={onClearFormat}>清除样式</button>
        </div>
      )}
    </div>
  );
};

export default FormatMenu;