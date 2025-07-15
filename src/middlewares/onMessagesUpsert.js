const { LoadCommomFunctions } = require('../utils/LoadCommomFunctions');
const { dynamicCommand } = require("../utils/dynamicCommand");

exports.OnMessagesUpsert = async ({ socket, messages }) => {
    if (!messages.length) return;

    const webMessage = messages[0];

    // 🧠 Capturando nome e número do remetente
    const nome = webMessage.pushName;
    const numero = webMessage.key?.remoteJid;   

    const commomFunctions = LoadCommomFunctions({ socket, webMessage });

    await dynamicCommand({
        ...commomFunctions,
        msg: webMessage // ✅ Adicionado para evitar erro no comando /avaliar
    });
};