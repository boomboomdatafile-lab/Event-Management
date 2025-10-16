# Event Management System

A full-stack Event Management System with multi-timezone support where admins can create multiple profiles and manage events across different users and timezones.

## Features

### ✅ Implemented Features

1. **Profile Management**
   - Create multiple user profiles with names
   - Assign timezones to each profile
   - Switch between profiles to view their events
   - Update profile timezones with automatic event conversion

2. **Event Creation**
   - Create events for one or multiple profiles simultaneously
   - Select timezone for each event
   - Choose start and end date/time with calendar and time pickers
   - Validation: End date/time cannot be before start date/time
   - All times respect the selected timezone

3. **Event Viewing & Management**
   - View all events assigned to selected profile
   - Events display in the user's selected timezone
   - Update events (profiles, timezone, dates/times)
   - Automatic timezone conversion when viewing events

4. **Event Update Logs (Bonus)**
   - Complete audit trail of all event changes
   - Shows previous vs updated values
   - Timestamps displayed in user's selected timezone
   - Automatic conversion of all logs when timezone changes

5. **Modern UI/UX**
   - Clean, intuitive interface
   - Responsive design
   - Real-time updates
   - Smooth animations and transitions

## Tech Stack

- **Frontend**: React 18.2
- **Backend**: Express.js 4.18
- **Database**: MongoDB
- **State Management**: Zustand 4.4
- **Timezone Management**: Day.js 1.11
- **Icons**: Lucide React
- **Styling**: Custom CSS

## Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- MongoDB (running locally or connection string)
- npm or yarn

## Installation & Setup

### 1. Clone the repository

```bash
cd c:/Users/dell.DESKTOP-BAQCNHG/Desktop/directory
```

### 2. Set up the Backend

```bash
cd backend
npm install
```

Create a `.env` file (already created, but verify the MongoDB connection):

```
MONGODB_URI=mongodb://localhost:27017/event-management
PORT=5000
```

### 3. Set up the Frontend

```bash
cd ../frontend
npm install
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Windows (if MongoDB is installed as a service)
net start MongoDB

# Or run mongod directly
mongod
```

### 5. Start the Backend Server

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:5000`

### 6. Start the Frontend

Open a new terminal:

```bash
cd frontend
npm start
```

The frontend will start on `http://localhost:3000`

## Usage Guide

### Creating Profiles

1. Click on the "Select current profile" dropdown in the header
2. Click "Add Profile" button
3. Enter profile name and select timezone
4. Click "Add Profile"

### Creating Events

1. In the "Create Event" section:
   - Select one or multiple profiles from the dropdown
   - Choose the timezone for the event
   - Select start date and time
   - Select end date and time (must be after start time)
2. Click "Create Event"

### Viewing Events

1. Select a profile from the header dropdown
2. All events assigned to that profile will appear in the "Events" section
3. Use the "View in Timezone" dropdown to see events in different timezones

### Editing Events

1. Click the "Edit" button on any event card
2. Modify profiles, timezone, or date/times
3. Click "Update Event"

### Viewing Update Logs

1. Click the "View Logs" button on any event card
2. See complete history of all changes made to the event
3. All timestamps are shown in your selected timezone

### Changing Profile Timezone

1. Select a profile from the header
2. Change the "View in Timezone" dropdown in the Events section
3. All events and logs automatically convert to the new timezone

## Project Structure

```
directory/
├── backend/
│   ├── models/
│   │   ├── Profile.js          # Profile schema
│   │   └── Event.js            # Event schema with update logs
│   ├── routes/
│   │   ├── profiles.js         # Profile API endpoints
│   │   └── events.js           # Event API endpoints
│   ├── .env                    # Environment variables
│   ├── server.js               # Express server setup
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js/css             # Main header with profile selector
│   │   │   ├── ProfileSelector.js/css    # Profile dropdown component
│   │   │   ├── AddProfileModal.js        # Add profile modal
│   │   │   ├── CreateEvent.js/css        # Event creation form
│   │   │   ├── EventsList.js/css         # Events list container
│   │   │   ├── EventCard.js/css          # Individual event card
│   │   │   ├── EditEventModal.js         # Edit event modal
│   │   │   ├── EventLogsModal.js         # View logs modal
│   │   │   └── Modal.css                 # Shared modal styles
│   │   ├── store/
│   │   │   └── useStore.js               # Zustand state management
│   │   ├── utils/
│   │   │   └── timezones.js              # Timezone utilities
│   │   ├── App.js                        # Main app component
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
│
└── README.md
```

## API Endpoints

### Profiles

- `GET /api/profiles` - Get all profiles
- `GET /api/profiles/:id` - Get single profile
- `POST /api/profiles` - Create new profile
- `PATCH /api/profiles/:id/timezone` - Update profile timezone

### Events

- `GET /api/events` - Get all events (optional `?profileId=` filter)
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create new event
- `PATCH /api/events/:id` - Update event (creates update log)
- `DELETE /api/events/:id` - Delete event

## Key Features Implementation

### Timezone Handling

- All dates/times are stored in UTC in MongoDB
- Day.js with timezone plugin handles conversions
- Events display in user's selected timezone
- Automatic conversion when timezone changes

### Update Logs

- Stored as embedded documents in Event model
- Captures before/after values for all changes
- Timestamps in UTC, displayed in user timezone
- Shows profile changes, timezone changes, and datetime changes

### State Management

- Zustand for lightweight, efficient state management
- Centralized API calls and state updates
- Automatic re-fetching after timezone changes

## Troubleshooting

### MongoDB Connection Issues

If you get MongoDB connection errors:

1. Check if MongoDB is running
2. Verify the `MONGODB_URI` in `.env`
3. Try: `mongodb://127.0.0.1:27017/event-management` instead of localhost

### Port Already in Use

If port 5000 or 3000 is in use:

Backend: Change `PORT` in `.env`
Frontend: It will prompt to use another port

### CORS Issues

The backend is configured to accept requests from any origin. If you still face CORS issues, check the `cors()` configuration in `server.js`.

## Future Enhancements

- User authentication and authorization
- Event notifications/reminders
- Recurring events
- Event categories and tags
- Calendar view
- Export events to iCal format
- Email notifications for event changes

## License

This project is created for educational purposes.
