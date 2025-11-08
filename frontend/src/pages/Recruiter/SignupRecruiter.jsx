//not using this currently, using signup Global ONLY, shall use this when modifications come

import { useState } from "react";
import API from "../api";

export default function SignupRecruiter() {
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
      console.log(res.data);  
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
    <h2 className="mb-4 text-xl font-bold">Recruiter Signup</h2>
    <form onSubmit={handleSubmit} className="flex flex-col w-64 gap-3">
      <input type="text" name="name" placeholder="Name" onChange={handleChange} className="p-2 border rounded"
        />
      <select name="role" onChange={handleChange} className="p-2 border rounded">
        <option value="">Select Role</option>
        <option value="recruiter">Recruiter</option>
      </select>
      <input type="number" name="age" placeholder="Age" onChange={handleChange} className="p-2 border rounded"
        />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} className="p-2 border rounded"
        />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} className="p-2 border rounded"
        />
      <button type="submit" className="p-2 border rounded">Signup</button>
    </form>
    </div>
  );
}
