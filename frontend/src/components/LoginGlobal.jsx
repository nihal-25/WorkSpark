import axios from "axios";
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ added Link
import AuthContext from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      // ✅ store user + token in context
      login(user, token);

      // ✅ redirect based on role
      if (user.role === "recruiter") {
        navigate("/recruiter-dashboard", { replace: true });
      } else {
        navigate("/jobseeker-dashboard", { replace: true });
      }
    } catch (err) {
      console.error("LOGIN failed:", err.response?.data || err.message);
      alert("Login failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <form onSubmit={handleLogin} className="flex flex-col w-64 gap-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>

      {/* ✅ Add Forgot Password link here */}
      <div className="mt-3">
        <Link
          to="/forgot-password"
          className="text-sm text-blue-600 hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      {/* Optional: Link to signup page */}
      <div className="mt-2 text-sm text-gray-600">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}
