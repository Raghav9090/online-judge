import { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Split from "react-split";
import DOMPurify from "dompurify";
import { ThemeContext } from "../context/ThemeContext";
import DescriptionTab from "./DescriptionTab";
import SubmissionsTab from "./SubmissionsTab";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { githubDark, githubLight } from "@uiw/codemirror-theme-github";
import { FaUndo, FaPlus, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

export default function EditorPage() {
  const { id } = useParams();
  const { darkMode } = useContext(ThemeContext);
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("// Start coding here...");
  const [language, setLanguage] = useState("cpp");
  const [testCases, setTestCases] = useState([]);
  const [activeTestIndex, setActiveTestIndex] = useState(0);
  const [verdict, setVerdict] = useState(null);
  const [subs, setSubs] = useState([]);
  const [activeTab, setActiveTab] = useState("description");
  const [aiHint, setAiHint] = useState("");
  const [hintActive, setHintActive] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/problem/${id}`, { withCredentials: true });
        const p = res.data;
        setProblem(p);
        setCode(p.starterCode?.[language] || "// Start coding here...");
        const visibleCases = (p.testcases || []).filter(tc => tc.visible);
        setTestCases(visibleCases.map(tc => ({ input: tc.input, expected: tc.output, output: "", passed: null })));
      } catch (err) {
        console.error("Problem fetch error:", err);
      }
    })();
  }, [id, language]);

  useEffect(() => {
    (async () => {
      try {
        const r = await axios.get(`http://localhost:5000/api/submissions/${id}`, { withCredentials: true });
        setSubs(r.data);
      } catch (err) {
        console.error("Submissions fetch error:", err);
      }
    })();
  }, [id]);

  const runSingleTest = async (test, index) => {
    const updated = [...testCases];
    updated[index].output = "Running...";
    setTestCases(updated);
    try {
      const r = await axios.post("http://localhost:5000/api/submitcode", { code, input: test.input, language }, { withCredentials: true });
      updated[index].output = DOMPurify.sanitize(r.data.output || r.data.error || "No output");
      updated[index].passed = (r.data.output || "").trim() === test.expected.trim();
    } catch {
      updated[index].output = DOMPurify.sanitize("Execution Error");
      updated[index].passed = false;
    }
    setTestCases([...updated]);
  };

  const handleSubmit = async () => {
    setVerdict(null);
    try {
      const r = await axios.post(`http://localhost:5000/api/submitcode/${id}`, { code, language }, { withCredentials: true });
      setVerdict(r.data);
    } catch {
      setVerdict({ verdict: "Server Error", passed: 0, total: 0 });
    }
  };

  const handleRunAll = async () => {
    for (let i = 0; i < testCases.length; i++) await runSingleTest(testCases[i], i);
  };

  const handleReset = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Your current code will be lost.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, reset it!",
    });
    if (result.isConfirmed) setCode(problem.starterCode?.[language] || "// Start coding here...");
  };

  const handleGetHint = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/hint", {
        code,
        language,
        problemTitle: problem.title,
      }, { withCredentials: true });

      const hint = DOMPurify.sanitize(res.data.hint || "No suggestion available.");
      setAiHint(hint);
      setHintActive(true);
      Swal.fire({
        title: "AI Suggestion",
        html: `<pre style="text-align: left; white-space: pre-wrap;">${hint}</pre>`,
        icon: "info",
        confirmButtonText: "Use this",
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          setCode(code + "\n\n" + hint);
          setHintActive(false);
        }
      });
    } catch (err) {
      console.error("Hint error:", err);
      Swal.fire("Oops!", "Failed to get AI hint.", "error");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Tab" && hintActive && aiHint) {
      event.preventDefault();
      setCode(prev => prev + "\n\n" + aiHint);
      setHintActive(false);
    }
  };

  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: "", expected: "", output: "", passed: null }]);
    setActiveTestIndex(testCases.length);
  };

  const handleDeleteTestCase = (index) => {
    const updated = [...testCases];
    updated.splice(index, 1);
    setTestCases(updated);
    setActiveTestIndex(Math.max(0, index - 1));
  };

  const langExt = language === "cpp" ? cpp() : language === "java" ? java() : python();
  if (!problem) return <div className="p-6">Loading…</div>;

  return (
    <div className={`h-screen w-screen flex flex-col ${darkMode ? "bg-[#0f0f0f] text-white" : "bg-white text-black"}`}>
      <div className="flex border-b border-white/10">
        <button className={`px-5 py-2 text-sm font-semibold ${activeTab === "description" ? "bg-gray-200 dark:bg-[#1e1e1e] text-purple-600 dark:text-purple-400" : "hover:bg-gray-100 dark:hover:bg-[#1e1e1e] text-gray-600 dark:text-gray-400"}`} onClick={() => setActiveTab("description")}>Description</button>
        <button className={`px-5 py-2 text-sm font-semibold ${activeTab === "submissions" ? "bg-gray-200 dark:bg-[#1e1e1e] text-purple-600 dark:text-purple-400" : "hover:bg-gray-100 dark:hover:bg-[#1e1e1e] text-gray-600 dark:text-gray-400"}`} onClick={() => setActiveTab("submissions")}>Submissions</button>
      </div>

      <Split className={`flex-1 flex ${darkMode ? "bg-[#0f0f0f]" : "bg-white"}`} sizes={[50, 50]} minSize={350} gutterSize={6}>
        <div className="overflow-auto p-4 bg-white dark:bg-[#101013]">
          {activeTab === "description" ? <DescriptionTab problem={problem} /> : <SubmissionsTab subs={subs} />}
        </div>

        <Split direction="vertical" sizes={[70, 30]} minSize={150} gutterSize={6} className={`bg-white dark:bg-[#0f0f0f]`}>
          <div className={`flex flex-col border-b ${darkMode ? "bg-[#0f0f0f]" : "bg-white"}`}>
            <div className="flex items-center gap-4 px-4 py-2 border-b border-gray-300 dark:border-white/10">
              <label className="text-sm font-medium">Language:</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-gray-100 dark:bg-[#1a1a1a] text-gray-900 dark:text-white px-3 py-1 rounded">
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
              </select>
              <button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm">Submit</button>
              <button onClick={handleRunAll} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm">Run</button>
              <button onClick={handleGetHint} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded text-sm">Get Hint</button>
              <div className="ml-auto flex gap-2">
                <button onClick={handleReset} title="Reset code" className="text-gray-700 dark:text-white hover:text-red-500 text-base"><FaUndo /></button>
              </div>
              {verdict && (
                <div className={`ml-3 text-sm font-semibold ${verdict.verdict === "Accepted" ? "text-green-500" : "text-red-500"}`}>
                  {verdict.verdict} ({verdict.passed}/{verdict.total})
                </div>
              )}
            </div>

            <div className="flex-1 overflow-hidden border-t border-gray-300 dark:border-white/10 p-1">
              <div className="h-full rounded border border-gray-300 dark:border-white/10 overflow-hidden">
                <CodeMirror
                  ref={editorRef}
                  value={code}
                  height="100%"
                  extensions={[langExt]}
                  theme={darkMode ? githubDark : githubLight}
                  onChange={(v) => setCode(v)}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
          </div>

          <div className={`h-full ${darkMode ? "bg-[#0f0f0f]" : "bg-gray-50"} text-gray-900 dark:text-white`}>
            <div className="flex items-center justify-between px-4 pt-3">
              <div className="text-sm font-semibold text-green-600 dark:text-green-400">Testcase</div>
              <button onClick={handleAddTestCase} title="Add Test Case" className="text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1">
                <FaPlus /> Add
              </button>
            </div>

            <div className="flex overflow-x-auto border-b border-gray-300 dark:border-white/10">
              {testCases.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestIndex(i)}
                  className={`px-4 py-2 text-sm font-semibold border-r border-gray-300 dark:border-white/10 ${i === activeTestIndex ? "bg-white dark:bg-black text-purple-600 dark:text-purple-400" : "hover:bg-gray-100 dark:hover:bg-[#2a2a2a] text-gray-600 dark:text-gray-400"}`}
                >
                  Case {i + 1}
                </button>
              ))}
            </div>

            {testCases[activeTestIndex] && (
              <div className="p-4 space-y-3">
                <div className="flex justify-between">
                  <label className="block text-xs text-gray-500 dark:text-gray-400">Input</label>
                  <button onClick={() => handleDeleteTestCase(activeTestIndex)} className="text-red-500 text-xs flex items-center gap-1"><FaTrash /> Delete</button>
                </div>
                <textarea
                  className="w-full p-2 bg-gray-100 dark:bg-[#1e1e1e] text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-white/10 rounded resize-none"
                  rows={2}
                  value={testCases[activeTestIndex].input}
                  onChange={(e) => {
                    const updated = [...testCases];
                    updated[activeTestIndex].input = e.target.value;
                    setTestCases(updated);
                  }}
                />
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400">Expected Output</label>
                  <textarea
                    className="w-full p-2 bg-gray-100 dark:bg-[#1e1e1e] text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-white/10 rounded resize-none"
                    rows={1}
                    value={testCases[activeTestIndex].expected}
                    onChange={(e) => {
                      const updated = [...testCases];
                      updated[activeTestIndex].expected = e.target.value;
                      setTestCases(updated);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400">Your Output</label>
                  <pre className="bg-gray-100 dark:bg-[#1e1e1e] text-sm text-green-500 p-2 rounded max-h-20 overflow-auto whitespace-pre-wrap border border-gray-300 dark:border-white/10">
                    {DOMPurify.sanitize(testCases[activeTestIndex].output)}
                  </pre>
                  {testCases[activeTestIndex].passed !== null && (
                    <div className={`text-sm font-semibold ${testCases[activeTestIndex].passed ? "text-green-500" : "text-red-500"}`}>
                      {testCases[activeTestIndex].passed ? "✔ Passed" : "✘ Failed"}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Split>
      </Split>
    </div>
  );
}