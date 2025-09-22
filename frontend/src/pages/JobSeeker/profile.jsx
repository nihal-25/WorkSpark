import { useEffect, useState, useContext } from "react";
import API from "../api";
import AuthContext from "../../context/AuthContext";

export default function ProfilePage() {
  const { user } = useContext(AuthContext); // user info from context (token, id, role, etc.)
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/users/me"); // backend route
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">My Profile</h2>
      <div className="space-y-2">
        <p><span className="font-semibold">Name:</span> {profile.name}</p>
        <p><span className="font-semibold">Email:</span> {profile.email}</p>
        <p><span className="font-semibold">Role:</span> {profile.role}</p>
        {profile.bio && <p><span className="font-semibold">Bio:</span> {profile.bio}</p>}
      </div>
    </div>
  );
}
