export default function SignupRecruiter() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Recruiter Signup</h1>
      <form className="flex flex-col gap-4 w-80">
        <input className="p-2 border rounded" type="text" placeholder="Company Name" />
        <input className="p-2 border rounded" type="email" placeholder="Email" />
        <input className="p-2 border rounded" type="password" placeholder="Password" />
        <button className="bg-green-500 text-white p-2 rounded">Signup</button>
      </form>
    </div>
  );
}
