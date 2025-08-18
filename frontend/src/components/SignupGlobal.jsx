import { useState } from "react";
import API from "../pages/api";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    role: "",    // recruiter or jobseeker
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
      alert("Signup successful!");
      console.log(res.data);  // you’ll see saved user or token
    } catch (err) {
  if (err.response) {
    // Backend responded with an error
    console.error("Error response:", err.response.data);
    alert(`Signup failed: ${err.response.data.message || JSON.stringify(err.response.data)}`);
  } else if (err.request) {
    // Request was sent but no response
    console.error("No response from server:", err.request);
    alert("Signup failed: No response from server");
  } else {
    // Something else went wrong
    console.error("Error:", err.message);
    alert("Signup failed: " + err.message);
  }
}
  };

  return (
     <div className="flex flex-col items-center mt-10">
    <h2 className="text-xl font-bold mb-4">Recruiter Signup</h2>
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-64">
      <input type="text" name="name" placeholder="Name" onChange={handleChange} className="border p-2 rounded"
        />
      <select name="role" onChange={handleChange} className="border p-2 rounded">
        <option value="">Select Role</option>
        <option value="jobseeker">Job Seeker</option>
        <option value="recruiter">Recruiter</option>
      </select>
      <input type="number" name="age" placeholder="Age" onChange={handleChange} className="border p-2 rounded"
        />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} className="border p-2 rounded"
        />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} className="border p-2 rounded"
        />
      <button type="submit" className="border p-2 rounded">Signup</button>
    </form>
    </div>
  );
}
