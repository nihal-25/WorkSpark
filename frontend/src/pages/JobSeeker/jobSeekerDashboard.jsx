/** FULL OPTIMIZED JOB SEEKER DASHBOARD — DESKTOP UNCHANGED, MOBILE PERFECT **/
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api";
import { useNavigate } from "react-router-dom";

const JOB_TYPES = [
  "Software Developer", "Web Developer", "Frontend Developer", "Backend Developer",
  "Full Stack Developer", "App Developer", "Mobile Developer", "UI/UX Designer",
  "Data Scientist", "Machine Learning Engineer", "AI Engineer", "DevOps Engineer",
  "Cloud Architect", "Cybersecurity Analyst", "Database Administrator", "Network Engineer",
  "System Administrator", "Marketing Specialist", "Product Manager", "Business Analyst",
  "Graphic Designer", "Game Developer", "Content Writer", "Video Editor", "HR Manager",
  "Sales Executive", "Customer Support", "Finance Analyst", "Operations Manager", "QA Tester",
];

const WORK_MODES = ["In Office", "Remote", "Hybrid"];

export default function JobSeekerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const [filters, setFilters] = useState({
    location: "",
    workMode: "",
    jobType: "",
    minExperience: "",
    requirements: "",
  });

  const [lastJob, setLastJob] = useState(null);
  const [direction, setDirection] = useState(0);

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth <= 768
  );

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/jobs/unseen", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(res.data);
        setFilteredJobs(res.data);
        setCurrentIndex(0);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const fetchLatestExperience = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data?.experience ?? 0;
    } catch {
      return 0;
    }
  };

  const markJobAsSeen = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      await API.post(`/jobs/${jobId}/seen`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch {}
  };

  const applyJob = async (job) => {
    if (!job?._id) return false;

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const latestExp = await fetchLatestExperience();

      if (latestExp < (job.minExperience || 0)) {
        setFeedbackMsg(`❌ Need ${job.minExperience} yrs`);
        setTimeout(() => setFeedbackMsg(""), 2000);
        return false;
      }

      await API.post("/applications", { job: job._id }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFeedbackMsg("✅ Applied!");
      setTimeout(() => setFeedbackMsg(""), 1500);

      await markJobAsSeen(job._id);
      return true;

    } finally {
      setSubmitting(false);
    }
  };

  const saveJob = async (job) => {
    if (!job?._id) return false;

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const latestExp = await fetchLatestExperience();

      if (latestExp < (job.minExperience || 0)) {
        setFeedbackMsg(`❌ Need ${job.minExperience} yrs`);
        setTimeout(() => setFeedbackMsg(""), 2000);
        return false;
      }

      await API.post("/savedJobs", { job: job._id }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFeedbackMsg("📌 Saved!");
      setTimeout(() => setFeedbackMsg(""), 1500);

      await markJobAsSeen(job._id);
      return true;

    } finally {
      setSubmitting(false);
    }
  };

  const handleSwipe = async (dir) => {
    if (submitting || currentIndex >= filteredJobs.length) return;
    const job = filteredJobs[currentIndex];

    setDirection(dir);

    if (dir === 1) {
      const success = await applyJob(job);
      if (success) {
        setLastJob(job);
        setTimeout(() => setCurrentIndex(i => i + 1), 250);
      }
    } else {
      await markJobAsSeen(job._id);
      setLastJob(job);
      setTimeout(() => setCurrentIndex(i => i + 1), 250);
    }
  };

  const handleSave = async () => {
    const job = filteredJobs[currentIndex];
    const success = await saveJob(job);
    if (success) {
      setLastJob(job);
      setTimeout(() => setCurrentIndex(i => i + 1), 250);
    }
  };

  const handleGoBack = () => {
    if (!lastJob) return;
    setCurrentIndex(i => Math.max(i - 1, 0));
    setLastJob(null);
  };

  const applyFilters = () => {
    let filtered = [...jobs];

    if (filters.location)
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );

    if (filters.workMode)
      filtered = filtered.filter(job => job.workMode === filters.workMode);

    if (filters.jobType)
      filtered = filtered.filter(job => job.jobType === filters.jobType);

    if (filters.minExperience)
      filtered = filtered.filter(job =>
        job.minExperience <= Number(filters.minExperience)
      );

    if (filters.requirements) {
      const reqs = filters.requirements.split(",").map(r => r.trim().toLowerCase());
      filtered = filtered.filter(job =>
        reqs.every(r =>
          job.requirements?.some(jReq =>
            jReq.toLowerCase().includes(r)
          )
        )
      );
    }

    setFilteredJobs(filtered);
    setCurrentIndex(0);
    setShowFilter(false);
  };

  const clearFilters = () => {
    setFilters({
      location: "", jobType: "", workMode: "",
      minExperience: "", requirements: ""
    });
    setFilteredJobs(jobs);
    setShowFilter(false);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen font-semibold text-sky-700">
        Loading jobs…
      </div>
    );

  if (currentIndex >= filteredJobs.length)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-sky-700">
        <h2 className="text-xl font-bold">No more jobs 🎉</h2>
        <button
          className="px-6 py-2 text-white rounded-lg bg-sky-500"
          onClick={() => window.location.reload()}>
          🔄 Refresh
        </button>
      </div>
    );

  const job = filteredJobs[currentIndex];

  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? 120 : -120,
      opacity: 0,
      scale: 0.88
    }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0
    })
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen pt-24 pb-10 bg-gradient-to-b from-sky-200 via-white to-sky-100">

      {/* HEADER (Desktop unchanged) */}
      <div className="flex items-center justify-between w-full max-w-3xl px-6 mb-4">
        <h2 className="text-3xl font-extrabold text-sky-700">Swipe Jobs</h2>

        <button
          className="px-5 py-2 text-white rounded-lg shadow bg-sky-500 hover:bg-sky-600"
          onClick={() => setShowFilter(!showFilter)}>
          🔍 Filter
        </button>
      </div>

      {/* FILTER MODAL */}
      {showFilter && (
        <div className="absolute z-10 p-6 border shadow-xl w-80 bg-white/90 border-sky-100 rounded-2xl top-28 backdrop-blur">
          <h3 className="mb-4 text-lg font-semibold text-sky-700">Filter Jobs</h3>

          <div className="flex flex-col gap-3 text-sm">
            <input className="px-3 py-2 border rounded"
              placeholder="Location"
              value={filters.location}
              onChange={e => setFilters(f => ({ ...f, location: e.target.value }))} />

            <select className="px-3 py-2 border rounded"
              value={filters.jobType}
              onChange={e => setFilters(f => ({ ...f, jobType: e.target.value }))}>
              <option value="">All Job Types</option>
              {JOB_TYPES.map(j => <option key={j}>{j}</option>)}
            </select>

            <select className="px-3 py-2 border rounded"
              value={filters.workMode}
              onChange={e => setFilters(f => ({ ...f, workMode: e.target.value }))}>
              <option value="">All Work Modes</option>
              {WORK_MODES.map(m => <option key={m}>{m}</option>)}
            </select>

            <input
              className="px-3 py-2 border rounded"
              type="number"
              min="0"
              placeholder="Min Experience"
              value={filters.minExperience}
              onChange={e => setFilters(f => ({ ...f, minExperience: e.target.value }))} />

            <input
              className="px-3 py-2 border rounded"
              placeholder="Requirements (comma separated)"
              value={filters.requirements}
              onChange={e => setFilters(f => ({ ...f, requirements: e.target.value }))} />
          </div>

          <div className="flex justify-between mt-4">
            <button className="px-4 py-2 rounded bg-sky-100"
              onClick={clearFilters}>Clear</button>

            <button className="px-4 py-2 text-white rounded bg-sky-500"
              onClick={applyFilters}>Apply</button>
          </div>
        </div>
      )}

      {/* FEEDBACK BUBBLE */}
      {feedbackMsg && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute px-4 py-2 text-sm text-white rounded shadow top-20 bg-sky-600">
          {feedbackMsg}
        </motion.div>
      )}

      {/* MAIN SWIPE CONTAINER */}
      <div
        className="
          flex items-center justify-center mt-[-10px]
          max-md:flex-col max-md:w-full max-md:gap-0 max-md:mt-2
        "
      >

        {/* LEFT BUTTON (desktop only) */}
        <button
          onClick={() => handleSwipe(-1)}
          disabled={submitting}
          className="px-6 py-3 text-lg text-white bg-red-400 rounded-full shadow hover:bg-red-500 disabled:opacity-50 max-md:hidden"
        >
          ❌
        </button>

        {/* CARD — Auto-sized perfect mobile version */}
        <div
          className="
            relative
            w-80 h-[380px]

            max-md:w-[88%]
            max-md:h-[58vh]
            max-md:max-h-[540px]
          "
        >
          <AnimatePresence custom={direction}>
            <motion.div
              key={job._id}
              custom={direction}
              initial="enter"
              animate="center"
              exit="exit"
              variants={variants}
              transition={{
                x: { type: "spring", stiffness: 240, damping: 26 }
              }}
              drag={isMobile ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={(e, info) => {
                if (!isMobile || submitting) return;

                const offset = info.offset.x;
                const velocity = info.velocity.x;

                if (offset > 130 || velocity > 500) handleSwipe(1);
                else if (offset < -130 || velocity < -500) handleSwipe(-1);
              }}
              className="
                absolute top-0 left-0
                w-full h-full p-6
                flex flex-col
                bg-white rounded-2xl shadow-xl border border-sky-100
                overflow-y-auto
                max-md:w-full

                /* TEXT SIZE UPGRADE */
                text-sm max-md:text-base
              "
            >
              <h3 className="text-xl font-semibold max-md:text-2xl text-sky-700">
                {job.title}
              </h3>

              <p className="text-slate-600">
                {job.company} • {job.location}
              </p>

              <div className="mt-2">
                <p><strong>Type:</strong> {job.jobType}</p>
                <p><strong>Mode:</strong> {job.workMode}</p>
                <p><strong>Experience:</strong> {job.minExperience} years</p>
              </div>

              <span className="mt-2 font-medium text-sky-700">
                💰 {job.salary || "Not specified"}
              </span>

              <p className="mt-3">
                {job.description?.slice(0, 180)}
                {job.description?.length > 180 ? "…" : ""}
              </p>

              <button
                className="px-3 py-2 mt-4 text-white rounded bg-sky-500"
                onClick={() => navigate(`/jobs/${job._id}`)}>
                View Full Description
              </button>

              {job.requirements?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {job.requirements.slice(0, 5).map((req, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs rounded bg-sky-100 text-sky-700"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT BUTTON (desktop only) */}
        <button
          onClick={() => handleSwipe(1)}
          disabled={submitting}
          className="px-6 py-3 text-lg text-white bg-green-400 rounded-full shadow hover:bg-green-500 disabled:opacity-50 max-md:hidden"
        >
          ✅
        </button>

      </div>

      {/* BOTTOM BUTTONS — Always visible on mobile */}
      <div
        className="
          flex items-center justify-center gap-4 mt-4 w-80
          max-md:w-[88%] max-md:gap-3 max-md:mt-4
        "
      >
        <button
          onClick={handleGoBack}
          disabled={!lastJob || submitting}
          className="px-6 py-3 rounded-full bg-sky-200 hover:bg-sky-300 disabled:opacity-50"
        >
          🔂 Go Back
        </button>

        <button
          onClick={handleSave}
          disabled={submitting}
          className="px-6 py-3 bg-yellow-200 rounded-full hover:bg-yellow-300 disabled:opacity-50"
        >
          📌 Save
        </button>
      </div>

    </div>
  );
}
