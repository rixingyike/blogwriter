import React from 'react';

interface ThemeMenuProps {
  onThemeChange: (theme: 'light' | 'dark' | 'solarized') => void;
}

const ThemeMenu: React.FC<ThemeMenuProps> = ({ onThemeChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div 
      className="theme-menu" 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="menu-button">主题</button>
      {isOpen && (
        <div className="menu-dropdown">
          <button onClick={() => onThemeChange('light')}>浅色</button>
          <button onClick={() => onThemeChange('dark')}>深色</button>
          <button onClick={() => onThemeChange('solarized')}>Solarized</button>
        </div>
      )}
    </div>
  );
};

export default ThemeMenu;