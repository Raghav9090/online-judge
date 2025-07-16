import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";

function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    axios
      .get("http://3.111.39.120:5000/api/mysubmissions", {
        withCredentials: true,
      })
      .then((res) => setSubmissions(res.data))
      .catch((err) => console.error("Failed to load submissions", err));
  }, []);

  const formatTime = (iso) => {
    const date = new Date(iso);
    return date.toLocaleString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const bgGradient = darkMode
    ? "from-[#0e0e0e] to-[#1a1a1a]"
    : "from-[#f8f8f8] to-[#e5e5e5]";
  const tableBorder = darkMode ? "border-white/10" : "border-gray-300";
  const rowEven = darkMode ? "bg-white/5" : "bg-gray-100/60";
  const rowOdd = darkMode ? "bg-white/10" : "bg-gray-200/50";
  const rowHover = darkMode ? "hover:bg-white/20" : "hover:bg-gray-300/40";
  const textColor = darkMode ? "text-white" : "text-gray-900";
  const subText = darkMode ? "text-gray-400" : "text-gray-600";
  const headerBg = darkMode ? "bg-[#181818]" : "bg-gray-100";
  const headerText = darkMode ? "text-gray-400" : "text-gray-600";

  return (
    <div
      className={`px-6 py-10 min-h-screen bg-gradient-to-b ${bgGradient} ${textColor}`}
    >
      <h1 className="text-2xl font-bold mb-6">📜 My Submissions</h1>

      <div
        className={`overflow-x-auto rounded-lg shadow border ${tableBorder}`}
      >
        <table className="w-full text-sm">
          <thead
            className={`${headerBg} border-b ${tableBorder} text-left ${headerText}`}
          >
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Problem</th>
              <th className="px-4 py-3">Language</th>
              <th className="px-4 py-3 text-center">Verdict</th>
              <th className="px-4 py-3 text-center">Passed</th>
              <th className="px-4 py-3 text-right">Time</th>
            </tr>
          </thead>

          <tbody>
            {submissions.map((sub, i) => {
              const isAccepted = sub.verdict === "Accepted";
              const verdictColor =
                isAccepted
                  ? "text-green-500"
                  : sub.verdict === "Wrong Answer"
                  ? "text-yellow-500"
                  : "text-red-500";

              return (
                <tr
                  key={sub._id}
                  className={`${i % 2 === 0 ? rowEven : rowOdd} ${rowHover} ${tableBorder} border-b transition`}
                >
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-purple-500">
                    {sub.problem?.title || "N/A"}
                  </td>
                  <td className="px-4 py-3">{sub.language}</td>

                  <td className="px-4 py-3 text-center">
                    <span className={`text-sm font-semibold ${verdictColor}`}>
                      {sub.verdict}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    {sub.passed} / {sub.total}
                  </td>

                  <td className={`px-4 py-3 text-right ${subText}`}>
                    {formatTime(sub.createdAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Submissions;
