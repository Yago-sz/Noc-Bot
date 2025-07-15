const { PREFIX } = require ("../../config")
const {getRandomSeries} = require('../../services/tmdb')
const formatarTextoDaSerie = require('../../utils/formatSeries')
const { registrarSeriePendente, calcularMediaPorSerie } = require('../../services/ratingManager')
const getDB = require("../../database/db") // ✅ Corrigido

module.exports = {
  name: 'serie',
  description: 'Dê uma nota para a respectiva série',
  commands: ['n', 'serie'],
  usage: `${PREFIX}comando`,

  handle: async ({ socket, msg, sendReply, remoteJid, sendSucessReact, nome }) => {
    const user = msg?.key?.remoteJid || remoteJid

    const db = await getDB()

    const serie = await getRandomSeries()

    if (!serie) {
      await sendReply("🎬 Você já avaliou todas as séries disponíveis!")
      return
    }

    const media = await calcularMediaPorSerie(serie.id, db)
    const texto = formatarTextoDaSerie(serie, media)

    await socket.sendMessage(remoteJid, {
      image: { url: serie.poster },
      text: texto
    })

    await sendSucessReact()
    await registrarSeriePendente(user, serie.id, serie.title,db)
    await db.write()
  }
}