import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../context/CapatainContext";
import { FaEye, FaEyeSlash, FaExclamationTriangle } from "react-icons/fa";
import {
  RiBikeLine,
  RiMoneyDollarCircleLine,
  RiShieldCheckLine,
} from "react-icons/ri";
import { MdEmail, MdLock } from "react-icons/md";

const Captainlogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const { captain, setCaptain } = React.useContext(CaptainDataContext);
  const navigate = useNavigate();

  // Validation functions
  const validateEmail = (value) => {
    if (!value.trim()) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePassword = (value) => {
    if (!value) {
      return "Password is required";
    }
    if (value.length < 6) {
      return "Password must be at least 6 characters";
    }
    return "";
  };

  // Handle field blur
  const handleBlur = (field, value) => {
    let fieldError = "";
    if (field === "email") {
      fieldError = validateEmail(value);
    } else if (field === "password") {
      fieldError = validatePassword(value);
    }
    setErrors((prev) => ({ ...prev, [field]: fieldError }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    // Validate fields
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({
      email: emailError,
      password: passwordError,
    });

    if (emailError || passwordError) {
      return;
    }

    setLoading(true);

    try {
      const captainData = {
        email: email,
        password,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captain/login`,
        captainData
      );

      if (response.status === 200) {
        const data = response.data;

        setCaptain(data.captain);
        localStorage.setItem("token", data.token);

        setEmail("");
        setPassword("");

        navigate("/captain-home");
      }
    } catch (err) {
      console.error("Login error:", err);

      // Handle different error types
      if (err.response) {
        // Server responded with error
        const status = err.response.status;
        const message = err.response.data?.message || err.response.data?.error;

        if (status === 401) {
          setError("Invalid email or password. Please try again.");
        } else if (status === 404) {
          setError("Account not found. Please check your email or sign up.");
        } else if (status === 400) {
          setError(message || "Invalid credentials. Please check your input.");
        } else if (status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError(message || "Login failed. Please try again.");
        }
      } else if (err.request) {
        // Request made but no response
        setError("Network error. Please check your internet connection.");
      } else {
        // Something else happened
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-screen w-full overflow-hidden">
      {/* Mobile Design (default) */}
      <div className="lg:hidden h-screen flex flex-col bg-gradient-to-br from-orange-50 to-purple-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-purple-600 text-white px-5 py-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
              <i className="ri-restaurant-2-fill text-orange-500 text-3xl"></i>
            </div>
            <div>
              <h1 className="text-2xl font-black">
                food<span className="text-orange-200">O</span>
              </h1>
              <p className="text-sm text-orange-100">Captain Login</p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 overflow-y-auto px-5 py-6">
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
            className="max-w-md mx-auto"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
              <h3 className="text-base font-bold text-gray-800 mb-4">
                Login to Your Account
              </h3>

              {/* Global Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm flex items-center gap-2">
                    <FaExclamationTriangle className="text-lg text-red-500" />
                    <span>{error}</span>
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) {
                        setErrors((prev) => ({ ...prev, email: "" }));
                      }
                      if (error) setError("");
                    }}
                    onBlur={(e) => handleBlur("email", e.target.value)}
                    className={`bg-gray-50 w-full px-4 py-3 border-2 ${
                      errors.email
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200 focus:border-orange-500"
                    } rounded-lg text-gray-800 placeholder:text-gray-400 focus:bg-white focus:outline-none transition-all`}
                    type="email"
                    placeholder="captain@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <FaExclamationTriangle className="text-red-500" />{" "}
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      className={`bg-gray-50 w-full px-4 py-3 pr-12 border-2 ${
                        errors.password
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-200 focus:border-orange-500"
                      } rounded-lg text-gray-800 placeholder:text-gray-400 focus:bg-white focus:outline-none transition-all`}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) {
                          setErrors((prev) => ({ ...prev, password: "" }));
                        }
                        if (error) setError("");
                      }}
                      onBlur={(e) => handleBlur("password", e.target.value)}
                      required
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? (
                        <FaEyeSlash className="text-xl" />
                      ) : (
                        <FaEye className="text-xl" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <FaExclamationTriangle className="text-red-500" />{" "}
                      {errors.password}
                    </p>
                  )}
                </div>

                <button
                  className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-bold py-3 rounded-lg w-full text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Logging in...
                    </span>
                  ) : (
                    "Login to Dashboard"
                  )}
                </button>
              </div>
            </div>

            <p className="text-center text-sm">
              Don't have an account?{" "}
              <Link
                to="/captain-signup"
                className="text-orange-600 font-bold hover:text-purple-600 transition-colors"
              >
                Register as Captain
              </Link>
            </p>

            <div className="mt-4 text-center">
              <Link
                to="/"
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Desktop Design (large screens) */}
      <div className="hidden lg:flex h-screen w-full">
        {/* Left Side - Branding & Features */}
        <div className="w-1/2 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 flex flex-col justify-center items-center p-12 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 text-center max-w-md">
            <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-2xl">
              foodO
            </h1>
            <p className="text-xl text-white font-light mb-2 drop-shadow-lg">
              Captain Portal
            </p>
            <p className="text-sm text-orange-100 mb-8">
              Join our fleet and start earning today!
            </p>

            {/* Features */}
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 transform hover:scale-105 transition-transform">
                <div className="text-3xl">
                  <RiBikeLine />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1">
                    Flexible Schedule
                  </h3>
                  <p className="text-orange-100 text-xs">
                    Work whenever you want, wherever you are
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 transform hover:scale-105 transition-transform">
                <div className="text-3xl">
                  <RiMoneyDollarCircleLine />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1">
                    Great Earnings
                  </h3>
                  <p className="text-orange-100 text-xs">
                    Competitive rates with weekly payouts
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 transform hover:scale-105 transition-transform">
                <div className="text-3xl">
                  <RiShieldCheckLine />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1">
                    Safety First
                  </h3>
                  <p className="text-orange-100 text-xs">
                    24/7 support and insurance coverage
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-1/2 bg-white flex flex-col justify-center items-center p-8">
          <div className="max-w-md w-full">
            {/* Logo */}
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-orange-600 mb-1">foodO</h2>
              <p className="text-lg text-gray-600">Captain Login</p>
            </div>

            {/* Welcome Text */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                Welcome Back!
              </h3>
              <p className="text-sm text-gray-600">
                Sign in to continue delivering with foodO
              </p>
            </div>

            {/* Global Error Message */}
            {error && (
              <div className="mb-5 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <FaExclamationTriangle className="text-xl text-red-500" />
                  <span>{error}</span>
                </p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={submitHandler} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) {
                        setErrors((prev) => ({ ...prev, email: "" }));
                      }
                      if (error) setError("");
                    }}
                    onBlur={(e) => handleBlur("email", e.target.value)}
                    className={`bg-gray-50 w-full pl-10 pr-4 py-3 border-2 ${
                      errors.email
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200 focus:border-orange-500"
                    } rounded-lg text-gray-800 placeholder:text-gray-400 focus:bg-white focus:outline-none transition-all`}
                    type="email"
                    placeholder="captain@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FaExclamationTriangle className="text-red-500" />{" "}
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    className={`bg-gray-50 w-full pl-10 pr-12 py-3 border-2 ${
                      errors.password
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200 focus:border-orange-500"
                    } rounded-lg text-gray-800 placeholder:text-gray-400 focus:bg-white focus:outline-none transition-all`}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) {
                        setErrors((prev) => ({ ...prev, password: "" }));
                      }
                      if (error) setError("");
                    }}
                    onBlur={(e) => handleBlur("password", e.target.value)}
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-lg" />
                    ) : (
                      <FaEye className="text-lg" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FaExclamationTriangle className="text-red-500" />{" "}
                    {errors.password}
                  </p>
                )}
              </div>

              <button
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 rounded-lg w-full text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  "Login to Dashboard"
                )}
              </button>
            </form>

            {/* Signup Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/captain-signup"
                  className="text-orange-600 font-bold hover:text-orange-700 transition-colors"
                >
                  Register as Captain
                </Link>
              </p>
            </div>

            {/* Divider */}
            <div className="mt-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-xs text-gray-500">or</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Back to Home */}
            <div className="mt-4 text-center">
              <Link
                to="/"
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Captainlogin;
