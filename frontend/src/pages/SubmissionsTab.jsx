// SubmissionsTab.jsx
function SubmissionsTab({ subs }) {
  if (!subs.length) {
    return (
      <div className="p-6 text-sm text-gray-500 dark:text-gray-400">
        No submissions yet.
      </div>
    );
  }

  return (
    <div className="p-6 text-gray-900 dark:text-gray-100 bg-white dark:bg-[#0f0f0f]">
      <h3 className="text-xl font-semibold mb-4 text-purple-600 dark:text-purple-400">
        📜 My Submissions
      </h3>

      <div className="overflow-x-auto rounded-lg border border-gray-300 dark:border-zinc-700 shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Time</th>
              <th className="px-4 py-3 text-left font-medium">Language</th>
              <th className="px-4 py-3 text-left font-medium">Verdict</th>
              <th className="px-4 py-3 text-left font-medium">Passed</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-700">
            {subs.map((s, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition duration-150"
              >
                <td className="px-4 py-3 whitespace-nowrap text-gray-700 dark:text-gray-300">
                  {new Date(s.createdAt).toLocaleString("en-IN", {
                    hour12: true,
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    day: "2-digit",
                    month: "short",
                  })}
                </td>
                <td className="px-4 py-3 text-gray-800 dark:text-gray-300">
                  {s.language.toUpperCase()}
                </td>
                <td
                  className={`px-4 py-3 font-semibold ${
                    s.verdict === "Accepted" ? "text-green-500" : "text-red-400"
                  }`}
                >
                  {s.verdict}
                </td>
                <td className="px-4 py-3 text-gray-800 dark:text-gray-300">
                  {s.passed} / {s.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SubmissionsTab;
