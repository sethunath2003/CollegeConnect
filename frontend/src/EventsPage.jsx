import { useEffect, useState } from "react";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = () => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/events/") // Update the backend URL if necessary
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4 text-lg font-bold">
        <span>COLLEGE CONNECT</span>
        <span className="float-right text-yellow-300">Username</span>
      </nav>

      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold text-center">Events and Hackathons</h2>
        <p className="text-center text-gray-600 mb-6">
          Stay updated with the latest events and hackathons happening around you.
        </p>

        {/* Find Events Button */}
        <div className="text-center mb-6">
          <button
            onClick={fetchEvents}
            className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-700"
          >
            Find Events and Hackathons
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-center text-gray-500">Loading events...</p>
          ) : events.length > 0 ? (
            events.map((event, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-xl font-bold">{event.title}</h3>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  {event.button_text}
                </a>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No events found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

