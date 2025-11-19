import axios from "axios";
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import API from "../pages/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Clean inputs
    const cleanedEmail = email.trim().toLowerCase();
    const cleanedPassword = password.trim();

    try {
      const res = await API.post("/auth/login", {
        email: cleanedEmail,
        password: cleanedPassword,
      });

      // Use server response directly
      const { token, user } = res.data;

      // store in auth context
      login(user, token);

      // Use the exact flag returned by server (guarantees correct first-login behavior)
      const isFirstLoginFromServer = res.data.user?.isFirstLogin === true;


      // Redirect logic (unchanged behavior but using server-provided flag)
      if (user.role === "recruiter") {
        if (isFirstLoginFromServer) {
          navigate("/JobForm", { replace: true });
        } else {
          navigate("/recruiter-dashboard", { replace: true });
        }
      } else {
        if (isFirstLoginFromServer) {
          navigate("/jobseeker-profile", { replace: true });
        } else {
          navigate("/jobseeker-dashboard", { replace: true });
        }
      }
    } catch (err) {
      console.error("LOGIN failed:", err.response?.data || err.message);
      alert("Login failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 pt-24 bg-gradient-to-b from-sky-400 via-sky-200 to-white max-md:pt-20">
      {/* Login Card */}
      <div className="w-full max-w-sm p-6 border shadow-lg rounded-2xl bg-white/90 backdrop-blur-md border-sky-100 max-md:p-5 max-md:rounded-xl">
        <h2 className="mb-5 text-2xl font-extrabold text-center text-sky-600 max-md:text-xl">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="
              p-2.5 border border-sky-200 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-sky-400 
              placeholder-slate-400
              max-md:p-3 max-md:text-base
            "
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="
              p-2.5 border border-sky-200 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-sky-400 
              placeholder-slate-400
              max-md:p-3 max-md:text-base
            "
          />

          <button
            type="submit"
            className="
              p-2.5 mt-2 font-semibold text-white rounded-lg shadow-md 
              bg-gradient-to-r from-sky-500 to-sky-600 
              hover:from-sky-600 hover:to-sky-700 
              transition-all
              max-md:p-3 max-md:text-base
            "
          >
            Log In
          </button>
        </form>

        {/* Forgot Password */}
        <div className="mt-4 text-center">
          <Link to="/forgot-password" className="text-sm text-sky-600 hover:underline hover:text-sky-800 max-md:text-xs">
            Forgot Password?
          </Link>
        </div>

        {/* Signup Redirect */}
        <p className="mt-4 text-sm text-center text-slate-600 max-md:text-xs">
          Don’t have an account?{" "}
          <Link to="/signup" className="font-semibold text-sky-600 hover:underline hover:text-sky-800">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
