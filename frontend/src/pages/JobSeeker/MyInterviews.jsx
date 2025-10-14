import { useEffect, useState } from "react";
import API from "../../pages/api"; // ✅ correct path for your project structure

export default function MyInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await API.get("/applications/my-interviews");
        console.log("📦 Fetched interviews:", res.data);
        setInterviews(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch interviews:", err.response?.data || err.message);
        setError("Failed to load interviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading interviews…
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        {error}
      </div>
    );

  if (interviews.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
        <h2 className="mb-2 text-2xl font-semibold">No Interviews Scheduled</h2>
        <p className="text-sm text-gray-500">
          Once a recruiter schedules an interview, it will appear here.
        </p>
      </div>
    );

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
        My Scheduled Interviews
      </h2>

      <div className="grid gap-5">
        {interviews.map((app) => (
          <div
            key={app._id}
            className="p-5 transition bg-white border rounded-lg shadow-md hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              {app.job?.title || "Untitled Job"}
            </h3>
            <p className="text-gray-600">
              {app.job?.company || "Unknown Company"} •{" "}
              {app.job?.location || "Location not specified"}
            </p>

            <div className="mt-3 text-gray-700">
              <p>
                <strong>Date & Time:</strong>{" "}
                {app.interview?.date
                  ? new Date(app.interview.date).toLocaleString()
                  : "Not specified"}
              </p>
              {app.interview?.link && (
                <p>
                  <strong>Meeting Link:</strong>{" "}
                  <a
                    href={app.interview.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Join Meeting
                  </a>
                </p>
              )}
            </div>

            <div className="mt-3 text-sm text-gray-500">
              Interview Status:{" "}
              <span
                className={
                  app.interview.status === "scheduled"
                    ? "font-medium text-green-600"
                    : "font-medium text-gray-700"
                }
              >
                {app.interview.status === "scheduled"
                  ? "Scheduled ✅"
                  : app.interview.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
