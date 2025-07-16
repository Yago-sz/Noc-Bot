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
console.log(`📝 Comando recebido de ${user}: ${msg.message?.conversation || msg.body}`)
    const db = await getDB()

  const serie = await getRandomSeries(user, db)

    if (!serie) {
      await sendReply("🎬 Você já avaliou todas as séries disponíveis!")
      return
    }

const avaliacoesDaSerie = db.data.avaliacoes.filter(a => a.serie === serie.id)
const totalVotos = avaliacoesDaSerie.length
const media = await calcularMediaPorSerie(serie.id, db)
const texto = formatarTextoDaSerie(serie, media, totalVotos)

    await socket.sendMessage(remoteJid, {
      image: { url: serie.poster },
      text: texto
    })

    await sendSucessReact()
    await registrarSeriePendente(user, serie.id, serie.title,db)
    await db.write()
  }
}