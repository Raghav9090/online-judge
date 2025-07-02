const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { v4: uuid } = require("uuid");

const Problem = require("../models/Problem");
const Submission = require("../models/Submission");
const User = require("../models/User");          // 🆕 import User model

/* ---------- utility helpers ---------- */
const execPromise = (cmd) =>
  new Promise((resolve) => {
    exec(cmd, (error, stdout, stderr) => resolve({ error, stdout, stderr }));
  });

const cleanup = (jobId, dir, ext) => {
  const files = [
    `${jobId}.${ext}`,
    `${jobId}.exe`,
    `${jobId}.class`,
  ];
  files.forEach((f) => {
    const fp = path.join(dir, f);
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
  });
};
/* ------------------------------------- */

/* ============ RUN CODE (custom input) ============ */
exports.runCode = async (req, res) => {
  const { code, language = "cpp", input = "" } = req.body;
  if (!code) return res.status(400).json({ message: "Code is required" });

  const jobId = uuid();
  const tempDir = path.join(__dirname, "..", "temp");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  /* compiler / run commands */
  let fileExt, compileCmd, runCmd;
  switch (language) {
    case "cpp":
      fileExt = "cpp";
      compileCmd = `g++ ${jobId}.cpp -o ${jobId}.exe`;
      runCmd = `${jobId}.exe < ${jobId}.in`;
      break;
    case "c":
      fileExt = "c";
      compileCmd = `gcc ${jobId}.c -o ${jobId}.exe`;
      runCmd = `${jobId}.exe < ${jobId}.in`;
      break;
    case "python":
      fileExt = "py";
      compileCmd = "";
      runCmd = `python ${jobId}.py < ${jobId}.in`;
      break;
    case "java":
      fileExt = "java";
      compileCmd = `javac ${jobId}.java`;
      runCmd = `java ${jobId} < ${jobId}.in`;
      break;
    default:
      return res.status(400).json({ message: "Unsupported language" });
  }

  /* write temp files */
  fs.writeFileSync(path.join(tempDir, `${jobId}.${fileExt}`), code);
  fs.writeFileSync(path.join(tempDir, `${jobId}.in`), input);

  try {
    /* compile (if needed) */
    if (compileCmd) {
      const { error, stderr } = await execPromise(`cd ${tempDir} && ${compileCmd}`);
      if (error) {
        cleanup(jobId, tempDir, fileExt);
        return res.json({ success: false, error: stderr });
      }
    }

    /* run */
    const { stdout, stderr, error } = await execPromise(`cd ${tempDir} && ${runCmd}`);
    cleanup(jobId, tempDir, fileExt);

    if (error) return res.json({ success: false, error: stderr || "Runtime Error" });

    res.json({ success: true, output: stdout.trim() });
  } catch (err) {
    cleanup(jobId, tempDir, fileExt);
    res.status(500).json({ success: false, error: err.message });
  }
};

/* ===== SUBMIT CODE (all test cases + save submission) ===== */
exports.submitCode = async (req, res) => {
  const { code, language = "cpp" } = req.body;
  const { id } = req.params; // problem id
  if (!code) return res.status(400).json({ message: "Code is required" });

  const jobId = uuid();
  const tempDir = path.join(__dirname, "..", "temp");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  let fileExt, compileCmd, runTemplate;
  switch (language) {
    case "cpp":
      fileExt = "cpp";
      compileCmd = `g++ ${jobId}.cpp -o ${jobId}.exe`;
      runTemplate = `${jobId}.exe < {input}`;
      break;
    case "c":
      fileExt = "c";
      compileCmd = `gcc ${jobId}.c -o ${jobId}.exe`;
      runTemplate = `${jobId}.exe < {input}`;
      break;
    case "python":
      fileExt = "py";
      compileCmd = "";
      runTemplate = `python ${jobId}.py < {input}`;
      break;
    case "java":
      fileExt = "java";
      compileCmd = `javac ${jobId}.java`;
      runTemplate = `java ${jobId} < {input}`;
      break;
    default:
      return res.status(400).json({ message: "Unsupported language" });
  }

  /* write code file */
  fs.writeFileSync(path.join(tempDir, `${jobId}.${fileExt}`), code);

  try {
    /* compile */
    if (compileCmd) {
      const { error, stderr } = await execPromise(`cd ${tempDir} && ${compileCmd}`);
      if (error) {
        cleanup(jobId, tempDir, fileExt);
        return res.json({ success: false, verdict: "Compilation Error", error: stderr });
      }
    }

    /* fetch problem & run test cases */
    const problem = await Problem.findById(id);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    let passed = 0;
    const total = problem.testcases.length;

    for (let i = 0; i < total; i++) {
      const tc = problem.testcases[i];
      const inFile = path.join(tempDir, `${jobId}_${i}.in`);
      fs.writeFileSync(inFile, tc.input);

      const runCmd = runTemplate.replace("{input}", `${jobId}_${i}.in`);
      const { stdout, error } = await execPromise(`cd ${tempDir} && ${runCmd}`);

      if (!error && stdout.trim() === (tc.output || "").trim()) passed++;

      fs.unlinkSync(inFile);
    }

    cleanup(jobId, tempDir, fileExt);

    const verdict = passed === total ? "Accepted" : "Wrong Answer";

    /* save submission */
    await Submission.create({
      user: req.currUser,        // set by isLoggedIn middleware
      problem: id,
      code,
      language,
      verdict,
      passed,
      total,
    });

    /* update solvedProblems */
    if (verdict === "Accepted") {
      const user = await User.findById(req.currUser);
      if (!user.solvedProblems.includes(id)) {
        user.solvedProblems.push(id);
        await user.save();
      }
    }

    res.json({ success: true, verdict, passed, total });
  } catch (err) {
    console.error("Submit Error:", err.message);
    cleanup(jobId, tempDir, fileExt);
    res.status(500).json({ success: false, verdict: "Server Error", error: err.message });
  }
};
