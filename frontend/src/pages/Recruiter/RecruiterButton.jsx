//This is the button on the homeSplit Screen
import { Link } from "react-router-dom";
export default function RecruiterButton() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Recruiters Section */}
      <div className="flex-1 bg-gradient-to-b from-sky-500 to-white flex flex-col items-center justify-center text-white p-8">
        <h1 className="text-4xl font-bold mb-4">New to WorkSpark?</h1>
        <p className="mb-6 max-w-md text-center">
          Post jobs, connect with top talent, and hire faster than ever before.
        </p>
        <button className="bg-white text-sky-600 px-6 py-3 rounded-lg font-semibold hover:text-pink-700 transition">
         <Link to="/signup">Sign Up today!</Link>   
        </button>
      </div>
    </div>
  );
}
