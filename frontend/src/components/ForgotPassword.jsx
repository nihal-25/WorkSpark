import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://workspark.onrender.com/auth/forgot-password", { email });
      alert(res.data.message);
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen pt-24 bg-gradient-to-b from-sky-400 via-sky-200 to-white">
      <div className="w-full max-w-sm p-6 border shadow-lg rounded-2xl bg-white/90 backdrop-blur-md border-sky-100">
        
        <h2 className="mb-5 text-2xl font-extrabold text-center text-sky-600">
          Forgot Password 🔐
        </h2>
        <p className="mb-6 text-sm text-center text-slate-600">
          Enter your registered email to receive a reset link.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-2.5 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder-slate-400"
          />

          <button
            type="submit"
            className="p-2.5 mt-2 font-semibold text-white rounded-lg shadow-md bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 transition-all"
          >
            Send Reset Link
          </button>
        </form>

      </div>
    </div>
  );
}
