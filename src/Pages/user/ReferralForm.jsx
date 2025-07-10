import React, { useState } from "react";
import { useCandidates } from "../../contexts/CandidateContext";
import { useAuth } from "../../contexts/AuthContext";
import Notification from "../../components/Notification";
import { submitReferral } from "../../api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ReferralForm = () => {
  const { loading, error, success, clearMessages } = useCandidates();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    jobTitle: "",
    resume: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    // Validate form
    if (!formData.name || !formData.email || !formData.jobTitle) {
      setFormError("Please fill in all required fields");
      return;
    }

    // Create form data object for file upload
    const formDataObj = new FormData();
    formDataObj.append("name", formData.name);
    formDataObj.append("email", formData.email);
    formDataObj.append("phone", formData.phone);
    formDataObj.append("jobTitle", formData.jobTitle);
     formDataObj.append("resume", formData.resume);
   

    setIsSubmitting(true);

    try {
      await submitReferral(formDataObj);
      toast.success("Referral submitted successfully!");
      
      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        phone: "",
        jobTitle: "",
        resume: '',
      });
      
      // Redirect to the dashboard
      navigate("/dashboard");
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to submit referral");
      toast.error("Failed to submit referral");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-2">Submit a Referral</h1>
      <p className="text-center text-gray-600 mb-6">
        Refer a candidate for open positions
      </p>

      <Notification error={formError || error} success={success} />

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Candidate Name *
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              name="name"
              placeholder="Enter candidate name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Candidate Email *
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              name="email"
              placeholder="Enter candidate email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="phone"
            >
              Candidate Phone
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="phone"
              type="tel"
              name="phone"
              placeholder="Enter candidate phone number"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="jobTitle"
            >
              Job Title *
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="jobTitle"
              type="text"
              name="jobTitle"
              placeholder="Enter job title"
              value={formData.jobTitle}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="resume"
            >
               Resume (upload the pdf on drive or any shareable platform and
                paste the link)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="resume"
              type="url"
              name="resume"
              onChange={handleInputChange}
            />
            <p className="text-gray-500 text-xs mt-1">
             Paste the Url link of your resume.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <button
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                isSubmitting || loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              type="submit"
              disabled={isSubmitting || loading}
            >
              {isSubmitting || loading ? "Submitting..." : "Submit Referral"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReferralForm;
