import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`https://workspark.onrender.com/auth/reset-password/${token}`, { newPassword });
      alert("Password reset successful! Please log in.");
      navigate("/login");
    } catch (err) {
      alert("Reset failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="mb-4 text-xl font-bold">Reset Password</h2>
      <form onSubmit={handleReset} className="flex flex-col w-64 gap-3">
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="p-2 border rounded"
        />
        <button type="submit" className="p-2 text-white bg-green-500 border rounded">
          Reset Password
        </button>
      </form>
    </div>
  );
}
