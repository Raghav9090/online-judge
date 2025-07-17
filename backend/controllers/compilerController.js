/* controllers/compilerController.js */
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { v4: uuid } = require("uuid");

const Problem = require("../models/Problem");
const Submission = require("../models/Submission");
const User = require("../models/User");

/* ---------- helpers ---------- */
const execPromise = (cmd) =>
  new Promise((resolve) => {
    exec(cmd, { timeout: 5000 }, (error, stdout, stderr) =>
      resolve({ error, stdout, stderr })
    );
  });

const cleanup = (jobId, dir, ext) => {
  const extra = [".exe", ".class"];
  [`.${ext}`, ...extra].forEach((suf) => {
    const fp = path.join(dir, `${jobId}${suf}`);
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
  });
};

const normalize = (str = "") =>
  str.toString().replace(/\r?\n|\r/g, "").trim();
/* -------------------------------- */

/*============ RUN CODE (custom input) ============*/
exports.runCode = async (req, res) => {
  const { code, language = "cpp", input = "" } = req.body;
  if (!code) return res.status(400).json({ message: "Code is required" });

  const jobId = uuid();
  const dir = path.join(__dirname, "..", "temp");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  /* build per‑language commands */
  let ext, compileCmd, runCmd;
  switch (language) {
    case "cpp":
      ext = "cpp";
      compileCmd = `g++ ${jobId}.cpp -o ${jobId}.exe`;
      runCmd = `timeout 5s ./${jobId}.exe < ${jobId}.in`;
      break;
    case "c":
      ext = "c";
      compileCmd = `gcc ${jobId}.c -o ${jobId}.exe`;
      runCmd = `timeout 5s ./${jobId}.exe < ${jobId}.in`;
      break;
    case "python":
      ext = "py";
      compileCmd = ""; // interpreted
      runCmd = `timeout 5s python3 ${jobId}.py < ${jobId}.in`;
      break;
    case "java":
      ext = "java";
      compileCmd = `javac ${jobId}.java`;
      runCmd = `timeout 5s java ${jobId} < ${jobId}.in`;
      break;
    default:
      return res.status(400).json({ message: "Unsupported language" });
  }

  /* write temp files */
  fs.writeFileSync(path.join(dir, `${jobId}.${ext}`), code);
  fs.writeFileSync(path.join(dir, `${jobId}.in`), input);

  try {
    /* compile (if applicable) */
    if (compileCmd) {
      const { error, stderr } = await execPromise(`cd ${dir} && ${compileCmd}`);
      if (error) {
        cleanup(jobId, dir, ext);
        return res.json({ success: false, error: stderr || "Compilation Error" });
      }
    }

    /* run */
    const { stdout, stderr, error } = await execPromise(`cd ${dir} && ${runCmd}`);
    cleanup(jobId, dir, ext);

    if (error) {
      const isTimeout = error.killed || /timeout/.test(stderr);
      return res.json({
        success: false,
        error: isTimeout ? "Execution timed out. Possible infinite loop." : stderr || "Runtime Error"
      });
    }

    res.json({ success: true, output: stdout.trim() });
  } catch (err) {
    cleanup(jobId, dir, ext);
    res.status(500).json({ success: false, error: err.message });
  }
};

/*====== SUBMIT CODE (test‑cases + save) ======*/
exports.submitCode = async (req, res) => {
  const { code, language = "cpp" } = req.body;
  const { id: problemId } = req.params;
  if (!code) return res.status(400).json({ message: "Code is required" });

  const jobId = uuid();
  const dir = path.join(__dirname, "..", "temp");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  let ext, compileCmd, runTemplate;
  switch (language) {
    case "cpp":
      ext = "cpp";
      compileCmd = `g++ ${jobId}.cpp -o ${jobId}.exe`;
      runTemplate = `timeout 5s ./${jobId}.exe < {input}`;
      break;
    case "c":
      ext = "c";
      compileCmd = `gcc ${jobId}.c -o ${jobId}.exe`;
      runTemplate = `timeout 5s ./${jobId}.exe < {input}`;
      break;
    case "python":
      ext = "py";
      compileCmd = "";
      runTemplate = `timeout 5s python3 ${jobId}.py < {input}`;
      break;
    case "java":
      ext = "java";
      compileCmd = `javac ${jobId}.java`;
      runTemplate = `timeout 5s java ${jobId} < {input}`;
      break;
    default:
      return res.status(400).json({ message: "Unsupported language" });
  }

  fs.writeFileSync(path.join(dir, `${jobId}.${ext}`), code);

  try {
    /* compile */
    if (compileCmd) {
      const { error, stderr } = await execPromise(`cd ${dir} && ${compileCmd}`);
      if (error) {
        cleanup(jobId, dir, ext);
        return res.json({ success: false, verdict: "Compilation Error", error: stderr });
      }
    }

    /* get problem + run tests */
    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    let passed = 0;
    const total = problem.testcases.length;

    for (let i = 0; i < total; i++) {
      const tc = problem.testcases[i];
      const inFile = path.join(dir, `${jobId}_${i}.in`);
      fs.writeFileSync(inFile, tc.input);

      const runCmd = runTemplate.replace("{input}", `${jobId}_${i}.in`);
      const { stdout, stderr, error } = await execPromise(`cd ${dir} && ${runCmd}`);

      if (!error && normalize(stdout) === normalize(tc.output)) passed++;

      fs.unlinkSync(inFile);
    }

    cleanup(jobId, dir, ext);

    const verdict = passed === total ? "Accepted" : "Wrong Answer";

    /* store submission */
    await Submission.create({
      user: req.currUser,
      problem: problemId,
      code,
      language,
      verdict,
      passed,
      total,
    });

    /* mark as solved */
    if (verdict === "Accepted") {
      await User.findByIdAndUpdate(req.currUser, {
        $addToSet: { solvedProblems: problemId },
      });
    }

    res.json({ success: true, verdict, passed, total });
  } catch (err) {
    console.error("Submit Error:", err.message);
    cleanup(jobId, dir, ext);
    res.status(500).json({
      success: false,
      verdict: "Server Error",
      error: err.message,
    });
  }
};
