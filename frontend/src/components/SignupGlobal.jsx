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
    confirmPassword: "",
  });

  const [passError, setPassError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    if (name === "password" || name === "confirmPassword") {
      if (formData.password && value !== formData.password && name === "confirmPassword") {
        setPassError("Passwords do not match");
      } else if (formData.confirmPassword && value !== formData.confirmPassword && name === "password") {
        setPassError("Passwords do not match");
      } else {
        setPassError("");
      }
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert("❌ Passwords do not match.");
    return;
  }

  try {
    // 🔥 convert email to lowercase before sending
    const payload = {
      ...formData,
      email: formData.email.toLowerCase(),
    };

    const res = await API.post("/auth/signup", payload);

    alert("✅ Signup successful! Redirecting to login...");
    navigate("/login");

  } catch (err) {
    if (err.response) {
      alert(`Signup failed: ${err.response.data.message}`);
    } else if (err.request) {
      alert("Signup failed: No response from server");
    } else {
      alert("Signup failed: " + err.message);
    }
  }
};

  return (
   <div
  className="flex items-center justify-center min-h-screen px-4 pt-24 bg-gradient-to-b from-sky-400 via-sky-200 to-white max-md:pt-20"
>
      <div
        className="w-full max-w-sm p-6 border shadow-xl bg-white/90 backdrop-blur-md border-sky-100 rounded-2xl max-md:p-5 max-md:rounded-xl"
      >
        <h2
          className="mb-5 text-2xl font-extrabold text-center text-sky-600 max-md:text-xl"
        >
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
            className="p-3 border rounded-lg border-sky-200 focus:ring-2 focus:ring-sky-400 max-md:text-base max-md:p-3"
          />

          <select
            name="role"
            onChange={handleChange}
            required
            className="p-3 border rounded-lg border-sky-200 text-slate-600 focus:ring-2 focus:ring-sky-400 max-md:text-base max-md:p-3"
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
            className="p-3 border rounded-lg border-sky-200 focus:ring-2 focus:ring-sky-400 max-md:text-base max-md:p-3"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
            className="p-3 border rounded-lg border-sky-200 focus:ring-2 focus:ring-sky-400 max-md:text-base max-md:p-3"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="p-3 border rounded-lg border-sky-200 focus:ring-2 focus:ring-sky-400 max-md:text-base max-md:p-3"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
            className="p-3 border rounded-lg border-sky-200 focus:ring-2 focus:ring-sky-400 max-md:text-base max-md:p-3"
          />

          {passError && (
            <p className="text-red-500 text-sm mt-[-4px] max-md:text-xs">
              {passError}
            </p>
          )}

          <button
            type="submit"
            disabled={passError !== ""}
            className={`
              p-3 mt-2 font-semibold text-white rounded-lg shadow-md transition-all
              max-md:text-base
              ${
                passError
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700"
              }
            `}
          >
            Sign Up
          </button>
        </form>

        <p className="mt-5 text-sm text-center text-slate-600 max-md:text-xs">
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
