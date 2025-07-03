import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import axios from "axios";
import DescriptionTab from "./DescriptionTab";
import SubmissionsTab from "./SubmissionsTab";

function EditorPage() {
  const { id } = useParams();

  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("// Loading...");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [verdict, setVerdict] = useState(null);
  const [subs, setSubs] = useState([]);
  const [activeTab, setActiveTab] = useState("description");

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

  const fetchSubmissions = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/submissions/${id}`, {
        withCredentials: true,
      });
      setSubs(res.data);
    } catch (err) {
      console.error("Fetch submissions error:", err);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [id]);

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
      fetchSubmissions(); // Refresh
    } catch (err) {
      setVerdict({ verdict: "Server Error", passed: 0, total: 0 });
    }
  };

  if (!problem) return <div className="p-6 dark:text-white">⏳ Loading problem…</div>;

  return (
    <div className="flex h-screen dark:bg-zinc-900 text-black dark:text-white">
      {/* Left: Tabs */}
      <div className="w-1/2 p-6 border-r border-gray-300 dark:border-gray-700 overflow-y-auto bg-gray-50 dark:bg-zinc-800">
        <div className="flex gap-4 border-b border-gray-300 dark:border-gray-600 mb-4">
          <button
            className={`pb-2 font-medium ${
              activeTab === "description"
                ? "border-b-2 border-blue-600"
                : "text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>
          <button
            className={`pb-2 font-medium ${
              activeTab === "submissions"
                ? "border-b-2 border-blue-600"
                : "text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => setActiveTab("submissions")}
          >
            Submissions
          </button>
        </div>

        {activeTab === "description" && <DescriptionTab problem={problem} />}
        {activeTab === "submissions" && <SubmissionsTab subs={subs} />}
      </div>

      {/* Right: Editor */}
      <div className="w-1/2 p-6 flex flex-col bg-white dark:bg-zinc-900">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="mb-3 p-2 border rounded w-fit dark:bg-zinc-800 dark:text-white dark:border-gray-700"
        >
          <option value="cpp">C++</option>
          <option value="c">C</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>

        <div className="flex-1 border mb-3 dark:border-gray-700">
          <Editor
            height="100%"
            theme="vs-dark"
            language={language}
            value={code}
            onChange={(v) => setCode(v || "")}
          />
        </div>

        <textarea
          className="border rounded p-2 text-sm mb-2 dark:bg-zinc-800 dark:text-white dark:border-gray-700"
          rows={3}
          placeholder="Custom input (optional)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="flex gap-3 mb-2">
          <button
            onClick={handleRun}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Run Code
          </button>
          <button
            onClick={handleSubmitCode}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Submit Code
          </button>
        </div>

        <div className="bg-black text-green-400 p-3 rounded text-sm font-mono overflow-auto h-32">
          {output || "Output will appear here…"}
        </div>

        {verdict && (
          <div
            className={`mt-2 p-2 rounded text-sm font-semibold ${
              verdict.verdict === "Accepted" ? "text-green-500" : "text-red-500"
            }`}
          >
            Verdict: {verdict.verdict} <br />
            Passed: {verdict.passed} / {verdict.total}
          </div>
        )}
      </div>
    </div>
  );
}

export default EditorPage;
