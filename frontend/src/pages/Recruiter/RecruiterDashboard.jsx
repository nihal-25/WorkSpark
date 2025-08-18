export default function RecruiterPage() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="p-4" fle>
      <h1>Welcome, {user?.name}</h1>
      <p>Your role: {user?.role}</p>
      <button
        onClick={() => {
          localStorage.removeItem("user"); // ✅ logout
          window.location.href = "/login";
        }}
        className="bg-red-500 text-white px-4 py-2 mt-4"
      >
        Logout
      </button>
    </div>
  );
}
