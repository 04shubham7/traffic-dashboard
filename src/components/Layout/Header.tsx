import React from 'react';
import './Header.css';

interface HeaderProps {
  currentTime: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentTime, activeTab, onTabChange }) => {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <div className="logo-icon">🚦</div>
          <h1>Traffic Command Center</h1>
        </div>
        <div className="status-indicator">
          <span className="status-dot status-online"></span>
          <span>System Online</span>
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
