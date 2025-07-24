import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Notification from "../components/Notification";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { registerSchema } from "../ZodValidationSchema/Schema";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const navigate = useNavigate();
  const { register, loading, error: authError } = useAuth();
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset errors
    setError(null);
    setFieldErrors({});

    console.log("Validating form data:", formData);

    // Validate with Zod
    const validationResult = registerSchema.safeParse(formData);
    
    if (!validationResult.success) {
      console.log("Validation failed:", validationResult.error);
      
      const zodErrors = validationResult.error.issues; // Changed from 'errors' to 'issues'
      const formattedErrors = {};

      // Process each validation error
      zodErrors.forEach((err) => {
        const field = err.path[0];
        if (!formattedErrors[field]) {
          formattedErrors[field] = [];
        }
        formattedErrors[field].push(err.message);
      });

      console.log("Setting field errors:", formattedErrors);
      setFieldErrors(formattedErrors);
      
      // Show toast notification
      toast.error("Please fix the validation errors below");
      
      // IMPORTANT: Return early to prevent form submission
      return;
    }

    console.log("Validation passed, submitting to backend...");

    // Only submit if validation passes
    try {
      const result = await register(validationResult.data);
      if (result.success) {
        toast.success("Account created successfully!");
        navigate("/login");
      } else {
        setError(result.error);
        toast.error(result.error);
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("An error occurred during registration");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">Create an Account</h1>

        <Notification error={error} />

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline ${
                fieldErrors.name ? 'border-red-500' : ''
              }`}
            />
            {fieldErrors.name && (
              <div className="mt-1">
                {fieldErrors.name.map((msg, idx) => (
                  <p key={idx} className="text-red-500 text-sm">{msg}</p>
                ))}
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline ${
                fieldErrors.email ? 'border-red-500' : ''
              }`}
            />
            {fieldErrors.email && (
              <div className="mt-1">
                {fieldErrors.email.map((msg, idx) => (
                  <p key={idx} className="text-red-500 text-sm">{msg}</p>
                ))}
              </div>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline ${
                fieldErrors.password ? 'border-red-500' : ''
              }`}
            />
            {fieldErrors.password && (
              <div className="mt-1">
                {fieldErrors.password.map((msg, idx) => (
                  <p key={idx} className="text-red-500 text-sm">{msg}</p>
                ))}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline ${
                fieldErrors.confirmPassword ? 'border-red-500' : ''
              }`}
            />
            {fieldErrors.confirmPassword && (
              <div className="mt-1">
                {fieldErrors.confirmPassword.map((msg, idx) => (
                  <p key={idx} className="text-red-500 text-sm">{msg}</p>
                ))}
              </div>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Role</label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={formData.role === "user"}
                  onChange={handleChange}
                  className="form-radio h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">User</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={formData.role === "admin"}
                  onChange={handleChange}
                  className="form-radio h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Admin</span>
              </label>
            </div>
            {fieldErrors.role && (
              <div className="mt-1">
                {fieldErrors.role.map((msg, idx) => (
                  <p key={idx} className="text-red-500 text-sm">{msg}</p>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between mt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-gray-600">
              Already have an account?
              <Link to="/login" className="text-blue-500 hover:text-blue-700 ml-1">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;