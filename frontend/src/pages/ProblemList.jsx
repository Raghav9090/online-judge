import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

function ProblemList() {
  const [problems, setProblems] = useState([]);
  const [solvedIds, setSolvedIds] = useState([]);
  const [filter, setFilter] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [problemRes, userRes] = await Promise.all([
          axios.get("http://localhost:5000/api/problemlist", {
            withCredentials: true,
          }),
          axios.get("http://localhost:5000/api/dashboard", {
            withCredentials: true,
          }),
        ]);

        setProblems(problemRes.data);
        setSolvedIds(userRes.data.user?.solvedProblems || []);
      } catch (err) {
        console.error("Error loading problems or user data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 bg-white text-black dark:bg-zinc-900 dark:text-white min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">📝 All Problems</h1>
        <select
          className="border px-3 py-1 rounded dark:bg-zinc-800 dark:text-white dark:border-gray-700"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      <table className="table-auto w-full border text-left text-sm">
        <thead className="bg-gray-100 dark:bg-zinc-800 border-b dark:border-gray-700">
          <tr>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Difficulty</th>
            <th className="px-4 py-2">Tags</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {problems
            .filter((p) => !filter || p.difficulty === filter)
            .map((p) => {
              const isSolved = solvedIds.includes(p._id);
              return (
                <tr key={p._id} className="border-t dark:border-gray-700">
                  <td className="px-4 py-2 text-blue-600 dark:text-purple-400 font-medium hover:underline">
                    <Link to={`/editor/${p._id}`}>{p.title}</Link>
                  </td>
                  <td className="px-4 py-2">{p.difficulty}</td>
                  <td className="px-4 py-2">
                    {Array.isArray(p.tag) ? p.tag.join(", ") : p.tag || "—"}
                  </td>
                  <td className="px-4 py-2">
                    {isSolved ? (
                      <span className="text-green-500 font-semibold">✔ Solved</span>
                    ) : (
                      <span className="text-red-500">✘</span>
                    )}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default ProblemList;
