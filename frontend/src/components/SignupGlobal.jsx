import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../pages/api";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    age: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/signup", formData);
      alert("✅ Signup successful! Redirecting to login...");
      console.log(res.data);
      navigate("/login");
    } catch (err) {
      if (err.response) {
        alert(
          `Signup failed: ${
            err.response.data.message || JSON.stringify(err.response.data)
          }`
        );
      } else if (err.request) {
        alert("Signup failed: No response from server");
      } else {
        alert("Signup failed: " + err.message);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen mt-10 bg-gradient-to-b from-sky-400 via-sky-200 to-white">
      {/* Signup Card */}
      <div className="w-full max-w-sm p-6 border shadow-lg rounded-2xl bg-white/90 backdrop-blur-md border-sky-100">
        <h2 className="mb-5 text-2xl font-extrabold text-center text-sky-600">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
            className="p-2.5 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder-slate-400"
          />

          <select
            name="role"
            onChange={handleChange}
            required
            className="p-2.5 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-600"
          >
            <option value="">Select Role</option>
            <option value="jobseeker">Job Seeker</option>
            <option value="recruiter">Recruiter</option>
          </select>

          <input
            type="number"
            name="age"
            placeholder="Age"
            onChange={handleChange}
            required
            className="p-2.5 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder-slate-400"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
            className="p-2.5 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder-slate-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="p-2.5 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder-slate-400"
          />

          <button
            type="submit"
            className="p-2.5 mt-2 font-semibold text-white rounded-lg shadow-md bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 transition-all"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-5 text-sm text-center text-slate-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold text-sky-600 hover:underline hover:text-sky-800"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
