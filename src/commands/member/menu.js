const {PREFIX} = require ("../../config")
const {menuMessage} = require("../../utils/message")


module.exports = {
    name: 'menu',
    description: 'Menu de Comandos',
    commands: ['menu', 'help'],
    usage: `${PREFIX}comando`,
    handle: async({sendReply, webMessage}) => {
           const nome = webMessage?.pushName || 'Desconhecido';
    const numero = webMessage?.key?.remoteJid || 'Sem número';
           console.log(`📜 /menu por ${nome} (${numero})`);
       await sendReply(`\n\n${menuMessage()}`)
    }
};
