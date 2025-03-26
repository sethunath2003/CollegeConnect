import { useEffect, useState } from "react";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/events/") // Update with your backend URL
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
          <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold text-center">Events and Hackathons</h2>
        <p className="text-center text-gray-600 mb-6">
          Stay updated with the latest events and hackathons happening around you.
        </p>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-center text-gray-500">Loading events...</p>
          ) : events.length > 0 ? (
            events.map((event, index) => (
              <div key={index} className="bg-white shadow-lg rounded-lg p-4">
                <img
                  src={event.image_url} // Ensure backend provides image_url
                  alt={event.title}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h3 className="text-xl font-bold">{event.title}</h3>
                <p className="text-gray-600">
                  <strong>Registration Start:</strong> {event.registration_start}
                </p>
                <p className="text-gray-600">
                  <strong>Registration End:</strong> {event.registration_end}
                </p>
                <p
                  className={`mt-2 text-sm font-semibold ${
                    event.registration_closed ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {event.registration_closed ? "Registration Closed ❌" : "Register Now ✅"}
                </p>
                {!event.registration_closed && (
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-blue-500 text-white px-4 py-2 mt-4 rounded-md text-center hover:bg-blue-700"
                  >
                    Register Now
                  </a>
                )}
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

