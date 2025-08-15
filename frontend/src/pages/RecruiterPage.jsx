// src/pages/RecruiterPage.jsx
import { Link } from "react-router-dom";

export default function RecruiterPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Recruiter Interface</h1>
      <p>Here you’ll be able to post jobs and view applicants.</p>
      <button className="px-4 py-2 bg-sky-500 text-white border border-sky-500 rounded-lg hover:bg-white hover:text-sky-500 transition">
      <Link to="/SignupRecruiter">Sign up now!</Link>
      </button>
    </div>
  );
}
