import React, { useState } from "react";
import axios from "axios";
import LoadingScreen from "../components/LoadingScreen";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false); // Changed to false initially
  const [error, setError] = useState(null);
  const [scraping, setScraping] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [hasScraped, setHasScraped] = useState(false); // New state to track if scraping has been done

  const fetchEvents = async (useScraper = false) => {
    try {
      setLoading(true);
      if (useScraper) {
        setScraping(true);
      }

      // Clear any previous success messages
      setSuccessMessage("");

      // Use the scraper endpoint if requested, otherwise use the regular events endpoint
      const endpoint = useScraper
        ? "http://localhost:8000/api/events/scrape/"
        : "http://localhost:8000/api/events/events/";

      const response = await axios.get(endpoint);

      // Handle different response formats from the two endpoints
      let eventsData;
      if (useScraper && response.data.events) {
        eventsData = response.data.events;


        // Mark that we've scraped events
        setHasScraped(true);
      } else {
        eventsData = response.data.results || response.data;

        // If we're loading from regular endpoint, still mark as scraped
        if (!useScraper) {
          setHasScraped(true);
        }
      }

      // Filter events to only include those with registration_end dates in or after 2024
      const currentDate = new Date();
      const filteredEvents = eventsData.filter((event) => {
        // Keep events with no end date
        if (!event.registration_end) return true;

        // Parse the registration_end date
        const endDate = new Date(event.registration_end);

        // Check if it's a valid date and the end date is in the future or today
        return !isNaN(endDate.getTime()) && endDate >= currentDate;
      });

      setEvents(filteredEvents);
      setLoading(false);
      setScraping(false);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(
        `Failed to ${
          useScraper ? "scrape" : "load"
        } events. Please try again later.`
      );
      setLoading(false);
      setScraping(false);
    }
  };

  return (
    <div className="flex-grow p-8 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Events and Hackathons
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Stay updated with the latest events and hackathons happening around
          you.
        </p>

        <div className="flex justify-center mb-8">
          <button
            onClick={() => fetchEvents(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition-colors"
            disabled={loading}
          >
            {loading ? "Loading..." : "Get Latest Events"}
          </button>
        </div>

        {/* Display success message */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Only show the events grid if events have been scraped */}
        {hasScraped && (
          <>
            {events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event, index) => (
                  <div
                    key={index}
                    className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all ${
                      event.newly_created ? "ring-2 ring-green-500" : ""
                    }`}
                  >
                    {/* Add a "New" badge for newly created events */}
                    {event.newly_created && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold uppercase px-2 py-1 rounded">
                        New
                      </div>
                    )}

                    <div className="h-48 bg-gray-200 overflow-hidden">
                      <img
                        src={event.image || event.image_url || "/Hackathon.jpg"}
                        alt={event.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/Hackathon.jpg";
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Starts:</span>{" "}
                        {event.registration_start}
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        <span className="font-medium">Ends:</span>{" "}
                        {event.registration_end}
                      </p>
                      <div className="flex justify-end">
                        <a
                          href={event.link || event.event_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors text-sm"
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                  No events found
                </h2>
                <p className="text-gray-600">
                  Try clicking "Get Latest Events" to fetch the most recent
                  hackathons.
                </p>
              </div>
            )}
          </>
        )}

        {/* Show motivational message when no events have been scraped yet */}
        {!hasScraped && !loading && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Ready to discover hackathons?
            </h2>
            <p className="text-gray-600 mb-6">
              Click the "Get Latest Events" button above to fetch the most
              recent hackathons from around the web.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
