// src/components/Navbar.jsx
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold text-sky-600 ">
              WorkSpark
            </span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex space-x-6">
            <div className="text-gray-700 hover:text-pink-600" > <Link to="/">Home</Link> </div>
            <a href="#" className="text-gray-700 hover:text-pink-600"></a>
            <a href="#" className="text-gray-700 hover:text-pink-600">Saved</a>
            <a href="#" className="text-gray-700 hover:text-pink-600">Your Profile</a>
          </div>

          {/* Login / Signup */}
          <div className="hidden md:flex space-x-4">
            <button className="px-4 py-2 bg-white text-sky-500 border border-sky-500 rounded-lg hover:bg-sky-500 hover:text-white transition">
             <Link to="/login" >Log In</Link>
            </button>
            <button className="px-4 py-2 bg-sky-500 text-white border border-sky-300 rounded-lg hover:bg-white hover:text-sky-500 transition">
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button>
              <svg
                className="h-6 w-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
