function SubmissionsTab({ subs }) {
  if (!subs.length)
    return (
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        No submissions yet.
      </p>
    );

  return (
    <div className="text-gray-800 dark:text-gray-100">
      <h3 className="text-lg font-semibold mb-3">📜 My Submissions</h3>

      <div className="overflow-x-auto rounded border border-gray-200 dark:border-gray-700 shadow-sm">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-zinc-800 border-b text-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-4 py-2 font-medium">Time</th>
              <th className="px-4 py-2 font-medium">Language</th>
              <th className="px-4 py-2 font-medium">Verdict</th>
              <th className="px-4 py-2 font-medium">Passed</th>
            </tr>
          </thead>
          <tbody>
            {subs.map((s, idx) => (
              <tr
                key={idx}
                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition duration-150"
              >
                <td className="px-4 py-2 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {new Date(s.createdAt).toLocaleString("en-IN", {
                    hour12: true,
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    day: "2-digit",
                    month: "short",
                  })}
                </td>
                <td className="px-4 py-2">{s.language.toUpperCase()}</td>
                <td
                  className={`px-4 py-2 font-semibold ${
                    s.verdict === "Accepted"
                      ? "text-green-500"
                      : "text-red-400"
                  }`}
                >
                  {s.verdict}
                </td>
                <td className="px-4 py-2">
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
