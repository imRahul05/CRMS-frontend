import React, { useState } from "react";
import { useCandidates } from "../../contexts/CandidateContext";
import { useAuth } from "../../contexts/AuthContext";
import Notification from "../../components/Notification";
import { submitReferral } from "../../api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ReferralForm = () => {
  const { loading, error, success } = useCandidates();
  const navigate = useNavigate();
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    jobTitle: "",
    resume: "",
  });

    const jobTitles = [
    "Frontend Developer",
    "Backend Developer",
    "Fullstack Developer",
    "UI/UX Designer",
    "Product Manager",
    "QA Engineer",
  ];

  const experienceOptions = [ 
    "Fresher", "1", "2", "3", "4+"
  ];

  const inputFields = [
    { label: "Candidate Name *", name: "name", type: "text", placeholder: "Enter candidate name", required: true },
    { label: "Candidate Email *", name: "email", type: "email", placeholder: "Enter candidate email", required: true },
    { label: "Candidate Phone", name: "phone", type: "tel", placeholder: "Enter candidate phone number" },
    // { label: "Job Title *", name: "jobTitle", type: "text", placeholder: "Enter job title", required: true },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name || !formData.email || !formData.jobTitle) {
      setFormError("Please fill in all required fields");
      return;
    }

    const formDataObj = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataObj.append(key, value);
    });

    setIsSubmitting(true);

    try {
      await submitReferral(formDataObj);
      toast.success("Referral submitted successfully!");
      setFormData({ name: "", email: "", phone: "", jobTitle: "", resume: "" });
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
      <p className="text-center text-gray-600 mb-6">Refer a candidate for open positions</p>

      <Notification error={formError || error} success={success} />

     <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-xl mx-auto w-full">

        <form onSubmit={handleSubmit}>
          {inputFields.map((field) => (
            <div className="mb-4" key={field.name}>
              <label
                htmlFor={field.name}
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                {field.label}
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id={field.name}
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleInputChange}
                required={field.required}
              />
            </div>
          ))}

              {/* 🆕 Job Title Dropdown */}
          <div className="mb-4">
            <label htmlFor="jobTitle" className="block text-gray-700 text-sm font-bold mb-2">
              Job Title *
            </label>
            <select
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              required
              className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            >
              <option value="">Select job title</option>
              {jobTitles.map((title) => (
                <option key={title} value={title}>{title}</option>
              ))}
            </select>
          </div>

             {/* 🆕 Experience Dropdown */}
          <div className="mb-4">
            <label htmlFor="experience" className="block text-gray-700 text-sm font-bold mb-2">
              Experience
            </label>
            <select
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            >
              <option value="">Select experience</option>
              {experienceOptions.map((exp) => (
                <option key={exp} value={exp}>{exp}</option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label
              htmlFor="resume"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Resume (
              <a
                href="https://hello.cv/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                hello.cv
              </a>
              , upload the PDF on Drive or any shareable platform and paste the link)
            </label>
            <input
              type="url"
              id="resume"
              name="resume"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Paste shareable resume link"
              value={formData.resume}
              onChange={handleInputChange}
            />
            <p className="text-gray-500 text-xs mt-1">Paste the Url link of your resume.</p>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                isSubmitting || loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
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
