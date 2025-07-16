import { useEffect, useState, useContext, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

/**
 * ProblemList – displays the full list of problems with tags, status badges,
 * difficulty pills, search & basic filters, and dark / light theming.
 *
 * Tags are now fetched directly as part of every problem (field `tags`).
 * They are rendered LeetCode‑style as rounded chips. If a problem has more
 * than three tags, only the first three are shown followed by an ellipsis chip.
 */
export default function ProblemList() {
  /* ────────────────────────── State ────────────────────────── */
  const [problems, setProblems] = useState([]);
  const [solvedIds, setSolvedIds] = useState([]);
  const [attemptedIds, setAttemptedIds] = useState([]);
  const [bookmarkIds, setBookmarkIds] = useState([]);

  const [search, setSearch] = useState("");
  const [diffFilter, setDiff] = useState("All");
  const [statusFilter, setStatus] = useState("All");

  const { user } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);

  /* ───────────────────────── Fetch ─────────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const [problemRes, userRes] = await Promise.all([
          axios.get("http://3.111.39.120:5000/api/problemlist", {
            withCredentials: true,
          }),
          axios.get("http://3.111.39.120:5000/api/dashboard", {
            withCredentials: true,
          }),
        ]);

        setProblems(problemRes.data || []);
        const u = userRes.data.user || {};
        setSolvedIds(u.solvedProblems || []);
        setAttemptedIds(u.attemptedProblems || []);
        setBookmarkIds(u.bookmarks || []);
      } catch (err) {
        console.error("Error loading problems or user data:", err);
      }
    })();
  }, []);

  /* ───────────── Derived counts & helpers ───────────── */
  const totalProblems = problems.length;
  const solvedCount = solvedIds.length;
  const attemptedCount = attemptedIds.length;
  const bookmarkedCount = bookmarkIds.length;

  const diffColor = (d) =>
    ({
      Easy: "bg-green-600/20 text-green-500",
      Medium: "bg-yellow-600/20 text-yellow-500",
      Hard: "bg-red-600/20 text-red-500",
    }[d] || "bg-gray-600/20 text-gray-400");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return problems.filter((p) => {
      /** Normalise tags property (`tags` vs legacy `tag`) */
      const tagsArr = Array.isArray(p.tags)
        ? p.tags
        : Array.isArray(p.tag)
        ? p.tag
        : [];

      const tagText = tagsArr.join(" ").toLowerCase();

      const textMatch = !q ||
        p.title.toLowerCase().includes(q) ||
        tagText.includes(q) ||
        (p.shortId && p.shortId.toString().includes(q));

      const diffMatch = diffFilter === "All" || p.difficulty === diffFilter;

      const isSolved = solvedIds.includes(p._id);
      const isAttempted = attemptedIds.includes(p._id);

      let statusMatch = true;
      if (statusFilter === "Solved") statusMatch = isSolved;
      if (statusFilter === "Attempted") statusMatch = !isSolved && isAttempted;
      if (statusFilter === "Unsolved") statusMatch = !isSolved && !isAttempted;

      return textMatch && diffMatch && statusMatch;
    });
  }, [problems, search, diffFilter, statusFilter, solvedIds, attemptedIds]);

  /* ───────────────────────── Theme helpers ───────────────────────── */
  const bgGradient = darkMode
    ? "from-[#0b0b0b] to-[#131313]"
    : "from-[#f7f7f7] to-[#eaeaea]";
  const cardBg = darkMode
    ? "bg-[#1a1a1a]/80 backdrop-blur-md border border-white/10"
    : "bg-white shadow border border-gray-200";
  const rowAlt = darkMode ? "bg-white/5" : "bg-gray-100/60";
  const rowHover = darkMode ? "hover:bg-white/10" : "hover:bg-gray-200/60";
  const thBg = darkMode ? "bg-[#181818]" : "bg-gray-100";
  const thText = darkMode ? "text-gray-400" : "text-gray-500";
  const inputBg = darkMode ? "bg-[#1e1e1e]" : "bg-white";
  const inputBorder = darkMode ? "border-white/10" : "border-gray-300";

  /* ─────────────────────────── JSX ─────────────────────────── */
  return (
    <div
      className={`px-6 py-8 min-h-screen bg-gradient-to-b ${bgGradient} ${
        darkMode ? "text-white" : "text-gray-900"
      }`}
    >
      {/* === Stats Bar === */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Problems", value: totalProblems, icon: "🧮" },
          { label: "Solved", value: solvedCount, icon: "✅" },
          { label: "Attempted", value: attemptedCount, icon: "🕑" },
          { label: "Bookmarked", value: bookmarkedCount, icon: "🔖" },
        ].map((box) => (
          <div key={box.label} className={`rounded-xl p-4 ${cardBg}`}>
            <div className="flex items-center gap-2 text-sm opacity-80 mb-1">
              <span>{box.icon}</span>
              <span>{box.label}</span>
            </div>
            <p className="text-2xl font-bold">{box.value}</p>
          </div>
        ))}
      </div>

      {/* === Filters & Search === */}
      <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-2 mb-4">
        <input
          type="text"
          placeholder="Search problems by title, ID, or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`flex-1 px-3 py-2 rounded ${inputBg} border ${inputBorder} outline-none focus:ring-2 focus:ring-purple-600`}
        />

        <select
          value={diffFilter}
          onChange={(e) => setDiff(e.target.value)}
          className={`px-3 py-2 rounded ${inputBg} border ${inputBorder}`}
        >
          {["All", "Easy", "Medium", "Hard"].map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatus(e.target.value)}
          className={`px-3 py-2 rounded ${inputBg} border ${inputBorder}`}
        >
          {["All", "Solved", "Attempted", "Unsolved"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* === Problem Table === */}
      <div className="overflow-x-auto rounded-lg">
        <table className="w-full text-sm">
          <thead
            className={`${thBg} ${thText} border-b ${
              darkMode ? "border-white/10" : "border-gray-300"
            }`}
          >
            <tr>
              <th className="px-4 py-2 font-medium text-left">Title</th>
              <th className="px-4 py-2 font-medium text-left">Tags</th>
              <th className="px-4 py-2 font-medium text-center">Difficulty</th>
              <th className="px-4 py-2 font-medium text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((p, idx) => {
              const isSolved = solvedIds.includes(p._id);
              const isAttempted = attemptedIds.includes(p._id);
              const tagsArr = Array.isArray(p.tags)
                ? p.tags
                : Array.isArray(p.tag)
                ? p.tag
                : [];

              const visibleTags = tagsArr.slice(0, 3);
              const hasMore = tagsArr.length > 3;

              return (
                <tr
                  key={p._id}
                  className={`${idx % 2 ? rowAlt : ""} ${rowHover} ${
                    darkMode
                      ? "border-b border-white/10"
                      : "border-b border-gray-300"
                  }`}
                >
                  {/* Title */}
                  <td className="px-4 py-3">
                    <Link
                      to={`/editor/${p._id}`}
                      className="text-purple-500 hover:underline"
                    >
                      {p.title}
                    </Link>
                  </td>

                  {/* Tags */}
                  <td className="px-4 py-3 whitespace-nowrap max-w-xs">
                    {visibleTags.length ? (
                      <>
                        {visibleTags.map((t) => (
                          <span
                            key={t}
                            className={`inline-block rounded px-2 py-px text-xs mr-1 mb-1 ${
                              darkMode ? "bg-white/10" : "bg-gray-300/40"
                            }`}
                          >
                            {t}
                          </span>
                        ))}
                        {hasMore && (
                          <span
                            className={`inline-block rounded px-2 py-px text-xs mr-1 mb-1 opacity-70 ${
                              darkMode ? "bg-white/5" : "bg-gray-200/40"
                            }`}
                          >
                            …
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>

                  {/* Difficulty */}
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-px text-xs rounded-full font-semibold ${diffColor(
                        p.difficulty
                      )}`}
                    >
                      {p.difficulty}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 text-center">
                    {isSolved ? (
                      <span className="text-green-400 font-semibold">✔</span>
                    ) : isAttempted ? (
                      <span className="text-yellow-400">●</span>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
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
