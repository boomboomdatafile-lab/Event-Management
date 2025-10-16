import React, { useState, useRef, useEffect } from 'react';
import useStore from '../store/useStore';
import { ChevronDown, Plus, User, Check } from 'lucide-react';
import AddProfileModal from './AddProfileModal';
import { getTimezoneLabel } from '../utils/timezones';
import './ProfileSelector.css';

const ProfileSelector = () => {
  const { profiles, currentProfile, setCurrentProfile } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectProfile = (profile) => {
    setCurrentProfile(profile);
    setIsOpen(false);
  };

  return (
    <>
      <div className="profile-selector" ref={dropdownRef}>
        <label className="profile-selector-label">Select current profile...</label>
        <button 
          className="profile-selector-button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="profile-selector-content">
            <User size={16} />
            <span>{currentProfile ? currentProfile.name : 'Select a profile'}</span>
          </div>
          <ChevronDown size={16} />
        </button>

        {isOpen && (
          <div className="profile-dropdown">
            <div className="profile-dropdown-header">
              <input 
                type="text" 
                placeholder="Search current profile..."
                className="profile-search"
              />
            </div>
            <div className="profile-list">
              {profiles.map(profile => (
                <button
                  key={profile._id}
                  className={`profile-item ${currentProfile?._id === profile._id ? 'active' : ''}`}
                  onClick={() => handleSelectProfile(profile)}
                >
                  <div className="profile-item-content">
                    <span className="profile-name">{profile.name}</span>
                    <span className="profile-timezone">
                      {getTimezoneLabel(profile.timezone)}
                    </span>
                  </div>
                  {currentProfile?._id === profile._id && (
                    <Check size={16} className="check-icon" />
                  )}
                </button>
              ))}
            </div>
            <button 
              className="add-profile-button"
              onClick={() => {
                setShowAddModal(true);
                setIsOpen(false);
              }}
            >
              <Plus size={16} />
              <span>Add Profile</span>
            </button>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddProfileModal onClose={() => setShowAddModal(false)} />
      )}
    </>
  );
};

export default ProfileSelector;
