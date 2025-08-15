export default function SignupJobSeeker() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Start your WorkSpark Journey today!</h1>
      <form className="flex flex-col gap-4 w-80">
        <input className="p-2 border rounded" type="text" placeholder="First Name" />
        <input className="p-2 border rounded" type="text" placeholder="Last Name" />
        <input className="p-2 border rounded" type="email" placeholder="Email" />
        <input className="p-2 border rounded" type="password" placeholder="Password" />
        <button className="bg-purple-500 text-white p-2 rounded">Signup</button>
      </form>
    </div>
  );
}
