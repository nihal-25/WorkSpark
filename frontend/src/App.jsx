import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import NavbarLoggedIn from "./components/NavbarLoggedIn";
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
import AuthProvider from "./context/AuthProvider"; // ✅
import AuthContext from "./context/AuthContext"; 

export default function App() {
  
  return (
    <AuthProvider>
    <Router>
      <div className="min-h-screen bg-gray-50">
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
                  <ProtectedRoute>
                  <ErrorBoundary componentName="JobseekerDashboard">
                    <JobseekerDashboard />
                  </ErrorBoundary>
                  </ProtectedRoute>
              }
            />

            <Route
              path="/recruiter-dashboard"
              element={
                  <ProtectedRoute>
                  <ErrorBoundary componentName="RecruiterDashboard">
                    <RecruiterDashboard />
                  </ErrorBoundary>
                  </ProtectedRoute>
      
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
    </AuthProvider>
  );
}
