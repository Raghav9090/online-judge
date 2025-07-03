function DescriptionTab({ problem }) {
  return (
    <div className="text-gray-800 dark:text-gray-200">
      <h1 className="text-2xl font-bold mb-2">{problem.title}</h1>
      <p className="mb-4 text-gray-700 dark:text-gray-300">{problem.description}</p>

      <h3 className="font-semibold">Input</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{problem.inputFormat}</p>

      <h3 className="font-semibold">Output</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{problem.outputFormat}</p>

      <h3 className="font-semibold mt-4">Sample</h3>
      <pre className="bg-gray-100 text-gray-800 border border-gray-300 dark:bg-zinc-800 dark:text-gray-100 dark:border-gray-600 p-3 rounded text-sm whitespace-pre-line">
Input:
{problem.sampleInput}

Output:
{problem.sampleOutput}
      </pre>
    </div>
  );
}

export default DescriptionTab;
