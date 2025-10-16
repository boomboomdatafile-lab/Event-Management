import React, { useState } from 'react';
import useStore from '../store/useStore';
import { X } from 'lucide-react';
import { TIMEZONES } from '../utils/timezones';
import './Modal.css';

const AddProfileModal = ({ onClose }) => {
  const { createProfile } = useStore();
  const [name, setName] = useState('');
  const [timezone, setTimezone] = useState('America/New_York');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Profile name is required');
      return;
    }

    try {
      await createProfile(name.trim(), timezone);
      onClose();
    } catch (err) {
      setError('Failed to create profile');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Profile</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Profile Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter profile name"
              autoFocus
            />
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

          {error && <div className="error-message">{error}</div>}

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProfileModal;
