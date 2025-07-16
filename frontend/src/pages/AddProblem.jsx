import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function AddProblem() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    inputFormat: "",
    outputFormat: "",
    sampleInput: "",
    sampleOutput: "",
    difficulty: "Easy",
    tags: "",
    starterCode: { cpp: "", python: "", java: "", c: "" },
    testcases: [{ input: "", output: "", visible: false }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleStarterCodeChange = (lang, value) => {
    setForm((prev) => ({
      ...prev,
      starterCode: { ...prev.starterCode, [lang]: value },
    }));
  };

  const handleTestcaseChange = (index, field, value) => {
    const newTestcases = [...form.testcases];
    newTestcases[index][field] = field === "visible" ? value : value;
    setForm({ ...form, testcases: newTestcases });
  };

  const addTestcase = () => {
    setForm((prev) => ({
      ...prev,
      testcases: [...prev.testcases, { input: "", output: "", visible: false }],
    }));
  };

  const removeTestcase = (index) => {
    const updated = form.testcases.filter((_, i) => i !== index);
    setForm({ ...form, testcases: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()),
      };
      await axios.post("http://3.111.39.120:5000/api/createproblem", payload, {
        withCredentials: true,
      });
      toast.success("✅ Problem added successfully!");
      setForm({
        title: "",
        description: "",
        inputFormat: "",
        outputFormat: "",
        sampleInput: "",
        sampleOutput: "",
        difficulty: "Easy",
        tags: "",
        starterCode: { cpp: "", python: "", java: "", c: "" },
        testcases: [{ input: "", output: "", visible: false }],
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add problem");
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-100 dark:bg-zinc-900 text-black dark:text-white">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white dark:bg-zinc-800 p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">📝 Add New Problem</h2>

        {/* Problem Fields */}
        {[
          { name: "title", label: "Title" },
          { name: "description", label: "Description", type: "textarea" },
          { name: "inputFormat", label: "Input Format", type: "textarea" },
          { name: "outputFormat", label: "Output Format", type: "textarea" },
          { name: "sampleInput", label: "Sample Input", type: "textarea" },
          { name: "sampleOutput", label: "Sample Output", type: "textarea" },
        ].map(({ name, label, type }) => (
          <div key={name} className="mb-4">
            <label className="block mb-1 font-medium">{label}</label>
            {type === "textarea" ? (
              <textarea
                name={name}
                value={form[name]}
                onChange={handleChange}
                className="w-full p-3 font-mono border border-gray-300 dark:border-gray-600 rounded dark:bg-[#2a2a2a] text-black dark:text-white"
                rows="3"
              />
            ) : (
              <input
                name={name}
                value={form[name]}
                onChange={handleChange}
                className="w-full p-3 font-mono border rounded dark:bg-zinc-700"
              />
            )}
          </div>
        ))}

        {/* Difficulty */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Difficulty</label>
          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            className="w-full p-2 border rounded dark:bg-zinc-700"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        {/* Tags */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Tags (comma-separated)</label>
          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            className="w-full p-2 border rounded dark:bg-zinc-700"
          />
        </div>

        {/* Starter Code */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">Starter Code</label>
          {["cpp", "python", "java", "c"].map((lang) => (
            <div key={lang} className="mb-3">
              <label className="block mb-1 capitalize">{lang}</label>
              <textarea
                rows="3"
                value={form.starterCode[lang]}
                onChange={(e) => handleStarterCodeChange(lang, e.target.value)}
                className="w-full p-3 font-mono border border-gray-300 dark:border-gray-600 rounded dark:bg-[#2a2a2a] text-black dark:text-white"
              />
            </div>
          ))}
        </div>

        {/* Testcases */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">Testcases</label>
          {form.testcases.map((tc, index) => (
            <div
              key={index}
              className="mb-4 border rounded-lg p-4 bg-white dark:bg-[#1e1e1e] shadow-sm transition-all"
            >
              <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
                Input
              </label>
              <textarea
                rows="2"
                value={tc.input}
                onChange={(e) => handleTestcaseChange(index, "input", e.target.value)}
                className="w-full p-3 font-mono rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#2a2a2a] text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                placeholder="e.g., 5\n2 3 -2 4 -1"
              />
              <label className="block mt-3 mb-1 font-semibold text-gray-700 dark:text-gray-300">
                Output
              </label>
              <textarea
                rows="2"
                value={tc.output}
                onChange={(e) => handleTestcaseChange(index, "output", e.target.value)}
                className="w-full p-3 font-mono rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#2a2a2a] text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                placeholder="e.g., 4"
              />
              <label className="flex items-center gap-2 mt-3 text-sm">
                <input
                  type="checkbox"
                  checked={tc.visible}
                  onChange={(e) => handleTestcaseChange(index, "visible", e.target.checked)}
                />
                <span className="text-gray-600 dark:text-gray-300">Visible to users</span>
              </label>
              {form.testcases.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTestcase(index)}
                  className="text-red-500 text-sm mt-2 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addTestcase}
            className="mt-2 text-blue-500 hover:text-blue-600 font-medium transition"
          >
            ➕ Add Testcase
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-medium transition"
        >
          Submit Problem
        </button>
      </form>
    </div>
  );
}

export default AddProblem;
