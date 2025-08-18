//This is the button on the homeSplit Screen
import { Link } from "react-router-dom";
export default function JobseekerButton() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="flex-1 bg-gradient-to-b from-sky-300 to-white flex flex-col items-center justify-center text-white p-8">
        <h1 className="text-4xl font-bold mb-4 text-slate-500">New to WorkSpark?</h1>
        <p className="mb-6 max-w-md text-slate-500 text-center">
          Discover jobs, swipe right to save, and match with recruiters instantly.
        </p>
         <button className="px-4 py-2 bg-sky-500 text-white border border-sky-500 rounded-lg hover:bg-white hover:text-sky-500 transition">
         <Link to ="/signup">   Sign up Today!</Link>
        </button>
      </div>
    </div>
  );
}
