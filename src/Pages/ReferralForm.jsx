import React, { useState } from "react";
import { useCandidates } from "../contexts/CandidateContext";
import { useAuth } from "../contexts/AuthContext";
import Notification from "../components/Notification";
import api from "../api/axios";
import { toast } from "react-toastify";

const ReferralForm = () => {
  const { addCandidate, loading, error, success, clearMessages } =
    useCandidates();
  const { user, token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    jobTitle: "",
    resume: "",
  });
  console.log(user);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    setIsSubmitting(true);

    try {
      if (
        !formData.name ||
        !formData.email ||
        !formData.phone ||
        !formData.jobTitle
      ) {
        toast.error("Please fill all required fields");
        return;
      }

      const referralData = new FormData();
      referralData.append("name", formData.name);
      referralData.append("email", formData.email);
      referralData.append("phone", formData.phone);
      referralData.append("jobTitle", formData.jobTitle);
      referralData.append("resume", formData.resume);

  
      const response = await api.post(
        "/api/user/referal-submit",
        referralData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Candidate referral submitted successfully!");

      await addCandidate({
        ...formData,
        userId: user?.id,
        status: "Pending",
        resume: formData.resume
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        jobTitle: "",
        resume: "",
      });

      document.getElementById("resume").value = "";
    } catch (err) {
      console.error("Error submitting form:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to submit referral";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Refer a Candidate</h1>

      <Notification error={error} success={success} />

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Candidate Information</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Candidate Name*
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                name="name"
                type="text"
                placeholder="Full Name"
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
                Email*
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                name="email"
                type="email"
                placeholder="Email Address"
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
                Phone Number*
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="phone"
                name="phone"
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="jobTitle"
              >
                Job Title*
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="jobTitle"
                name="jobTitle"
                type="text"
                placeholder="Job Title"
                value={formData.jobTitle}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-6 col-span-1 md:col-span-2">
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
                name="resume"
                type="url"
                placeholder="Paste Google Drive or Dropbox link here"
                value={formData.resume}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={isSubmitting || loading}
            >
              {isSubmitting ? "Submitting..." : "Submit Referral"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReferralForm;
