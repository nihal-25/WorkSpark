// seedJobs.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Job from "./models/Job.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "your_mongodb_connection_string_here";

const JOB_TYPES = [
  "Software Developer", "Web Developer", "Frontend Developer", "Backend Developer",
  "Full Stack Developer", "App Developer", "Mobile Developer", "UI/UX Designer",
  "Data Scientist", "Machine Learning Engineer", "AI Engineer", "DevOps Engineer",
  "Cloud Architect", "Cybersecurity Analyst", "Database Administrator", "Network Engineer",
  "System Administrator", "Marketing Specialist", "Product Manager", "Business Analyst",
  "Graphic Designer", "Game Developer", "Content Writer", "Video Editor", "HR Manager",
  "Sales Executive", "Customer Support", "Finance Analyst", "Operations Manager", "QA Tester",
];

const LOCATIONS = [
  "Bengaluru", "Hyderabad", "Pune", "Chennai", "Mumbai",
  "Delhi", "Noida", "Gurugram", "Kolkata", "Ahmedabad",
  "Coimbatore", "Kochi", "Indore", "Jaipur", "Surat",
  "Nagpur", "Lucknow", "Chandigarh", "Bhopal", "Vizag",
];

const SALARY_RANGES = [
  "₹3 LPA - ₹6 LPA", "₹6 LPA - ₹10 LPA", "₹10 LPA - ₹15 LPA",
  "₹15 LPA - ₹25 LPA", "₹25 LPA+", "₹8 LPA - ₹12 LPA"
];

const WORK_MODES = ["In Office", "Remote", "Hybrid"];

const COMPANIES = [
  "Infosys", "TCS", "Wipro", "Accenture", "Capgemini",
  "Cognizant", "Tech Mahindra", "Zoho", "HCL Technologies",
  "IBM India", "Google India", "Microsoft India", "Amazon", "Flipkart", "Paytm"
];

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randomRequirements = () => {
  const skills = [
    "React", "Node.js", "MongoDB", "Express", "Java", "Python", "SQL", "C++", "HTML", "CSS",
    "AWS", "Azure", "Docker", "Kubernetes", "Machine Learning", "TensorFlow", "UI Design",
    "Networking", "Communication", "Problem Solving", "Leadership"
  ];
  return Array.from({ length: 4 }, () => randomItem(skills));
};

const generateJobs = (count = 60) => {
  const jobs = [];

  for (let i = 0; i < count; i++) {
    const jobType = randomItem(JOB_TYPES);
    const minExp = Math.random() < 0.7 ? 0 : Math.floor(Math.random() * 6) + 1; // 70% fresher
    const job = {
      title: jobType,
      company: randomItem(COMPANIES),
      location: randomItem(LOCATIONS),
      description: `We are hiring a ${jobType} to join our ${randomItem(["tech", "product", "engineering", "marketing"])} team.`,
      fullDescription: `This role involves working on ${jobType.toLowerCase()} related tasks including design, development, and deployment. You’ll collaborate with teams and contribute to real-world projects.`,
      requirements: randomRequirements(),
      salary: randomItem(SALARY_RANGES),
      postedBy: null, // or replace with recruiter _id if needed
      jobType,
      minExperience: minExp,
      workMode: randomItem(WORK_MODES),
    };
    jobs.push(job);
  }

  return jobs;
};

const seedJobs = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected.");

    await Job.deleteMany({});
    console.log("🧹 Cleared existing jobs.");

    const jobs = generateJobs(70);
    await Job.insertMany(jobs);

    console.log(`🌱 Seeded ${jobs.length} new jobs successfully.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding jobs:", error);
    process.exit(1);
  }
};

seedJobs();
