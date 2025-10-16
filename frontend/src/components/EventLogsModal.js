import React from 'react';
import { X, Clock } from 'lucide-react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { getTimezoneLabel } from '../utils/timezones';
import './Modal.css';

dayjs.extend(utc);
dayjs.extend(timezone);

const EventLogsModal = ({ event, viewTimezone, onClose }) => {
  const formatDateTime = (dateTime) => {
    return dayjs(dateTime).tz(viewTimezone).format('MMM DD, YYYY at hh:mm A');
  };

  const formatChangeValue = (value) => {
    if (value instanceof Date || typeof value === 'string') {
      // Try to parse as date
      const parsed = dayjs(value);
      if (parsed.isValid()) {
        return formatDateTime(value);
      }
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return String(value);
  };

  const getChangeLabel = (key) => {
    const labels = {
      profiles: 'Profiles',
      timezone: 'Timezone',
      startDateTime: 'Start Date & Time',
      endDateTime: 'End Date & Time'
    };
    return labels[key] || key;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-medium" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Event Update History</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="logs-container">
          {!event.updateLogs || event.updateLogs.length === 0 ? (
            <div className="no-logs">
              <Clock size={48} className="no-logs-icon" />
              <p>No update history yet</p>
            </div>
          ) : (
            <div className="logs-list">
              {event.updateLogs.map((log, index) => (
                <div key={index} className="log-entry">
                  <div className="log-header">
                    <Clock size={16} />
                    <span className="log-time">
                      {formatDateTime(log.updatedAt)}
                    </span>
                  </div>
                  <div className="log-changes">
                    {Object.entries(log.changes).map(([key, change]) => (
                      <div key={key} className="log-change">
                        <div className="log-change-label">
                          {getChangeLabel(key)}:
                        </div>
                        <div className="log-change-values">
                          <div className="log-change-from">
                            <span className="change-label">From:</span>
                            <span className="change-value">
                              {key === 'timezone' 
                                ? getTimezoneLabel(change.from)
                                : formatChangeValue(change.from)
                              }
                            </span>
                          </div>
                          <div className="log-change-to">
                            <span className="change-label">To:</span>
                            <span className="change-value">
                              {key === 'timezone'
                                ? getTimezoneLabel(change.to)
                                : formatChangeValue(change.to)
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventLogsModal;
