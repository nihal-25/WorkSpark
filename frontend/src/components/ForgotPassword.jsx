import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/auth/forgot-password", { email });
      alert(res.data.message);
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="mb-4 text-xl font-bold">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="flex flex-col w-64 gap-3">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-2 border rounded"
        />
        <button type="submit" className="p-2 text-white bg-blue-500 border rounded">
          Send Reset Link
        </button>
      </form>
    </div>
  );
}
