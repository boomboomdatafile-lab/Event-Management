import React, { useEffect } from 'react';
import useStore from './store/useStore';
import Header from './components/Header';
import CreateEvent from './components/CreateEvent';
import EventsList from './components/EventsList';
import './App.css';

function App() {
  const { fetchProfiles, fetchEvents, currentProfile } = useStore();

  useEffect(() => {
    fetchProfiles();
    fetchEvents();
  }, [fetchProfiles, fetchEvents]);

  return (
    <div className="app">
      <Header />
      <div className="container">
        <div className="main-content">
          <CreateEvent />
          <EventsList />
        </div>
      </div>
    </div>
  );
}

export default App;
