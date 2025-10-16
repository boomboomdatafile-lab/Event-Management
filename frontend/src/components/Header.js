import React, { useState } from 'react';
import useStore from '../store/useStore';
import ProfileSelector from './ProfileSelector';
import './Header.css';

const Header = () => {
  const { currentProfile } = useStore();

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1>Event Management</h1>
          <p className="subtitle">Create and manage events across multiple timezones</p>
        </div>
        <div className="header-right">
          <ProfileSelector />
        </div>
      </div>
    </header>
  );
};

export default Header;
