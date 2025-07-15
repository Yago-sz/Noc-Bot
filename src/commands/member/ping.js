const { findCommandImport } = require("../../utils");
const {PREFIX} = require ("../../config")

module.exports = {
    name: 'ping',
    description: 'verificar se o bot está online',
    commands: ['ping',],
    usage: `${PREFIX}ping`,
    handle: async({sendReply, sendReact,webMessage}) => {
        

        
        await sendReact("❓");
      const nome = webMessage?.pushName || 'Desconhecido';
    const numero = webMessage?.key?.remoteJid || 'Sem número';
           console.log(`❔ /Ping por ${nome} (${numero})`);
        await sendReply("❓ ❓ ❓ INIMIGO DESAPARECIDO!!")
        //codigo do comando

        
    }


    
}
