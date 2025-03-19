import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/scraped-events/')
      .then(response => {
        setEvents(response.data.events);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading events: {error.message}</p>;

  return (
    <div>
      <h1>Scraped Events</h1>
      <ul>
        {events.map((event, index) => (
          <li key={index}>
            <h2>{event.title}</h2>
            <img src={event.image} alt={event.title} />
            <p>{event.date}</p>
            <p>{event.location}</p>
            <a href={event.event_url}>Event Link</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
