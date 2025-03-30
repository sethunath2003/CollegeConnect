import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingScreen from "../../components/LoadingScreen";

// Add this function to get the authentication token
const getAuthToken = () => {
  // Get token directly from localStorage
  const token = localStorage.getItem("token");
  if (!token) return null;

  return token;
};

const LetterDraft = () => {
  const { draftId } = useParams();
  const navigate = useNavigate();
  const [savedDraftId, setSavedDraftId] = useState(draftId || null);
  const [loading, setLoading] = useState(draftId ? true : false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [generatedPDF, setGeneratedPDF] = useState({
    url: null,
    filename: null,
  });
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ type: '', message: '' }); // Add this state

  // Function to show alert message
  const showAlert = (type, message) => {
    setAlertMessage({ type, message });
    // Auto-hide the alert after 5 seconds
    setTimeout(() => {
      setAlertMessage({ type: '', message: '' });
    }, 5000);
  };

  // Add this at the beginning of the component
  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (!userData) {
      setError("You must be logged in to create or edit drafts");
    }
  }, []);

  // Effect to fetch draft data when editing an existing draft
  useEffect(() => {
    // If we have a draftId from URL, fetch that draft
    if (draftId) {
      const fetchDraft = async () => {
        try {
          setLoading(true);
          const response = await axios.get(
            `http://localhost:8000/api/letters/drafts/${draftId}/`
          );

          // Set the template and form data
          setSelectedTemplate(response.data.letter_type);
          setFormData(response.data.template_data);
          setSavedDraftId(response.data.id);
        } catch (err) {
          console.error("Failed to fetch draft:", err);
          setError("Failed to load your draft. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      fetchDraft();
    }
  }, [draftId]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Submit letter data to generate PDF
  const submitLetterData = async (templateType) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/letters/generate/",
        {
          template: templateType,
          data: formData,
        },
        {
          responseType: "blob",
        }
      );

      // Create a URL for the blob
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);

      // Store the file URL for download
      setGeneratedPDF({
        url: fileURL,
        filename: `${templateType}_letter.pdf`,
      });

      // Show success message
      setPdfSuccess(true);
      // Show alert at the top
      showAlert('success', 'PDF generated successfully! You can download or view it now.');
    } catch (error) {
      console.error("Failed to Generate PDF:", error);
      showAlert('error', 'Failed to generate PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add function to download the PDF
  const downloadPDF = () => {
    if (!generatedPDF.url) return;

    // Create an anchor element and set properties
    const link = document.createElement("a");
    link.href = generatedPDF.url;
    link.download = generatedPDF.filename;

    // Append to document, click and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to view the PDF in a new tab
  const viewPDF = () => {
    if (generatedPDF.url) {
      window.open(generatedPDF.url);
    }
  };

  // Update the saveDraft function
  const saveDraft = async (letterType) => {
    setLoading(true);
    setError(null);
    setSaveSuccess(false);

    try {
      // Determine endpoint based on whether we're updating or creating
      const endpoint = savedDraftId
        ? `http://localhost:8000/api/letters/drafts/${savedDraftId}/`
        : "http://localhost:8000/api/letters/drafts/save/";

      const method = savedDraftId ? "put" : "post";
      const token = getAuthToken();

      if (!token) {
        setError("You must be logged in to save drafts");
        setLoading(false);
        return;
      }

      // Include authorization header with token
      const response = await axios[method](
        endpoint,
        {
          letter_type: letterType,
          template_data: formData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        // If this was a new draft, store the ID for future updates
        if (response.data.id) {
          setSavedDraftId(response.data.id);
        }

        setSaveSuccess(true);
        // Show success alert at the top
        showAlert('success', 'Draft saved successfully! You can access it later from "My Saved Drafts"');
        
        // Reset success state after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Failed to save draft:", error);

      if (error.response?.status === 401) {
        showAlert('error', 'Authentication error. Please log in again.');
      } else if (error.response?.data?.error) {
        showAlert('error', `Failed to save draft: ${error.response.data.error}`);
      } else {
        showAlert('error', 'Failed to save draft. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to handle template selection
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    // Initialize with empty form data
    setFormData({});
  };

  // Go back to template selection
  const handleBack = () => {
    setSelectedTemplate(null);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    submitLetterData(selectedTemplate);
  };

  if (loading) {
    return (
      <LoadingScreen
        message={
          draftId ? "Loading your draft..." : "Processing your request..."
        }
      />
    );
  }

  if (error && draftId) {
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

  return (
    <div className="flex-grow p-8">
      {/* Alert message at the top */}
      {alertMessage.message && (
        <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-lg ${
          alertMessage.type === 'success' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700'
        } border-l-4 p-4 rounded shadow-md`}>
          <div className="flex items-center">
            <div className="py-1 mr-3">
              {alertMessage.type === 'success' ? (
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <div>
              <p className="font-bold">{alertMessage.type === 'success' ? 'Success!' : 'Error!'}</p>
              <p className="text-sm">{alertMessage.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main container */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
          Letter Drafting Assistant
        </h1>

        {/* Error display */}
        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded"
            role="alert"
          >
            <p className="font-bold">Error</p>
            <p>{error}</p>
            {error.includes("logged in") && (
              <button
                onClick={() => navigate("/login")}
                className="mt-2 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition-colors"
              >
                Go to Login
              </button>
            )}
          </div>
        )}

        {/* Letter options container */}
        {!selectedTemplate ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <h2 className="text-xl font-semibold text-gray-700 col-span-full mb-4">
              Select Letter Type:
            </h2>

            {/* Internship Letter */}
            <div className="bg-green-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-all">
              <h3 className="text-lg font-semibold text-green-700 mb-2">
                Internship Request
              </h3>
              <p className="text-gray-600 mb-4">
                Draft a compelling internship request to gain valuable
                experience.
              </p>
              <button
                onClick={() => handleTemplateSelect("internship")}
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors w-full"
              >
                Get Started
              </button>
            </div>

            {/* Leave Application */}
            <div className="bg-yellow-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-all">
              <h3 className="text-lg font-semibold text-yellow-700 mb-2">
                Leave Application
              </h3>
              <p className="text-gray-600 mb-4">
                Create a formal request for leave of absence from your studies.
              </p>
              <button
                onClick={() => handleTemplateSelect("dutyleave")}
                className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition-colors w-full"
              >
                Get Started
              </button>
            </div>

            {/* Permission Letter */}
            <div className="bg-red-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-all">
              <h3 className="text-lg font-semibold text-red-700 mb-2">
                Permission Letter
              </h3>
              <p className="text-gray-600 mb-4">
                Request permission for special circumstances or events.
              </p>
              <button
                onClick={() => handleTemplateSelect("permission")}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors w-full"
              >
                Get Started
              </button>
            </div>

            {/* Add this button at the end */}
            <div className="bg-blue-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-all">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                My Saved Drafts
              </h3>
              <p className="text-gray-600 mb-4">
                View and edit your previously saved letter drafts.
              </p>
              <button
                onClick={() => navigate("/drafts")}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors w-full"
              >
                View Drafts
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-blue-700 mb-6">
              {selectedTemplate === "application" && "Application Letter"}
              {selectedTemplate === "internship" && "Internship Request Letter"}
              {selectedTemplate === "recommendation" &&
                "Recommendation Request Letter"}
              {selectedTemplate === "dutyleave" &&
                "Duty Leave Application Letter"}
              {selectedTemplate === "permission" && "Permission Letter"}
              {selectedTemplate === "custom" && "Custom Letter"}
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* User profile information - no longer pre-filled */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-medium text-blue-700 mb-3">
                  Your Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Your Name:
                    </label>
                    <input
                      type="text"
                      name="yourName"
                      value={formData.yourName || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Your Email:
                    </label>
                    <input
                      type="email"
                      name="yourEmail"
                      value={formData.yourEmail || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Your Semester:
                    </label>
                    <input
                      type="text"
                      name="yourSemester"
                      value={formData.yourSemester || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Your Department:
                    </label>
                    <input
                      type="text"
                      name="yourDepartment"
                      value={formData.yourDepartment || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Your Degree:
                    </label>
                    <input
                      type="text"
                      name="yourDegree"
                      value={formData.yourDegree || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Template specific fields */}
              {selectedTemplate === "internship" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-blue-700 mb-2">
                    Internship Details
                  </h3>

                  <div>
                    <label className="block text-gray-700 mb-2">Date:</label>
                    <input
                      type="date"
                      name="Date"
                      value={formData.Date || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Company Name:
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Position/Role:
                    </label>
                    <input
                      type="text"
                      name="Position"
                      value={formData.Position || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Start Date:
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      End Date:
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                </div>
              )}

              {selectedTemplate === "dutyleave" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-blue-700 mb-2">
                    Duty Leave Details
                  </h3>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Letter Date:
                    </label>
                    <input
                      type="date"
                      name="Date"
                      value={formData.Date || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Event Name:
                    </label>
                    <input
                      type="text"
                      name="eventName"
                      value={formData.eventName || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                      placeholder="e.g. Technical Workshop, Conference, Competition"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Event Organizer/Holder:
                    </label>
                    <input
                      type="text"
                      name="eventHolder"
                      value={formData.eventHolder || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                      placeholder="e.g. IEEE, Institution Name, Department"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Event Date:
                    </label>
                    <input
                      type="date"
                      name="eventDate"
                      value={formData.eventDate || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Start Time:
                      </label>
                      <input
                        type="time"
                        name="startTime"
                        value={formData.startTime || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">
                        End Time:
                      </label>
                      <input
                        type="time"
                        name="endTime"
                        value={formData.endTime || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Event Venue:
                    </label>
                    <input
                      type="text"
                      name="eventVenue"
                      value={formData.eventVenue || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Event Date:
                    </label>
                    <input
                      type="date"
                      name="eventDate"
                      value={formData.eventDate || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Event Description:
                    </label>
                    <textarea
                      name="eventDescription"
                      value={formData.eventDescription || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded h-32"
                      required
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Your Roll Number:
                    </label>
                    <input
                      type="text"
                      name="yourRollno"
                      value={formData.yourRollno || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Student Details (other students if applicable):
                    </label>
                    <textarea
                      name="studentDetails"
                      value={formData.studentDetails || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Name (Roll No, Department)"
                    ></textarea>
                  </div>
                </div>
              )}

              {selectedTemplate === "permission" && (
                <>
                  <div>
                    <label className="block text-gray-700 mb-2">Date:</label>
                    <input
                      type="date"
                      name="Date"
                      value={formData.Date || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Event Name:
                    </label>
                    <input
                      type="text"
                      name="eventName"
                      value={formData.eventName || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Event Organizer:
                    </label>
                    <input
                      type="text"
                      name="eventHolder"
                      value={formData.eventHolder || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Event Venue:
                    </label>
                    <input
                      type="text"
                      name="eventVenue"
                      value={formData.eventVenue || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Event Date:
                    </label>
                    <input
                      type="date"
                      name="eventDate"
                      value={formData.eventDate || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Event Description:
                    </label>
                    <textarea
                      name="eventDescription"
                      value={formData.eventDescription || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded h-32"
                      required
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Your Roll Number:
                    </label>
                    <input
                      type="text"
                      name="yourRollno"
                      value={formData.yourRollno || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Student Details (other students if applicable):
                    </label>
                    <textarea
                      name="studentDetails"
                      value={formData.studentDetails || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Name (Roll No, Department)"
                    ></textarea>
                  </div>
                </>
              )}

              {/* Action buttons */}
            <div className="flex flex-wrap gap-4 mt-8 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors w-auto"
              >
                Back to Templates
              </button>

              <div className="flex-grow"></div>

              <button
                type="button"
                onClick={() => saveDraft(selectedTemplate)}
                className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Draft"}
              </button>

              <button
                type="submit"
                className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate PDF"}
              </button>
            </div>
            </form>
          </div>
        )}
      </div>
      
      {/* PDF Success buttons for download and view */}
      {pdfSuccess && (
        <div className="fixed bottom-8 right-8 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-10">
          <h4 className="text-lg font-medium text-green-700 mb-3">
            Your PDF is ready
          </h4>
          <div className="space-y-2">
            <button
              onClick={downloadPDF}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Download PDF
            </button>
            <button
              onClick={viewPDF}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
              View PDF
            </button>
            <button
              onClick={() => setPdfSuccess(false)}
              className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LetterDraft;