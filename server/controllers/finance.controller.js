const axios = require("axios");

exports.getFinancialAdvice = async (req, res) => {
  try {
    const { income, savings, risk, goal, duration, language, text, translate } = req.body;

    let prompt = "";

    // 🔥 CASE 1: Translation (Hindi button click)
    if (translate) {
      prompt = `
Respond ONLY in Hindi.

Convert the entire text into Hindi language.

STRICT RULES:
- Only Hindi
- No English
- Keep format same

TEXT:
${text}
`;
    }

    // 🔥 CASE 2: Normal financial plan
    else {
      prompt = `
User details:
Monthly Income: ${income}
Monthly Savings: ${savings}
Risk: ${risk}
Goal: ${goal}
Duration: ${duration} years

IMPORTANT:
- Income and savings are MONTHLY values
- Convert yearly (multiply by 12)
- Use simple numbers

Create a PERSONALIZED financial plan in ${language === "hindi" ? "Hindi" : "English"}.

Format:

1. Current Situation:
- Show yearly savings

2. Better Investment Plan:
- Give exact monthly investment split

3. Growth Comparison:
- Normal saving total
- Investment growth approx

4. Final Advice:
- 2 short tips

Keep it short, numeric, and practical.
`;
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      }
    );

    const result = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    res.json({
      result: result || "No response from AI"
    });

  } catch (error) {
    const errData = error.response?.data;

    // 🔥 Gemini quota error detect
    if (errData?.error?.code === 429) {
      return res.status(429).json({
        error: "LIMIT_EXCEEDED"
      });
    }

    console.log("ERROR FULL:", errData || error.message);

    res.status(500).json({
      error: "Something went wrong"
    });
  }
};