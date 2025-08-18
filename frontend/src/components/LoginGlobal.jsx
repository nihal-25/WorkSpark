import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });


     localStorage.setItem("user", JSON.stringify(res.data.user));

     
      // 👇 redirect based on role
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
    <form onSubmit={handleLogin} className="flex flex-col gap-3 w-64">
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
