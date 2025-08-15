import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomeSplit from "./components/HomeSplit";
import JobSeekerPage from "./pages/JobSeekerPage";
import RecruiterPage from "./pages/RecruiterPage";
import ErrorBoundary from "./components/ErrorBoundary";
import RecruiterButton from "./pages/RecruiterButton"
import SignupRecruiter from "./pages/SignupRecruiter";
import JobseekerButton from "./pages/JobSeekerButton"
import Login from "./pages/Login";

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
              path="/SignupRecruiter" 
              element={
                <ErrorBoundary componentName="SignupRecruiter">
                  <SignupRecruiter />
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
          </Routes>
        </div>
      </div>
    </Router>
  );
}
