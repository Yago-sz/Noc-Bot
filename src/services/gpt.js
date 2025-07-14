const axios = require("axios");
const { OPENROUTER_API_KEY } = require("../config");

exports.gpt = async (content) => {
    if (!OPENROUTER_API_KEY) {
        throw new Error("É necessário configurar OPENROUTER_API_KEY no seu config.js");
    }

    const messages = [
        {
            role: "system",
            content: 
            "Você responde sempre em português e com girias de carioca."
        },
        {
            role: "user",
            content: content
        }
    ];

    const { data } = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
            model: "openai/gpt-4o-mini", // ou "openai/gpt-4-turbo" se disponível
            messages: messages,
            max_tokens: 1000,
            temperature: 0.7
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${OPENROUTER_API_KEY}`
            }
        }
    );

    return data.choices[0].message.content;
};