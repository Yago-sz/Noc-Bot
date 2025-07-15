const { PREFIX } = require("../../config");
const { gpt } = require("../../services/gpt");

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
        userJid, // <- mantém se precisar usar depois
        webMessage
    }) => {
        const text = args.join(" ").trim();

        if (!text) {
            return await sendErrorReply("Você precisa digitar algo!");
        }

    const nome = webMessage?.pushName || 'Desconhecido';
    const numero = userJid || 'Sem número';

    console.log(`🗣️ /gpt por ${nome} (${numero}) | Pergunta: "${text}"`);

        await sendWaitReply();

        try {
            const responseText = await gpt(text);
            await sendSuccessReply(responseText);

             console.log(`🤖 Resposta da IA: "${responseText}"`);
        } catch (err) {
            if (err.response?.status === 429) {
                await sendErrorReply("🚫 A API da OpenAI recusou a requisição (429: limite atingido). Tente novamente mais tarde.");
            } else {
                console.error("Erro ao chamar GPT:", err);
               await sendErrorReply("❌ Erro ao gerar resposta da IA: " + (err.response?.data?.error || err.message));

            }
        }
    }
};