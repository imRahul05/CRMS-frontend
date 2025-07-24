import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Notification from "../components/Notification";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { loginSchema } from "../ZodValidationSchema/Schema";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login, loading, error: authError } = useAuth();

  useEffect(() => {
    const registrationSuccess = localStorage.getItem("registrationSuccess");
    if (registrationSuccess) {
      toast.success(registrationSuccess);
      localStorage.removeItem("registrationSuccess");
    }

    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
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

    console.log("Validating login data:", formData);

    // Zod validation
    const validationResult = loginSchema.safeParse(formData);

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
     // toast.error("Please fix the validation errors below");
      
      // Return early to prevent form submission
      return;
    }

    console.log("Validation passed, attempting login...");

    try {
      const response = await login(formData.email, formData.password);
      if (response.success) {
        toast.success("Login successful!");
        const user = JSON.parse(localStorage.getItem("user"));

        if (user?.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(response.error);
        toast.error(response.error);
      }
    } catch (err) {
      const errorMessage = err.message || "Login failed";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const loginAsAdmin = () => {
    setFormData({ email: "admin@gmail.com", password: "admin@gmail.com" });
    // Clear any existing errors when using guest login
    setFieldErrors({});
    setError(null);
  };

  const loginAsUser = () => {
    setFormData({ email: "newUser@gmail.com", password: "qwerty@123" });
    // Clear any existing errors when using guest login
    setFieldErrors({});
    setError(null);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

        <Notification error={error} />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
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

          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
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

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="flex justify-between mb-4">
            <button
              type="button"
              onClick={loginAsAdmin}
              className="bg-purple-600 hover:bg-purple-800 text-white font-semibold px-4 py-2 rounded"
            >
              Guest Login as Admin
            </button>
            <button
              type="button"
              onClick={loginAsUser}
              className="bg-green-600 hover:bg-green-800 text-white font-semibold px-4 py-2 rounded"
            >
              Guest Login as User
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-gray-600">
              Don't have an account?
              <Link
                to="/register"
                className="text-blue-500 hover:text-blue-700 ml-1"
              >
                Register
              </Link>
            </p>
            <p className="text-gray-600 text-center my-4">
              Forgot Password?
              <Link
                to="/reset-password"
                className="text-blue-500 hover:text-blue-700 ml-1"
              >
                Click Here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;