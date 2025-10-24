import React from 'react';

const Header = ({ user, onLogout }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title">Home Project</h1>
        </div>
        
        <div className="header-right">
          <div className="user-info">
            <span className="user-name">Привет, {user.name}!</span>
            <button 
              className="logout-button"
              onClick={onLogout}
            >
              Выйти
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
