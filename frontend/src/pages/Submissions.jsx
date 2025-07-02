import { useEffect, useState } from "react";
import axios from "axios";

function Submissions() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/mysubmissions", {
      withCredentials: true,
    })
      .then((res) => setSubmissions(res.data))
      .catch((err) => console.error("Failed to load submissions", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📝 My Submissions</h1>
      <table className="w-full border text-sm">
        <thead className="bg-gray-100 text-left">
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
            <tr key={sub._id} className="border-t">
              <td className="p-2">{i + 1}</td>
              <td className="p-2">{sub.problem?.title || "N/A"}</td>
              <td className="p-2">{sub.language}</td>
              <td className={`p-2 font-semibold ${sub.verdict === "Accepted" ? "text-green-600" : "text-red-600"}`}>
                {sub.verdict}
              </td>
              <td className="p-2">{sub.passed} / {sub.total}</td>
              <td className="p-2">{new Date(sub.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Submissions;
