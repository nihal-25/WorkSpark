import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function HomeRedirect() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    // If NOT logged in → landing page
    if (!user) {
      navigate("/home", { replace: true });
      return;
    }

    // ⭐ NEW FIX — Respect first login
    if (user.isFirstLogin) {
      if (user.role === "jobseeker") {
        navigate("/jobseeker-profile", { replace: true });
      } else {
        navigate("/JobForm", { replace: true });
      }
      return;
    }

    // ⭐ Normal redirects
    if (user.role === "jobseeker") {
      navigate("/jobseeker-dashboard", { replace: true });
    } else {
      navigate("/recruiter-dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  return null;
}
