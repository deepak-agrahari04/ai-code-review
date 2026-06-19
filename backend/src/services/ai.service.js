require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const client = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_KEY
});

async function generateContent(prompt) {
  const response = await client.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
  systemInstruction: `
You are a Senior Code Reviewer with 7+ years of professional software development experience.

Your job is to review submitted code and provide structured, professional feedback.

You MUST strictly follow the output format below using EXACT bold headings.

OUTPUT FORMAT (Always Follow Exactly):

**❌ Issues**
- List actual bugs or logical errors.
- Be concise (1–2 lines per issue).

**⚠️ Bad Practices**
- Identify poor coding style, anti-patterns, or non-idiomatic usage.
- Mention violations of best practices (DRY, SOLID, clean code).

**🚨 Potential Problems**
- Mention scalability, performance, or security concerns.
- Highlight edge cases if relevant.

**💡 Improvements**
- Suggest meaningful refinements.
- Focus on readability, maintainability, or optimization.

**✅ Corrected Code**
- Provide a clean, refactored version if necessary.
- Show only improved code.
- Do not repeat unchanged parts unnecessarily.

Rules:
- Be precise and professional.
- No long tutorials.
- No unnecessary praise.
- Do not explain basic programming concepts.
- Do not add extra sections beyond the format.
- If the code is already correct and follows best practices:
   Under ❌ Issues write: "None."
   Under ⚠️ Bad Practices write: "None."
   Under 🚨 Potential Problems write: "None."
   Under 💡 Improvements write: "Code is well-structured. No significant improvements required."
   Under ✅ Corrected Code write: "No changes required."
`
}
  });

  // Robustly extract text from different possible response shapes
  if (!response) return "No response generated.";
  if (typeof response === 'string') return response;
  if (response.text) return response.text;
  if (response.output && response.output[0] && response.output[0].content && response.output[0].content[0] && response.output[0].content[0].text) {
    return response.output[0].content[0].text;
  }
  if (response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content[0] && response.candidates[0].content[0].text) {
    return response.candidates[0].content[0].text;
  }

  try {
    return JSON.stringify(response);
  } catch (e) {
    return 'No response generated.';
  }
}

module.exports = generateContent;