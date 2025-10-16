import React, { useState } from 'react';
import { Users, Calendar, Clock, Edit2, FileText } from 'lucide-react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import EditEventModal from './EditEventModal';
import EventLogsModal from './EventLogsModal';
import { getTimezoneLabel } from '../utils/timezones';
import './EventCard.css';

dayjs.extend(utc);
dayjs.extend(timezone);

const EventCard = ({ event, viewTimezone }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);

  const formatDateTime = (dateTime) => {
    return dayjs(dateTime).tz(viewTimezone).format('MMM DD, YYYY');
  };

  const formatTime = (dateTime) => {
    return dayjs(dateTime).tz(viewTimezone).format('hh:mm A');
  };

  const formatFullDateTime = (dateTime) => {
    return dayjs(dateTime).tz(viewTimezone).format('MMM DD, YYYY at hh:mm A');
  };

  return (
    <>
      <div className="event-card">
        <div className="event-card-header">
          <div className="event-profiles">
            <Users size={16} />
            <span>{event.profiles.map(p => p.name).join(', ')}</span>
          </div>
        </div>

        <div className="event-details">
          <div className="event-detail-row">
            <Calendar size={16} />
            <div>
              <div className="event-label">Start</div>
              <div className="event-value">
                {formatDateTime(event.startDateTime)}
              </div>
            </div>
          </div>

          <div className="event-detail-row">
            <Clock size={16} />
            <div>
              <div className="event-value">
                {formatTime(event.startDateTime)}
              </div>
            </div>
          </div>

          <div className="event-detail-row">
            <Calendar size={16} />
            <div>
              <div className="event-label">End</div>
              <div className="event-value">
                {formatDateTime(event.endDateTime)}
              </div>
            </div>
          </div>

          <div className="event-detail-row">
            <Clock size={16} />
            <div>
              <div className="event-value">
                {formatTime(event.endDateTime)}
              </div>
            </div>
          </div>
        </div>

        <div className="event-meta">
          <div className="event-meta-item">
            <span className="event-meta-label">Created:</span>
            <span className="event-meta-value">
              {formatFullDateTime(event.createdAt)}
            </span>
          </div>
          <div className="event-meta-item">
            <span className="event-meta-label">Updated:</span>
            <span className="event-meta-value">
              {formatFullDateTime(event.updatedAt)}
            </span>
          </div>
        </div>

        <div className="event-actions">
          <button 
            className="btn-icon btn-edit"
            onClick={() => setShowEditModal(true)}
          >
            <Edit2 size={16} />
            Edit
          </button>
          <button 
            className="btn-icon btn-logs"
            onClick={() => setShowLogsModal(true)}
          >
            <FileText size={16} />
            View Logs
          </button>
        </div>
      </div>

      {showEditModal && (
        <EditEventModal
          event={event}
          viewTimezone={viewTimezone}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {showLogsModal && (
        <EventLogsModal
          event={event}
          viewTimezone={viewTimezone}
          onClose={() => setShowLogsModal(false)}
        />
      )}
    </>
  );
};

export default EventCard;
