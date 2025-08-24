//This is the button on the homeSplit Screen
import { Link } from "react-router-dom";
export default function JobseekerButton() {
  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      <div className="flex flex-col items-center justify-center flex-1 p-8 text-white bg-gradient-to-b from-sky-300 to-white">
        <h1 className="mb-4 text-4xl font-bold text-slate-500">New to WorkSpark?</h1>
        <p className="max-w-md mb-6 text-center text-slate-500">
          Discover jobs, swipe right to save, and match with recruiters instantly.
        </p>
         <button className="px-4 py-2 text-white transition border rounded-lg bg-sky-500 border-sky-500 hover:bg-white hover:text-sky-500">
         <Link to ="/signup">   Sign up Today!</Link>
        </button>
      </div>
    </div>
  );
}

//hello deepali whats up
