const {BOT_NAME, PREFIX } = require("../config")

exports.waitmessage = "carregando dados..."

exports.menuMessage = () => {
    const date = new Date();

return `  ↪BEM VINDO!!↩
    ☐
    ☐ • Data: ${date.toLocaleDateString("pt-br")}
    ☐ • Hora ${date.toLocaleTimeString("pt-br")}
    ☐ • Prefixo: ${PREFIX}
    ☐ 
    ↪            {💫}             ↩

   ↪ADMINS↩
    ☐
    ☐ • ${PREFIX}ban
    ☐ 
    ↪            {⚽}             ↩

   ↪MENU↩
    ☐ • ${PREFIX}cep
    ☐ • ${PREFIX}gpt
    ☐ • ${PREFIX}ping
    ☐ • ${PREFIX}sticker
    ☐ • ${PREFIX}to-image
    ☐ 
    ↪            {🍓}             ↩
`




}

