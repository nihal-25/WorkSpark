import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import NavbarLoggedIn from "./components/NavbarLoggedIn";
import HomeSplit from "./components/HomeSplit";
import JobSeekerPage from "./pages/JobSeeker/JobSeekerPage";
import RecruiterPage from "./pages/Recruiter/RecruiterPage";
import ErrorBoundary from "./components/ErrorBoundary";
import RecruiterButton from "./pages/Recruiter/RecruiterButton"
import SignupRecruiter from "./pages/Recruiter/SignupRecruiter";
import ManageJobs from "./pages/Recruiter/ManageJobs";
import SignupJobSeeker from "./pages/JobSeeker/SignupJobSeeker"
import SignupGlobal from "./components/SignUpGlobal";
import JobseekerButton from "./pages/JobSeeker/JobSeekerButton"
import Login from "./components/LoginGlobal";
import JobseekerDashboard from "./pages/JobSeeker/jobSeekerDashboard";
import RecruiterDashboard from "./pages/Recruiter/RecruiterDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthProvider from "./context/AuthProvider"; // ✅
import AuthContext from "./context/AuthContext"; 
import MyApplications from "./pages/JobSeeker/MyApplications";
import SavedJobs from "./pages/JobSeeker/SavedJobs";
import JobForm from "./pages/Recruiter/JobsForm";
import ProfilePage from "./pages/JobSeeker/profile";
import JobDetails from "./pages/JobSeeker/JobDetails";
import SavedApplicants from "./pages/Recruiter/SavedApplicants";
import AcceptedApplicants from "./pages/Recruiter/AcceptedApplicants";
import MyInterviews from "./pages/JobSeeker/MyInterviews";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

export default function App() {
  
  return (
    <AuthProvider>
    <Router>
      <div className="min-h-screen bg-gray-50">
         <Navbar />
        <div>
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
            path="/forgot-password" 
            element={
              <ErrorBoundary componentName="ForgotPassword">
               <ForgotPassword />
                </ErrorBoundary>
               }
                />
                
                 <Route 
            path="/reset-password/:token" 
            element={
              <ErrorBoundary componentName="ResetPassword">
               <ResetPassword />
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
  path="/jobs/:id"
  element={
    <ProtectedRoute>
      <ErrorBoundary componentName="JobDetails">
        <JobDetails />
      </ErrorBoundary>
    </ProtectedRoute>
  }
/>
            <Route 
              path="/MyApplications" 
              element={
                <ProtectedRoute>
                <ErrorBoundary componentName="MyApplications">
                  <MyApplications />
                </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            <Route
             path="/my-interviews"
              element={
              <ProtectedRoute>
              <ErrorBoundary componentName="MyInterviews">
              <MyInterviews />
              </ErrorBoundary>
            </ProtectedRoute>
  }
/>
             <Route 
              path="/jobseeker-profile" 
              element={
                <ProtectedRoute>
                <ErrorBoundary componentName="ProfilePage">
                  < ProfilePage/>
                </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/SavedJobs" 
              element={
                <ProtectedRoute>
                <ErrorBoundary componentName="SavedJobs">
                  <SavedJobs />
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

            <Route
              path="/saved-applicants"
              element={
                  <ProtectedRoute>
                  <ErrorBoundary componentName="SavedApplicants">
                    <SavedApplicants />
                  </ErrorBoundary>
                  </ProtectedRoute>
              }
            />
            <Route
              path="/accepted-applicants"
              element={
                  <ProtectedRoute>
                  <ErrorBoundary componentName="AcceptedApplicants">
                    <AcceptedApplicants />
                  </ErrorBoundary>
                  </ProtectedRoute>
              }
            />
            <Route
              path="/manage-jobs"
              element={
                  <ProtectedRoute>
                  <ErrorBoundary componentName="ManageJobs">
                    <ManageJobs />
                  </ErrorBoundary>
                  </ProtectedRoute>

      
              }
            />
            <Route 
              path="/JobForm" 
              element={
                <ProtectedRoute>
                <ErrorBoundary componentName="JobForm">
                  <JobForm />
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
