import React, { useState, useEffect } from 'react';
import './Header.css';

interface HeaderProps {
  currentTime: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentTime, activeTab, onTabChange }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    setIsAnimating(true);
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Reset animation state
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <div className="logo-icon">🚦</div>
          <h1>Traffic Command Center</h1>
        </div>
        <div 
          className="status-indicator"
          role="status"
          aria-label="System status indicator"
          tabIndex={0}
        >
          <span 
            className="status-dot status-online"
            aria-hidden="true"
          ></span>
          <span 
            className="status-text"
            role="text"
            aria-live="polite"
          >
            System Online
          </span>
        </div>
      </div>
      
      <div className="header-center">
        <nav className="nav-tabs">
          {['Live Operations', 'Incidents', 'Optimization', 'Analytics', 'Assets'].map(tab => (
            <button 
              key={tab}
              className={`nav-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => onTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="header-right">
        <button 
          className={`theme-toggle ${isAnimating ? 'animating' : ''}`}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <div className="theme-toggle-track">
            <div className="theme-toggle-thumb">
              <span className="theme-icon">
                {theme === 'dark' ? '🌙' : '☀️'}
              </span>
            </div>
          </div>
        </button>
        
        <div className="time-display">
          <span className="time">{currentTime}</span>
          <span className="date">Live Data</span>
        </div>
        
        <div className="user-profile">
          <div className="avatar">OP</div>
          <span>Operator</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
