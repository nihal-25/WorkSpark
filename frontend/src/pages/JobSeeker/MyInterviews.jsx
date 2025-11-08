import { useEffect, useState } from "react";
import API from "../../pages/api"; 

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
  <div className="min-h-screen px-6 pt-24 bg-gradient-to-b from-sky-200 via-white to-sky-100">
    <div className="max-w-4xl mx-auto">

      <h2 className="mb-8 text-3xl font-extrabold text-center text-sky-700">
        My Scheduled Interviews 🎙️
      </h2>

      <div className="grid gap-6">
        {interviews.map((app) => (
          <div
            key={app._id}
            className="p-6 transition-all border shadow-lg bg-white/90 backdrop-blur-md border-sky-100 rounded-2xl hover:shadow-2xl"
          >
            {/* Job Title + Company */}
            <h3 className="text-xl font-semibold text-sky-700">
              {app.job?.title || "Job Title"}
            </h3>
            <p className="mt-1 text-slate-600">
              {app.job?.company || "Company"} • {app.job?.location || "Location"}
            </p>

            {/* Date + Link */}
            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <p>
                <strong className="text-sky-700">📅 Date & Time:</strong>{" "}
                {app.interview?.date
                  ? new Date(app.interview.date).toLocaleString()
                  : "Not scheduled"}
              </p>

              {app.interview?.link && (
                <p>
                  <strong className="text-sky-700">🔗 Meeting Link:</strong>{" "}
                  <a
                    href={app.interview.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline transition text-sky-600 hover:text-sky-800"
                  >
                    Join Interview
                  </a>
                </p>
              )}
            </div>

            {/* Status Tag */}
            <div className="mt-5">
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  app.interview?.status === "scheduled"
                    ? "bg-green-100 text-green-700"
                    : app.interview?.status === "completed"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {app.interview?.status === "scheduled"
                  ? "Scheduled ✅"
                  : app.interview?.status === "completed"
                  ? "Completed 🎉"
                  : app.interview?.status || "Pending"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {interviews.length === 0 && (
        <div className="mt-10 text-lg text-center text-slate-600">
          No interviews yet — once a recruiter schedules one, it will show here.
        </div>
      )}
    </div>
  </div>
);

}
