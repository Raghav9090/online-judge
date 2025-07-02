import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import axios from "axios";

function EditorPage() {
  const { id } = useParams();

  /* problem + editor states */
  const [problem, setProblem]   = useState(null);
  const [code, setCode]         = useState("// Loading...");
  const [input, setInput]       = useState("");
  const [output, setOutput]     = useState("");
  const [language, setLanguage] = useState("cpp");
  const [verdict, setVerdict]   = useState(null);

  /* 🆕 submissions for this problem */
  const [subs, setSubs] = useState([]);

  /* fetch problem & starter code */
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/problem/${id}`, {
          withCredentials: true,
        });
        const p = res.data;
        setProblem(p);
        setInput(p.sampleInput || "");
        setCode(p.starterCode?.[language] || "// Start coding here...");
      } catch (err) {
        console.error("Load problem error:", err);
      }
    };
    fetchProblem();
  }, [id, language]);

  /* 🆕 fetch submissions for this problem */
  const fetchSubmissions = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/submissions/${id}`,
        { withCredentials: true }
      );
      setSubs(res.data);
    } catch (err) {
      console.error("Fetch submissions error:", err);
    }
  };

  /* call once on mount */
  useEffect(() => {
    fetchSubmissions();
  }, [id]);

  /* Run Code (custom input) */
  const handleRun = async () => {
    setOutput("Running...");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/submitcode",
        { code, input, language },
        { withCredentials: true }
      );
      setOutput(res.data.output || res.data.error || "No output");
    } catch (err) {
      setOutput("Execution failed.");
    }
  };

  /* Submit Code (all test cases) */
  const handleSubmitCode = async () => {
    setVerdict(null);
    setOutput("");
    try {
      const res = await axios.post(
        `http://localhost:5000/api/submitcode/${id}`,
        { code, language },
        { withCredentials: true }
      );
      setVerdict(res.data);
      /* 🆕 refresh submissions list */
      fetchSubmissions();
    } catch (err) {
      setVerdict({ verdict: "Server Error", passed: 0, total: 0 });
    }
  };

  if (!problem) return <div className="p-6">⏳ Loading problem…</div>;

  /* ---------- JSX ---------- */
  return (
    <div className="flex h-screen">
      {/* Left: description */}
      <div className="w-1/2 p-6 border-r overflow-y-auto bg-gray-50">
        <h1 className="text-2xl font-bold mb-2">{problem.title}</h1>
        <p className="mb-4 text-gray-700">{problem.description}</p>
        <h3 className="font-semibold">Input</h3>
        <p className="text-sm text-gray-600 mb-2">{problem.inputFormat}</p>
        <h3 className="font-semibold">Output</h3>
        <p className="text-sm text-gray-600 mb-2">{problem.outputFormat}</p>

        <h3 className="font-semibold mt-4">Sample</h3>
        <pre className="bg-white p-3 rounded text-sm border whitespace-pre-line">
Input:
{problem.sampleInput}

Output:
{problem.sampleOutput}
        </pre>
      </div>

      {/* Right: editor */}
      <div className="w-1/2 p-6 flex flex-col">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="mb-3 p-2 border rounded w-fit"
        >
          <option value="cpp">C++</option>
          <option value="c">C</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>

        <div className="flex-1 border mb-3">
          <Editor
            height="100%"
            theme="vs-dark"
            language={language}
            value={code}
            onChange={(v) => setCode(v || "")}
          />
        </div>

        <textarea
          className="border rounded p-2 text-sm mb-2"
          rows={3}
          placeholder="Custom input (optional)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="flex gap-3 mb-2">
          <button onClick={handleRun} className="bg-blue-600 text-white px-4 py-2 rounded">
            Run Code
          </button>
          <button onClick={handleSubmitCode} className="bg-green-600 text-white px-4 py-2 rounded">
            Submit Code
          </button>
        </div>

        {/* Output */}
        <div className="bg-black text-green-400 p-3 rounded text-sm font-mono overflow-auto h-32">
          {output || "Output will appear here…"}
        </div>

        {/* Verdict */}
        {verdict && (
          <div
            className={`mt-2 p-2 rounded text-sm font-semibold ${
              verdict.verdict === "Accepted" ? "text-green-600" : "text-red-600"
            }`}
          >
            Verdict: {verdict.verdict} <br />
            Passed: {verdict.passed} / {verdict.total}
          </div>
        )}

        {/* 🆕 My Submissions table */}
        {subs.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">📜 My Submissions</h3>
            <table className="w-full text-xs border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-1">Time</th>
                  <th className="p-1">Lang</th>
                  <th className="p-1">Verdict</th>
                  <th className="p-1">Passed</th>
                </tr>
              </thead>
              <tbody>
                {subs.map((s, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-1">{new Date(s.createdAt).toLocaleString()}</td>
                    <td className="p-1">{s.language}</td>
                    <td
                      className={`p-1 font-semibold ${
                        s.verdict === "Accepted" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {s.verdict}
                    </td>
                    <td className="p-1">
                      {s.passed} / {s.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditorPage;
