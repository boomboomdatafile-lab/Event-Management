import React, { useState, useRef, useEffect } from 'react';
import useStore from '../store/useStore';
import { X, Calendar, Clock, ChevronDown } from 'lucide-react';
import { TIMEZONES } from '../utils/timezones';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import './Modal.css';

dayjs.extend(utc);
dayjs.extend(timezone);

const EditEventModal = ({ event, viewTimezone, onClose }) => {
  const { profiles, updateEvent } = useStore();
  const [selectedProfiles, setSelectedProfiles] = useState(
    event.profiles.map(p => p._id)
  );
  const [eventTimezone, setEventTimezone] = useState(event.timezone);
  const [startDate, setStartDate] = useState(
    dayjs(event.startDateTime).tz(viewTimezone).format('YYYY-MM-DD')
  );
  const [startTime, setStartTime] = useState(
    dayjs(event.startDateTime).tz(viewTimezone).format('HH:mm')
  );
  const [endDate, setEndDate] = useState(
    dayjs(event.endDateTime).tz(viewTimezone).format('YYYY-MM-DD')
  );
  const [endTime, setEndTime] = useState(
    dayjs(event.endDateTime).tz(viewTimezone).format('HH:mm')
  );
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
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

  const handleProfileToggle = (profileId) => {
    setSelectedProfiles(prev => {
      if (prev.includes(profileId)) {
        return prev.filter(id => id !== profileId);
      } else {
        return [...prev, profileId];
      }
    });
  };

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

    // Create datetime in the view timezone, then convert to UTC
    const startDateTime = dayjs.tz(`${startDate} ${startTime}`, viewTimezone);
    const endDateTime = dayjs.tz(`${endDate} ${endTime}`, viewTimezone);

    if (endDateTime.isBefore(startDateTime) || endDateTime.isSame(startDateTime)) {
      setError('End date/time must be after start date/time');
      return;
    }

    try {
      await updateEvent(event._id, {
        profiles: selectedProfiles,
        timezone: eventTimezone,
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString()
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update event');
    }
  };

  const selectedProfilesData = profiles.filter(p => 
    selectedProfiles.includes(p._id)
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-medium" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Event</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Profiles</label>
            <div className="profile-multi-select" ref={dropdownRef}>
              <div 
                className="profile-select-trigger"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                <span>
                  {selectedProfilesData.length} profile{selectedProfilesData.length !== 1 ? 's' : ''} selected
                </span>
                <ChevronDown size={16} />
              </div>

              {showProfileDropdown && (
                <div className="profile-dropdown-menu">
                  <div className="profile-options">
                    {profiles.map(profile => (
                      <label key={profile._id} className="profile-option">
                        <input
                          type="checkbox"
                          checked={selectedProfiles.includes(profile._id)}
                          onChange={() => handleProfileToggle(profile._id)}
                        />
                        <span>{profile.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Timezone</label>
            <select value={eventTimezone} onChange={(e) => setEventTimezone(e.target.value)}>
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

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Update Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;
