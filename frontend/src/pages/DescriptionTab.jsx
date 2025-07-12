// DescriptionTab.jsx
function DescriptionTab({ problem }) {
  return (
    <div className="p-6 text-gray-900 dark:text-gray-200 bg-white dark:bg-[#0f0f0f]">
      <h1 className="text-3xl font-bold mb-4 text-black dark:text-white">
        {problem.title}
      </h1>

      <section className="mb-6">
        
        <p className="text-gray-800 dark:text-gray-300 leading-relaxed">
          {problem.description}
        </p>
      </section>

      <section className="mb-4">
        <h3 className="text-md font-semibold text-blue-600 dark:text-blue-400">Input Format</h3>
        <p className="text-sm text-gray-700 dark:text-gray-400 mt-1">
          {problem.inputFormat}
        </p>
      </section>

      <section className="mb-4">
        <h3 className="text-md font-semibold text-blue-600 dark:text-blue-400">Output Format</h3>
        <p className="text-sm text-gray-700 dark:text-gray-400 mt-1">
          {problem.outputFormat}
        </p>
      </section>

      <section className="mt-6">
        <h3 className="text-md font-semibold text-green-600 dark:text-green-400 mb-2">Sample</h3>
        <div className="bg-gray-100 dark:bg-zinc-900 border border-gray-300 dark:border-gray-600 p-4 rounded text-sm">
          <p className="text-gray-800 dark:text-gray-300 whitespace-pre-line">
            <span className="block font-semibold text-gray-600 dark:text-gray-400">Input:</span>
            {problem.sampleInput}
            <br />
            <span className="block mt-2 font-semibold text-gray-600 dark:text-gray-400">Output:</span>
            {problem.sampleOutput}
          </p>
        </div>
      </section>
    </div>
  );
}

export default DescriptionTab;
