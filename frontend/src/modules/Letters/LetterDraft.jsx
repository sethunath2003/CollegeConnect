import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const LetterDraft = () => {
  const navigate = useNavigate();
  const { draftId } = useParams();

  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedDraftId, setSavedDraftId] = useState(null);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [pdfData, setPdfData] = useState(null);
  const [alertMessage, setAlertMessage] = useState({ type: "", message: "" });

  // Fetch templates from backend
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/letters/templates/"
        );
        setTemplates(response.data);
      } catch (error) {
        console.error("Failed to fetch templates:", error);
        setError("Failed to load letter templates. Please try again later.");
      }
    };

    fetchTemplates();
  }, []);

  // Fetch draft if draftId is provided
  useEffect(() => {
    if (draftId) {
      setLoading(true);

      const fetchDraft = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/letters/drafts/${draftId}/`
          );

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

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found, user not logged in");
          return;
        }

        // Make API call with proper authorization
        const response = await axios.get(
          "http://localhost:8000/api/accounts/profile/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Profile data received:", response.data);

        // Pre-fill form data with user information
        setFormData((prevData) => ({
          ...prevData,
          yourName: response.data.full_name || response.data.username || "",
          yourEmail: response.data.email || "",
          yourDepartment: response.data.department || "",
          yourDegree: response.data.degree_program || "",
          yourSemester: response.data.semester || "",
        }));
      } catch (error) {
        console.error("Error loading user profile data:", error);

        // Try to get basic info from localStorage as fallback
        try {
          const userDataString = localStorage.getItem("user");
          if (userDataString) {
            const userData = JSON.parse(userDataString);
            setFormData((prevData) => ({
              ...prevData,
              yourName: userData.username || "",
              yourEmail: userData.email || "",
            }));
          }
        } catch (e) {
          console.error("Error loading from localStorage:", e);
        }
      }
    };

    // Only load user data when a template is selected
    if (selectedTemplate) {
      loadUserData();
    }
  }, [selectedTemplate]); // Re-run when template changes

  // Handle template selection
  const handleTemplateSelect = (templateType) => {
    setSelectedTemplate(templateType);

    // Reset form data first to avoid data from previous templates
    setFormData({});

    // User data will be loaded by the useEffect when selectedTemplate changes
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Validate form data against template schema
  const validateForm = () => {
    const template = getSelectedTemplateData();
    if (!template || !template.validation_schema) return true;

    // Use a library like Ajv to validate against the JSON schema
    // This is just pseudocode
    const isValid = validateAgainstSchema(formData, template.validation_schema);
    if (!isValid) {
      showAlert("error", "Please check your form fields for errors.");
      return false;
    }
    return true;
  };

  // Handle form submission to generate PDF
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      submitLetterData(selectedTemplate);
    }
  };

  // Function to submit letter data and generate PDF
  const submitLetterData = async (templateType) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/letters/generate/",
        {
          template: templateType,
          data: formData,
        },
        { responseType: "blob" }
      );

      // Create URL for the blob response
      const blob = new Blob([response.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(blob);

      // Set PDF data and show success notification
      setPdfData(pdfUrl);
      setPdfSuccess(true);
      setLoading(false);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      showAlert("error", "Failed to generate PDF. Please try again.");
      setLoading(false);
    }
  };

  // Function to save draft
  const saveDraft = async (templateType) => {
    setLoading(true);
    try {
      let response;
      const draftData = {
        letter_type: templateType,
        template_data: formData,
      };

      if (savedDraftId) {
        // Update existing draft
        response = await axios.put(
          `http://localhost:8000/api/letters/drafts/${savedDraftId}/`,
          draftData
        );
      } else {
        // Create new draft
        response = await axios.post(
          "http://localhost:8000/api/letters/drafts/save/",
          draftData
        );
        setSavedDraftId(response.data.id);
      }

      showAlert("success", "Draft saved successfully!");
    } catch (error) {
      console.error("Failed to save draft:", error);
      showAlert("error", "Failed to save draft. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to show alert message
  const showAlert = (type, message) => {
    setAlertMessage({ type, message });
    setTimeout(() => {
      setAlertMessage({ type: "", message: "" });
    }, 5000);
  };

  // Function to go back to templates
  const handleBack = () => {
    setSelectedTemplate(null);
    setFormData({});
    setSavedDraftId(null);
  };

  // Functions to handle PDF actions
  const downloadPDF = () => {
    if (pdfData) {
      const link = document.createElement("a");
      link.href = pdfData;
      link.download = `${selectedTemplate}_letter.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const viewPDF = () => {
    if (pdfData) {
      window.open(pdfData, "_blank");
    }
  };

  // Get template data for the selected template
  const getSelectedTemplateData = () => {
    return templates.find((t) => t.template_type === selectedTemplate);
  };

  // Render dynamic form fields based on template structure
  const renderFormFields = () => {
    const template = getSelectedTemplateData();
    if (!template || !template.form_structure) return null;

    // Form structure is an object with fields property
    if (template.form_structure.fields) {
      return (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-blue-700 mb-3">
            Template Fields
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {template.form_structure.fields
              .filter((field) => {
                // Skip fields already in the "Your Information" section
                const commonFields = [
                  "yourName",
                  "yourEmail",
                  "yourDegree",
                  "yourDepartment",
                  "yourSemester",
                ];
                return !commonFields.includes(field.name);
              })
              .map((field, fieldIndex) => (
                <div key={fieldIndex}>
                  <label className="block text-gray-700 mb-2">
                    {field.label}:
                  </label>
                  {renderFieldByType(field)}
                </div>
              ))}
          </div>
        </div>
      );
    }

    return null;
  };

  // Helper function to render the correct input type
  const renderFieldByType = (field) => {
    switch (field.type) {
      case "textarea":
        return (
          <textarea
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded h-32"
            required={field.required}
          ></textarea>
        );
      case "date":
        return (
          <input
            type="date"
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            required={field.required}
          />
        );
      case "time":
        return (
          <input
            type="time"
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            required={field.required}
          />
        );
      default:
        return (
          <input
            type={field.type}
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            required={field.required}
          />
        );
    }
  };

  const renderUserInfoSection = () => {
    const template = getSelectedTemplateData();
    if (!template || !template.form_structure) return null;

    // Common user information fields
    const commonFields = [
      "yourName",
      "yourEmail",
      "yourDegree",
      "yourDepartment",
      "yourSemester",
    ];

    // Filter the fields to only include common fields
    const userInfoFields = template.form_structure.fields.filter((field) =>
      commonFields.includes(field.name)
    );

    return (
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-blue-700 mb-3">
          Your Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userInfoFields.map((field, index) => (
            <div key={index}>
              <label className="block text-gray-700 mb-2">{field.label}:</label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required={field.required}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-grow p-8">
      {/* Alert message component */}
      {alertMessage.message && (
        <div
          className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-lg ${
            alertMessage.type === "success"
              ? "bg-green-100 border-green-500 text-green-700"
              : "bg-red-100 border-red-500 text-red-700"
          } border-l-4 p-4 rounded shadow-md`}
        >
          <div className="flex items-center">
            <div className="py-1 mr-3">
              {alertMessage.type === "success" ? (
                <svg
                  className="h-6 w-6 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </div>
            <div>
              <p className="font-bold">
                {alertMessage.type === "success" ? "Success!" : "Error!"}
              </p>
              <p className="text-sm">{alertMessage.message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
          Letter Drafting Assistant
        </h1>

        {/* Display error message if any */}
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

        {/* Template selection view */}
        {!selectedTemplate ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <h2 className="text-xl font-semibold text-gray-700 col-span-full mb-4">
              Select Letter Type:
            </h2>

            {/* Render template cards dynamically from fetched templates */}
            {templates.map((template, index) => {
              // Apply color class safely
              const getColorClass = (type, shade) => {
                const safeColorClass = template.color_class || "blue";
                return `${type}-${safeColorClass}-${shade}`;
              };

              // Get proper hover class
              const bgClass = getColorClass("bg", "500");
              const hoverBgClass = getColorClass("bg", "600");

              return (
                <div
                  key={index}
                  className={`${getColorClass(
                    "bg",
                    "50"
                  )} rounded-lg p-6 shadow-md hover:shadow-lg transition-all`}
                >
                  <h3
                    className={`text-lg font-semibold ${getColorClass(
                      "text",
                      "700"
                    )} mb-2`}
                  >
                    {template.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{template.description}</p>
                  <button
                    onClick={() => handleTemplateSelect(template.template_type)}
                    className={`${bgClass} hover:${hoverBgClass} text-white py-2 px-4 rounded transition-colors w-full`}
                  >
                    Get Started
                  </button>
                </div>
              );
            })}

            {/* Saved drafts card */}
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
              {getSelectedTemplateData()?.name || "Letter Template"}
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Dynamic user information section */}
              {renderUserInfoSection()}

              {/* Dynamic form fields from the backend */}
              {renderFormFields()}

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

      {/* PDF success notification */}
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
