import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LetterDraft = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const submitLetterData=async  (formData,templateType) => {
    try {
      const response = await fetch("http://localhost:5000/api/letters/generate/", 
        {
          template: templateType,
          data: formData
        },
        {
          responseType: "blob",
        }
      );
      //Create a Url for the blob
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      //Open the file in a new tab
      window.open(fileURL);
    } catch (error) {
      console.error("Failed to Generate PDF:",error);
    }
  };
  const saveDraft = async (formData, letterType) => {
    try {
      const response = await fetch("http://localhost:5000/api/letters/save/",
        {
          letter_type: letterType,
          data: formData
        },
        {
          headers:{
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      if(response.status === 201){
        alert("Draft saved successfully!");
      }
    }
    catch (error) {
      console.error("Failed to save draft:", error);
    }
  };
  // Function to handle template selection
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

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

            {/* Application Letter */}
            {/* <div className="bg-blue-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-all">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                Application Letter
              </h3>
              <p className="text-gray-600 mb-4">
                Create a professional job application letter for your dream
                position.
              </p>
              <button
                onClick={() => handleTemplateSelect("application")}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors w-full"
              >
                Get Started
              </button>
            </div> */}

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

            {/* Recommendation Letter */}
            {/* <div className="bg-purple-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-all">
              <h3 className="text-lg font-semibold text-purple-700 mb-2">
                Recommendation Request
              </h3>
              <p className="text-gray-600 mb-4">
                Create a request for a recommendation letter from professor or
                employer.
              </p>
              <button
                onClick={() => handleTemplateSelect("recommendation")}
                className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition-colors w-full"
              >
                Get Started
              </button>
            </div> */}

            {/* Leave Application */}
            <div className="bg-yellow-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-all">
              <h3 className="text-lg font-semibold text-yellow-700 mb-2">
                Leave Application
              </h3>
              <p className="text-gray-600 mb-4">
                Create a formal request for leave of absence from your studies.
              </p>
              <button
                onClick={() => handleTemplateSelect("leave")}
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

            {/* Custom Letter */}
            {/* <div className="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-all">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Custom Letter
              </h3>
              <p className="text-gray-600 mb-4">
                Create a custom letter with specific requirements.
              </p>
              <button
                onClick={() => handleTemplateSelect("custom")}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors w-full"
              >
                Get Started
              </button>
            </div> */}
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-blue-700 mb-6">
              {selectedTemplate === "application" && "Application Letter"}
              {selectedTemplate === "internship" && "Internship Request Letter"}
              {selectedTemplate === "recommendation" &&
                "Recommendation Request Letter"}
              {selectedTemplate === "leave" && "Leave Application Letter"}
              {selectedTemplate === "permission" && "Permission Letter"}
              {selectedTemplate === "custom" && "Custom Letter"}
            </h2>

            <form className="space-y-4">
              {/* Common fields for all letter types */}
              <div>
                <label className="block text-gray-700 mb-2">Your Name:</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  Recipient Name/Organization:
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              {/* Application specific fields */}
              {selectedTemplate === "application" && (
                <>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Position Applied For:
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Your Qualifications:
                    </label>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded h-32"
                      required
                    ></textarea>
                  </div>
                </>
              )}

              {/* Internship specific fields */}
              {selectedTemplate === "internship" && (
                <>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Internship Field/Department:
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Duration of Internship:
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                </>
              )}

              {/* Fields for other letter types would go here */}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default LetterDraft;
