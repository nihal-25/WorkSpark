//This is the button on the homeSplit Screen
import { Link } from "react-router-dom";
export default function RecruiterButton() {
  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      {/* Recruiters Section */}
      <div className="flex flex-col items-center justify-center flex-1 p-8 text-white bg-gradient-to-b from-sky-500 to-white">
        <h1 className="mb-4 text-4xl font-bold">New to WorkSpark?</h1>
        <p className="max-w-md mb-6 text-center">
          Post jobs, connect with top talent, and hire faster than ever before.
        </p>
        <button className="px-6 py-3 font-semibold transition bg-white rounded-lg text-sky-600 hover:text-pink-700">
         <Link to="/signup">Sign Up today!</Link>   
        </button>
      </div>
    </div>
  );
}
