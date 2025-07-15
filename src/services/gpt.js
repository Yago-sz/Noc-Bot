const axios = require("axios");
const { API_KEY } = require('../config');

exports.gpt = async (content) => {
  if (!API_KEY) {
    throw new Error("É necessário configurar API_KEY no seu config.js");
  }

  const messages = [
    {
      role: "system",
      content: "Você responde sempre em português e com girias de carioca."
    },
    {
      role: "user",
      content: content
    }
  ];

  const { data } = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openai/gpt-4o-mini",
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7
    },
    {
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://nocbot.com",
        "X-Title": "Noc Bot"
      }
    }
  );

  return data.choices[0].message.content;
};