const { findCommandImport } = require("../../utils");
const {PREFIX} = require ("../../config")

module.exports = {
    name: 'ping',
    description: 'verificar se o bot está online',
    commands: ['ping',],
    usage: `${PREFIX}ping`,
    handle: async({sendReply, sendReact}) => {
        await sendReact("❓");
        await sendReply("❓ ❓ ❓ INIMIGO DESAPARECIDO!!")
        //codigo do comando
    }
    
}
