const { PREFIX } = require("../../config");
const { gpt } = require("../../services/gpt");
require('dotenv').config();
const apiKey = process.env.OPENROUTER_API_KEY;
module.exports = {
    name: 'gpt',
    description: 'Comandos de inteligência artificial',
    commands: ['gpt', 'noc', 'bot'],
    usage: `${PREFIX}gpt quantos h tem em chorhinthias?`,

    handle: async ({ 
        sendSuccessReply, 
        sendErrorReply, 
        sendWaitReply, 
        args,
        userJid // <- mantém se precisar usar depois
    }) => {
        const text = args.join(" ").trim();

        if (!text) {
            return await sendErrorReply("Você precisa digitar algo!");
        }

        await sendWaitReply();

        try {
            const responseText = await gpt(text);
            await sendSuccessReply(responseText);
        } catch (err) {
            if (err.response?.status === 429) {
                await sendErrorReply("🚫 A API da OpenAI recusou a requisição (429: limite atingido). Tente novamente mais tarde.");
            } else {
                console.error("Erro ao chamar GPT:", err);
                await sendErrorReply("❌ Erro ao gerar resposta da IA.");
            }
        }
    }
};