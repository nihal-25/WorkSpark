import dotenv from "dotenv";
import mongoose from "mongoose";
import Job from "../models/Job.js";

dotenv.config();

const jobs = [
  {
    title: "Frontend Developer (React)",
    company: "PixelWorks",
    location: "Bengaluru, India",
    description:
      "Build modern UIs using React, Tailwind, and Vite. Work with designers and backend teams.",
    requirements: ["React", "JavaScript", "Tailwind", "REST APIs"],
    salary: "₹10–18 LPA",
  },
  {
    title: "Backend Engineer (Node.js)",
    company: "DataForge",
    location: "Remote",
    description:
      "Design and develop scalable APIs with Node.js and MongoDB. Experience with auth and caching.",
    requirements: ["Node.js", "MongoDB", "Express", "Redis"],
    salary: "₹15–25 LPA",
  },
  {
    title: "Full Stack Developer",
    company: "NovaLabs",
    location: "Hyderabad, India",
    description:
      "Own features end-to-end across frontend and backend. Collaborate in an agile team.",
    requirements: ["React", "Node.js", "MongoDB", "TypeScript"],
    salary: "₹12–22 LPA",
  },
  {
    title: "DevOps Engineer",
    company: "CloudNest",
    location: "Pune, India",
    description:
      "Build CI/CD pipelines, manage cloud infra and observability.",
    requirements: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    salary: "₹18–30 LPA",
  },
  {
    title: "Mobile Developer (React Native)",
    company: "AppHive",
    location: "Remote",
    description:
      "Ship RN apps for iOS/Android. Work closely with PMs to deliver features fast.",
    requirements: ["React Native", "TypeScript", "REST"],
    salary: "₹10–20 LPA",
  },
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Job.deleteMany({});
    const inserted = await Job.insertMany(jobs);
    console.log(`✅ Seeded ${inserted.length} jobs`);
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
})();
