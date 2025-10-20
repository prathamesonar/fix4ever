require("dotenv").config();
const axios = require("axios");

const getSuggestions = async (req, res) => {
  const { description } = req.body;
  if (!description || description.trim().length < 10) {
    return res.status(400).json({ message: "Please provide a longer description (min 10 chars)." });
  }

  try {
    const apiKey = process.env.SARVAM_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "Server config error: missing Sarvam API key." });
    }

    const endpoint = "https://api.sarvam.ai/v1/chat/completions";
    const payload = {
      model: "sarvam-m",
      messages: [
        { role: "system", content: "You are an assistant that reads a home service request description and outputs only JSON with keys category, estimatedDuration, estimatedPrice, isUrgent." },
        { role: "user", content: description }
      ],
      temperature: 0.2,
      max_tokens: 200
    };

    const response = await axios.post(endpoint, payload, {
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": apiKey
      }
    });

    const aiText = response.data?.choices?.[0]?.message?.content?.trim();
    if (!aiText) {
      throw new Error("No content from Sarvam API");
    }

    const cleaned = aiText.replace(/```json|```/g, "").trim();
    let parsed = {};
    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error(" Failed to parse Sarvam response:", aiText, err);
    }

    const result = {
      suggestedCategory: parsed.category || "General Repair",
      estimatedDuration: parsed.estimatedDuration || "1-2 hours",
      estimatedPrice: parsed.estimatedPrice || "₹100-₹200",
      isUrgent: parsed.isUrgent === true
    };

    return res.json(result);

  } catch (error) {
    console.error(" Sarvam AI Error:", error.message);
    return res.status(500).json({
      suggestedCategory: "General Repair",
      estimatedDuration: "1-2 hours",
      estimatedPrice: "₹100-₹200",
      isUrgent: false,
      message: `AI suggestion failed: ${error.message}`
    });
  }
};

module.exports = { getSuggestions };
