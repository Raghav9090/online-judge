require("dotenv").config();
const axios = require("axios");

exports.getHint = async (req, res) => {
  const { code, language, problemTitle } = req.body;

  if (!language || !problemTitle) {
    return res.status(400).json({ error: "Missing language or problemTitle." });
  }

  const prompt = `
You are a helpful AI coding assistant on an online judge platform.

The student is working on a problem titled: "${problemTitle}" using "${language}".

They have written this partial code:
\`\`\`${language}
${code || "// no code yet"}
\`\`\`

Give the next helpful **code snippet** that the student should add. DO NOT give explanations. DO NOT describe the code. JUST return the code snippet inside a code block.
`;

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.GEMINI_API_KEY,
        }
      }
    );

    const fullText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Extract first code block if formatted
    const match = fullText.match(/```(?:\w+)?\n([\s\S]*?)```/);
    const cleanHint = match ? match[1] : fullText;

    res.status(200).json({ hint: cleanHint.trim() || "Sorry, no code hint available." });
  } catch (err) {
    console.error("Gemini AI Error:", err?.response?.data || err.message);
    res.status(500).json({ error: "Failed to get hint from Gemini." });
  }
};
