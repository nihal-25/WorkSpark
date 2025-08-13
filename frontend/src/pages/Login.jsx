export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form className="flex flex-col gap-4 w-80">
        <input className="p-2 border rounded" type="email" placeholder="Email" />
        <input className="p-2 border rounded" type="password" placeholder="Password" />
        <button className="bg-blue-500 text-white p-2 rounded">Login</button>
      </form>
    </div>
  );
}
