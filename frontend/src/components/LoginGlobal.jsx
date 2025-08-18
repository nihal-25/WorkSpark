import { useState } from "react";
import API from "../pages/api";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
  const res = await API.post("/auth/login", {
    email,
    password,
  });

  const userData = res.data;

  // Save user info (localStorage or context)
  localStorage.setItem("userInfo", JSON.stringify(userData));

  // Redirect based on role
  if (userData.role === "recruiter") {
    window.location.href = "../pages/Recruiter/Recruiter";
  } else if (userData.role === "jobseeker") {
    window.location.href = "/jobseeker-dashboard";
  }

} catch (err) {
  if (err.response) {
    // Backend responded with an error
    console.error("Error response:", err.response.data);
    alert(`LOGIN failed: ${err.response.data.message || JSON.stringify(err.response.data)}`);
  } else if (err.request) {
    // Request was sent but no response
    console.error("No response from server:", err.request);
    alert("LOGIN failed: No response from server");
  } else {
    // Something else went wrong
    console.error("Error:", err.message);
    alert("LOGIN failed: " + err.message);
  }
}
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" placeholder="Email" onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} />
      <button type="submit">Login</button>
    </form>
  );
}
