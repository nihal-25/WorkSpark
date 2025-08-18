import { useState } from "react";
import axios from "axios";

export default function SignupGlobal() {
  const [form, setForm] = useState({ name: "",age: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/users", form);
      alert("Recruiter signed up successfully!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Signup failed,Try again!");
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-xl font-bold mb-4">Recruiter Signup</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-64">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 rounded"
        />
         <input 
          type="number" 
          placeholder="Age (18+)" 
          value={form.age} 
          onChange={(e) => setForm({ ...form, age: e.target.value })} 
          className="border p-2 rounded" 
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border p-2 rounded"
        />
        
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Signup
        </button>
      </form>
    </div>
  );
}
