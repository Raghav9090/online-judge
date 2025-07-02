import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div className="p-8 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {user?.username} 👋
      </h1>
      <p className="mb-2 text-gray-600">
        Email: <span className="font-medium">{user?.email}</span>
      </p>
      <p className="mb-6 text-gray-600">
        Role: <span className="capitalize font-semibold">{user?.usertype}</span>
      </p>

      <div className="space-x-4 mt-6">
        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Solve Problems
        </button>
        <button className="px-4 py-2 bg-green-600 text-white rounded">
          View Submissions
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
