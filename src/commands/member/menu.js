const {PREFIX} = require ("../../config")
const {menuMessage} = require("../../utils/message")


module.exports = {
    name: 'menu',
    description: 'Menu de Comandos',
    commands: ['menu', 'help'],
    usage: `${PREFIX}comando`,
    handle: async({sendReply}) => {
       await sendReply(`\n\n${menuMessage()}`)
    }
};
