import React, { useState, useRef, useEffect } from 'react';
import useStore from '../store/useStore';
import { Plus, ChevronDown, X, Calendar, Clock } from 'lucide-react';
import { TIMEZONES } from '../utils/timezones';
import dayjs from 'dayjs';
import './CreateEvent.css';

const CreateEvent = () => {
  const { profiles, createEvent } = useStore();
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [timezone, setTimezone] = useState('America/New_York');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('09:00');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileToggle = (profile) => {
    setSelectedProfiles(prev => {
      const exists = prev.find(p => p._id === profile._id);
      if (exists) {
        return prev.filter(p => p._id !== profile._id);
      } else {
        return [...prev, profile];
      }
    });
  };

  const handleRemoveProfile = (profileId) => {
    setSelectedProfiles(prev => prev.filter(p => p._id !== profileId));
  };

  const filteredProfiles = profiles.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (selectedProfiles.length === 0) {
      setError('Please select at least one profile');
      return;
    }

    if (!startDate || !endDate) {
      setError('Please select start and end dates');
      return;
    }

    const startDateTime = dayjs(`${startDate} ${startTime}`);
    const endDateTime = dayjs(`${endDate} ${endTime}`);

    if (endDateTime.isBefore(startDateTime) || endDateTime.isSame(startDateTime)) {
      setError('End date/time must be after start date/time');
      return;
    }

    try {
      await createEvent({
        profiles: selectedProfiles.map(p => p._id),
        timezone,
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString()
      });

      // Reset form
      setSelectedProfiles([]);
      setStartDate('');
      setStartTime('09:00');
      setEndDate('');
      setEndTime('09:00');
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to create event');
    }
  };

  return (
    <div className="create-event-card">
      <h2>Create Event</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Profiles</label>
          <div className="profile-multi-select" ref={dropdownRef}>
            <div 
              className="profile-select-trigger"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              {selectedProfiles.length === 0 ? (
                <span className="placeholder">Select profiles...</span>
              ) : (
                <div className="selected-profiles-tags">
                  {selectedProfiles.map(profile => (
                    <span key={profile._id} className="profile-tag">
                      {profile.name}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveProfile(profile._id);
                        }}
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <ChevronDown size={16} />
            </div>

            {showProfileDropdown && (
              <div className="profile-dropdown-menu">
                <input
                  type="text"
                  placeholder="Search profiles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="profile-search-input"
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="profile-options">
                  {filteredProfiles.map(profile => (
                    <label key={profile._id} className="profile-option">
                      <input
                        type="checkbox"
                        checked={selectedProfiles.some(p => p._id === profile._id)}
                        onChange={() => handleProfileToggle(profile)}
                      />
                      <span>{profile.name}</span>
                    </label>
                  ))}
                  {filteredProfiles.length === 0 && (
                    <div className="no-profiles">No profiles found</div>
                  )}
                </div>
              </div>
            )}
          </div>
          {selectedProfiles.length > 0 && (
            <div className="profile-count">
              {selectedProfiles.length} profile{selectedProfiles.length !== 1 ? 's' : ''} selected
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Timezone</label>
          <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
            {TIMEZONES.map(tz => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Start Date & Time</label>
          <div className="datetime-input">
            <div className="date-input-wrapper">
              <Calendar size={16} />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Pick a date"
              />
            </div>
            <div className="time-input-wrapper">
              <Clock size={16} />
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>End Date & Time</label>
          <div className="datetime-input">
            <div className="date-input-wrapper">
              <Calendar size={16} />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="Pick a date"
              />
            </div>
            <div className="time-input-wrapper">
              <Clock size={16} />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="btn-create-event">
          <Plus size={18} />
          Create Event
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
