import axios from "axios";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // 👈 use AuthContext

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:5000/auth/login", {
      email,
      password,
    });

    // ✅ save token
    localStorage.setItem("token", res.data.token);

    // ✅ save user in context (your existing code)
    login(res.data.user);

    // ✅ redirect
    if (res.data.user.role === "recruiter") {
      navigate("/recruiter-dashboard");
    } else {
      navigate("/jobseeker-dashboard");
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
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
