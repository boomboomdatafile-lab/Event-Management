import React, { useState } from 'react';
import useStore from '../store/useStore';
import EventCard from './EventCard';
import { TIMEZONES, getTimezoneLabel } from '../utils/timezones';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import './EventsList.css';

dayjs.extend(utc);
dayjs.extend(timezone);

const EventsList = () => {
  const { events, currentProfile, updateProfileTimezone } = useStore();
  const [viewTimezone, setViewTimezone] = useState('America/New_York');

  // Filter events based on current profile
  const filteredEvents = currentProfile
    ? events.filter(event => 
        event.profiles.some(p => p._id === currentProfile._id)
      )
    : [];

  // Get the effective timezone (current profile's timezone or view timezone)
  const effectiveTimezone = currentProfile?.timezone || viewTimezone;

  const handleTimezoneChange = async (newTimezone) => {
    if (currentProfile) {
      try {
        await updateProfileTimezone(currentProfile._id, newTimezone);
      } catch (error) {
        console.error('Failed to update timezone:', error);
      }
    } else {
      setViewTimezone(newTimezone);
    }
  };

  return (
    <div className="events-list-card">
      <div className="events-list-header">
        <h2>Events</h2>
      </div>

      <div className="timezone-selector">
        <label>View in Timezone</label>
        <select 
          value={effectiveTimezone} 
          onChange={(e) => handleTimezoneChange(e.target.value)}
        >
          {TIMEZONES.map(tz => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
      </div>

      <div className="events-list">
        {filteredEvents.length === 0 ? (
          <div className="no-events">
            <p>No events found</p>
            {!currentProfile && (
              <span>Select a profile to view their events</span>
            )}
          </div>
        ) : (
          filteredEvents.map(event => (
            <EventCard 
              key={event._id} 
              event={event} 
              viewTimezone={effectiveTimezone}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default EventsList;
