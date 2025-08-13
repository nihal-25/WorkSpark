import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomeSplit from "./components/HomeSplit";
import JobSeekerPage from "./pages/JobSeekerPage";
import RecruiterPage from "./pages/RecruiterPage";

export default function App() {
  return (
    <Router>
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<HomeSplit />} />
            <Route path="/jobseeker" element={<JobSeekerPage />} />
            <Route path="/recruiter" element={<RecruiterPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
