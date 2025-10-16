const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

router.get('/', async (req, res) => {
  try {
    const { profileId } = req.query;
    const filter = profileId ? { profiles: profileId } : {};
    
    const events = await Event.find(filter)
      .populate('profiles')
      .sort({ startDateTime: 1 });
    
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('profiles');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create event
router.post('/', async (req, res) => {
  const { profiles, timezone, startDateTime, endDateTime } = req.body;

  const start = new Date(startDateTime);
  const end = new Date(endDateTime);

  if (end <= start) {
    return res.status(400).json({ 
      message: 'End date/time must be after start date/time' 
    });
  }

  const event = new Event({
    profiles,
    timezone,
    startDateTime: start,
    endDateTime: end,
    updateLogs: []
  });

  try {
    const newEvent = await event.save();
    const populatedEvent = await Event.findById(newEvent._id).populate('profiles');
    res.status(201).json(populatedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update event
router.patch('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Track changes for update log
    const changes = {};
    const oldValues = {};
    
    if (req.body.profiles && JSON.stringify(req.body.profiles) !== JSON.stringify(event.profiles)) {
      oldValues.profiles = event.profiles;
      changes.profiles = {
        from: event.profiles,
        to: req.body.profiles
      };
      event.profiles = req.body.profiles;
    }

    if (req.body.timezone && req.body.timezone !== event.timezone) {
      oldValues.timezone = event.timezone;
      changes.timezone = {
        from: event.timezone,
        to: req.body.timezone
      };
      event.timezone = req.body.timezone;
    }

    if (req.body.startDateTime) {
      const newStart = new Date(req.body.startDateTime);
      if (newStart.getTime() !== event.startDateTime.getTime()) {
        oldValues.startDateTime = event.startDateTime;
        changes.startDateTime = {
          from: event.startDateTime,
          to: newStart
        };
        event.startDateTime = newStart;
      }
    }

    if (req.body.endDateTime) {
      const newEnd = new Date(req.body.endDateTime);
      if (newEnd.getTime() !== event.endDateTime.getTime()) {
        oldValues.endDateTime = event.endDateTime;
        changes.endDateTime = {
          from: event.endDateTime,
          to: newEnd
        };
        event.endDateTime = newEnd;
      }
    }

    // Validate dates
    if (event.endDateTime <= event.startDateTime) {
      return res.status(400).json({ 
        message: 'End date/time must be after start date/time' 
      });
    }

    // Add update log 
    if (Object.keys(changes).length > 0) {
      event.updateLogs.push({
        updatedAt: new Date(),
        changes: changes
      });
    }

    event.updatedAt = new Date();
    const updatedEvent = await event.save();
    const populatedEvent = await Event.findById(updatedEvent._id).populate('profiles');
    
    res.json(populatedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.deleteOne();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
