const { findCommandImport } = require("../../utils")
const { PREFIX } = require ("../../config")
const getDB = require('../../database/db')

module.exports = {
  name: 'ping',
  description: 'verificar se o bot está online',
  commands: ['ping'],
  usage: `${PREFIX}ping`,

  handle: async ({ sendReply, sendReact, webMessage }) => {
    const db = await getDB() // já vem lido e com dados padrão

    await sendReact("❓")

    const nome = webMessage?.pushName || 'Desconhecido'
    const numero = webMessage?.key?.remoteJid || 'Sem número'

    console.log(`❔ /Ping por ${nome} (${numero})`)
    await sendReply("❓ ❓ ❓ INIMIGO DESAPARECIDO!!")
  }
}
