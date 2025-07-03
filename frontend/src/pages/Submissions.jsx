import { useEffect, useState } from "react";
import axios from "axios";

function Submissions() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/mysubmissions", {
        withCredentials: true,
      })
      .then((res) => setSubmissions(res.data))
      .catch((err) => console.error("Failed to load submissions", err));
  }, []);

  return (
    <div className="p-6 bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">📝 My Submissions</h1>
      <div className="overflow-x-auto">
        <table className="w-full border text-sm border-gray-200 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-zinc-800 text-left">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">Problem</th>
              <th className="p-2">Language</th>
              <th className="p-2">Verdict</th>
              <th className="p-2">Passed</th>
              <th className="p-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub, i) => (
              <tr
                key={sub._id}
                className="border-t border-gray-200 dark:border-gray-700"
              >
                <td className="p-2">{i + 1}</td>
                <td className="p-2">{sub.problem?.title || "N/A"}</td>
                <td className="p-2">{sub.language}</td>
                <td
                  className={`p-2 font-semibold ${
                    sub.verdict === "Accepted"
                      ? "text-green-500"
                      : "text-red-400"
                  }`}
                >
                  {sub.verdict}
                </td>
                <td className="p-2">
                  {sub.passed} / {sub.total}
                </td>
                <td className="p-2">
                  {new Date(sub.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Submissions;
