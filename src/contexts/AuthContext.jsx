import React, { createContext, useContext, useReducer, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
const AuthContext = createContext();

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "AUTH_START":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "AUTH_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
      };
    case "AUTH_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "REGISTER_SUCCESS":
      return {
        ...state,
        loading: false,
        error: null,
      };
    case "LOGOUT":
      return {
        ...initialState,
        loading: false,
      };

    case "PASSWORD_RESET_START":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "PASSWORD_RESET_SUCCESS":
      return {
        ...state,
        loading: false,
        error: null,
      };

    case "PASSWORD_RESET_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      if (!user.id) {
        user.id = user._id || String(Date.now());
      }

      if (!user.role) {
        user.role = "user";
      }

      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user, token },
      });
    } else {
      dispatch({ type: "AUTH_FAILURE", payload: null });
    }
  }, []);

  const login = async (email, password) => {
    dispatch({ type: "AUTH_START" });

    try {
      const response = await api.post("/api/user/login", { email, password });
      const { user, token } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user, token },
      });

      // When a user successfully logs in, we'll try to refresh the candidates data
      try {
        const candidateContext = await import("./CandidateContext");
        const refreshCandidates =
          candidateContext.useCandidates().refreshCandidates;
        if (refreshCandidates) refreshCandidates();
      } catch (err) {
        console.error("Failed to refresh candidates after login:", err);
      }

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";

      dispatch({
        type: "AUTH_FAILURE",
        payload: errorMessage,
      });

      return { success: false, error: errorMessage };
    }
  };
 const clearError=()=>{
    dispatch({type:"CLEAR_ERROR"})
  }
  const register = async (userData) => {
    dispatch({ type: "AUTH_START" });
    try {
      const response = await api.post("/api/user/signup", userData);
      dispatch({ type: "REGISTER_SUCCESS" });
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Registration failed";
      dispatch({
        type: "AUTH_FAILURE",
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
    toast.success("Logged out successfully!");
  };
  const updateProfile = async (userData) => {
    dispatch({ type: "AUTH_START" });

    try {
      const response = await api.put("/users/profile", userData);
      const updatedUser = response.data;

      localStorage.setItem("user", JSON.stringify(updatedUser));

      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user: updatedUser, token: state.token },
      });

      return { success: true };
    } catch (error) {
      dispatch({
        type: "AUTH_FAILURE",
        payload: error.response?.data?.message || "Profile update failed",
      });

      return {
        success: false,
        error: error.response?.data?.message || "Profile update failed",
      };
    }
  };

  const requestPasswordReset = async (email) => {
    dispatch({ type: "PASSWORD_RESET_START" });
    try {
      const response = await api.post("/api/user/reset-password", { email });
      dispatch({ type: "PASSWORD_RESET_SUCCESS" });
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to send reset email";
      dispatch({ type: "PASSWORD_RESET_FAILURE", payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const changePassword = async (newPassword, token) => {
    dispatch({ type: "AUTH_START" });
    try {
      const response = await api.post(
        `/api/user/request-password-change?token=${token}`,
        {
          newPassword,
        }
      );

      dispatch({ type: "PASSWORD_RESET_SUCCESS" });
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to change password";
      dispatch({ type: "AUTH_FAILURE", payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };


  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    clearError,
    requestPasswordReset,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
