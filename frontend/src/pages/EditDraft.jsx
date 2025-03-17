import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingScreen from "../components/LoadingScreen";
import LetterDraft from "./LetterDraft";

const EditDraft = () => {
  const { draftId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDraft = async () => {
      try {
        // Removed token requirement
        const response = await axios.get(
          `http://localhost:8000/api/letters/drafts/${draftId}/`
        );

        setDraft(response.data);
      } catch (err) {
        console.error("Failed to fetch draft:", err);
        setError("Failed to load your draft. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDraft();
  }, [draftId, navigate]);

  if (loading) {
    return <LoadingScreen message="Loading your draft..." />;
  }

  if (error) {
    return (
      <div className="flex-grow p-8">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={() => navigate("/drafts")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Back to Drafts
          </button>
        </div>
      </div>
    );
  }

  if (draft) {
    // Pass the draft data to the LetterDraft component in edit mode
    return <LetterDraft editMode={true} draftData={draft} />;
  }

  return null;
};

export default EditDraft;
