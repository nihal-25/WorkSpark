import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomeSplit from "./components/HomeSplit";
import JobSeekerPage from "./pages/JobSeeker/JobSeekerPage";
import RecruiterPage from "./pages/Recruiter/RecruiterPage";
import ErrorBoundary from "./components/ErrorBoundary";
import RecruiterButton from "./pages/Recruiter/RecruiterButton"
import SignupRecruiter from "./pages/Recruiter/SignupRecruiter";
import SignupJobSeeker from "./pages/JobSeeker/SignupJobSeeker"
import SignupGlobal from "./components/SignUpGlobal";
import JobseekerButton from "./pages/JobSeeker/JobSeekerButton"
import Login from "./components/LoginGlobal";
import JobseekerDashboard from "./pages/JobSeeker/jobSeekerDashboard";
import RecruiterDashboard from "./pages/Recruiter/RecruiterDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="pt-16">
          <Routes>
            <Route 
              path="/" 
              element={
                <ErrorBoundary componentName="HomeSplit">
                  <HomeSplit />
                </ErrorBoundary>
              } 
            />
            <Route 
              path="/jobseeker" 
              element={
                <ErrorBoundary componentName="JobSeekerPage">
                  <JobSeekerPage />
                </ErrorBoundary>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <ErrorBoundary componentName="SignupGlobal">
                  <SignupGlobal />
                </ErrorBoundary>
              } 
            />
            <Route 
              path="/login" 
              element={
                <ErrorBoundary componentName="Login">
                  <Login />
                </ErrorBoundary>
              } 
            />
            <Route 
              path="/recruiter_button" 
              element={
                <ErrorBoundary componentName="RecruiterButton">
                  <RecruiterButton />
                </ErrorBoundary>
              } 
            />
            <Route 
              path="/jobseeker_button" 
              element={
                <ErrorBoundary componentName="JobseekerButton">
                  <JobseekerButton />
                </ErrorBoundary>
              } 
            />
            <Route 
              path="/SignupJobSeeker" 
              element={
                <ErrorBoundary componentName="SignupJobSeeker">
                  <SignupJobSeeker />
                </ErrorBoundary>
              } 
            />
            <Route 
              path="/SignupRecruiter" 
              element={
                <ErrorBoundary componentName="SignupRecruiter">
                  <SignupRecruiter />
                </ErrorBoundary>
              } 
            />
            {/* ✅ Protected Routes */}
            <Route
              path="/jobseeker-dashboard"
              element={
              
                  <ErrorBoundary componentName="JobseekerDashboard">
                    <JobseekerDashboard />
                  </ErrorBoundary>
              }
            />

            <Route
              path="/recruiter-dashboard"
              element={
                  <ErrorBoundary componentName="RecruiterDashboard">
                    <RecruiterDashboard />
                  </ErrorBoundary>
      
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
