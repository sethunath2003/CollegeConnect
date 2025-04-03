import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingScreen from "../../components/LoadingScreen";

const ViewDrafts = () => {
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // Fetch drafts on component mount
  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        // Get authentication token directly
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view drafts");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:8000/api/letters/drafts/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setDrafts(response.data);
      } catch (err) {
        console.error("Failed to fetch drafts:", err);
        if (err.response?.status === 401) {
          setError("Authentication error. Please log in again.");
        } else {
          setError("Failed to load drafts. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDrafts();
  }, [navigate]);

  // Function to edit a draft
  const editDraft = (draftId) => {
    navigate(`/edit-draft/${draftId}`);
  };

  // Function to delete a draft
  const deleteDraft = async (draftId) => {
    try {
      setLoading(true);

      await axios.delete(
        `http://localhost:8000/api/letters/drafts/${draftId}/`
      );

      // Remove the deleted draft from the state
      setDrafts(drafts.filter((draft) => draft.id !== draftId));
      setDeleteSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => setDeleteSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to delete draft:", err);
      setError("Failed to delete draft. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading your drafts..." />;
  }

  return (
    <div className="flex-grow p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">My Saved Drafts</h1>
          <button
            onClick={() => navigate("/letter-drafting")}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Create New Letter
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {deleteSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Draft deleted successfully!
          </div>
        )}

        {drafts.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p className="text-xl">You don't have any saved drafts yet.</p>
            <p className="mt-2">
              Start creating letters and save them as drafts to access them
              later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-700">
                      {draft.letter_type === "internship" &&
                        "Internship Request"}
                      {draft.letter_type === "application" &&
                        "Application Letter"}
                      {draft.letter_type === "recommendation" &&
                        "Recommendation Request"}
                      {draft.letter_type === "dutyleave" &&
                        "Duty Leave Application"}
                      {draft.letter_type === "permission" &&
                        "Permission Letter"}
                      {draft.letter_type === "custom" && "Custom Letter"}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Created: {new Date(draft.created_at).toLocaleString()}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Updated: {new Date(draft.updated_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => editDraft(draft.id)}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this draft?"
                          )
                        ) {
                          deleteDraft(draft.id);
                        }
                      }}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <h4 className="font-medium text-gray-700 mb-1">
                    Draft Details:
                  </h4>
                  {draft.template_data.yourName && (
                    <p className="text-gray-600 text-sm">
                      <span className="font-medium">Name:</span>{" "}
                      {draft.template_data.yourName}
                    </p>
                  )}
                  {draft.template_data.Date && (
                    <p className="text-gray-600 text-sm">
                      <span className="font-medium">Date:</span>{" "}
                      {draft.template_data.Date}
                    </p>
                  )}
                  {draft.template_data.companyName && (
                    <p className="text-gray-600 text-sm">
                      <span className="font-medium">Company:</span>{" "}
                      {draft.template_data.companyName}
                    </p>
                  )}
                  {draft.template_data.eventName && (
                    <p className="text-gray-600 text-sm">
                      <span className="font-medium">Event:</span>{" "}
                      {draft.template_data.eventName}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewDrafts;
