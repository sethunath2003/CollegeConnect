import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingScreen from "../components/LoadingScreen";

const LetterDraft = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

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

      // Open the file in a new tab
      window.open(fileURL);
    } catch (error) {
      console.error("Failed to Generate PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = async (letterType) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/letters/drafts/save/",
        {
          letter_type: letterType,
          template_data: formData,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201) {
        alert("Draft saved successfully!");
      }
    } catch (error) {
      console.error("Failed to save draft:", error);
      alert("Failed to save draft. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle template selection
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    // Reset form data when selecting a new template
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
    return <LoadingScreen message="Generating letter..." />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Main container */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
          Letter Drafting Assistant
        </h1>

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
              {/* Common fields for all letter types */}
              <div>
                <label className="block text-gray-700 mb-2">Your Name:</label>
                <input
                  type="text"
                  name="yourName"
                  value={formData.yourName || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              {/* Common fields for each template */}
              {selectedTemplate === "internship" && (
                <>
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
                      Position:
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
                </>
              )}

              {selectedTemplate === "dutyleave" && (
                <>
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
                      Event Holder:
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
                </>
              )}

              {selectedTemplate === "permission" && (
                <>
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
              <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Back to Templates
                </button>

                <div className="space-x-4">
                  <button
                    type="button"
                    onClick={() => saveDraft(selectedTemplate)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Save Draft
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                  >
                    Generate PDF
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default LetterDraft;
