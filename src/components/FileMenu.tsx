import React from 'react';
import { invoke } from '@tauri-apps/api/core';

interface FileMenuProps {
  onSave: () => void;
  onOpen: () => void;
}

const FileMenu: React.FC<FileMenuProps> = ({ onSave, onOpen }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div 
      className="file-menu" 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="menu-button">文件</button>
      {isOpen && (
        <div className="menu-dropdown">
          <button onClick={onSave}>保存</button>
          <button onClick={onOpen}>打开</button>
        </div>
      )}
    </div>
  );
};

export default FileMenu;