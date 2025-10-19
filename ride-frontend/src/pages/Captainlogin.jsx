import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../context/CapatainContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Captainlogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { captain, setCaptain } = React.useContext(CaptainDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const captain = {
      email: email,
      password,
    };

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/captain/login`,
      captain
    );

    if (response.status === 200) {
      const data = response.data;

      setCaptain(data.captain);
      localStorage.setItem("token", data.token);
      navigate("/captain-home");
    }

    setEmail("");
    setPassword("");
  };
  return (
    <div className="p-7 h-screen flex flex-col justify-between bg-gradient-to-br from-orange-50 to-purple-50">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-2xl">🍔</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
            foodO
          </h1>
        </div>

        <form
          onSubmit={(e) => {
            submitHandler(e);
          }}
        >
          <h3 className="text-lg font-medium mb-2">What's your email</h3>
          <input
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="bg-white mb-7 rounded-lg px-4 py-2 border-2 border-gray-200 focus:border-orange-500 focus:outline-none w-full text-lg placeholder:text-base transition-colors"
            type="email"
            placeholder="email@example.com"
          />

          <h3 className="text-lg font-medium mb-2">Enter Password</h3>

          <div className="relative mb-7">
            <input
              className="bg-white rounded-lg px-4 py-2 pr-12 border-2 border-gray-200 focus:border-orange-500 focus:outline-none w-full text-lg placeholder:text-base transition-colors"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
              type={showPassword ? "text" : "password"}
              placeholder="password"
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

          <button className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all">
            Login
          </button>
        </form>
        <p className="text-center">
          Join a fleet?{" "}
          <Link
            to="/captain-signup"
            className="text-orange-600 font-semibold hover:text-purple-600 transition-colors"
          >
            Register as a Captain
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Captainlogin;
