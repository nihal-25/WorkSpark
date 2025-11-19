import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function HomeRedirect() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return; // ⛔ wait for AuthProvider

    if (!user) {
      navigate("/home", { replace: true });
    } else if (user.role === "jobseeker") {
      navigate("/jobseeker-dashboard", { replace: true });
    } else if (user.role === "recruiter") {
      navigate("/recruiter-dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  return null;
}
