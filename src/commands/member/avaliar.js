const getDB = require("../../database/db")

module.exports = {
  name: 'avaliar',
  description: 'Avalie a série que foi enviada',
  commands: ['avaliar', 'nota', 'a', 'n'],
  usage: '/avaliar 4',

  handle: async ({   msg,
  remoteJid,
  sendReply,
nome  }) => {
    console.log("🧪 msg:", JSON.stringify(msg, null, 2))

    const user = remoteJid
    const rawText =
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text ||
      msg.message?.buttonsResponseMessage?.selectedButtonId ||
      ''

    const notaTextoLimpa = rawText.trim().split(' ').pop() // pega o último valor
    const nota = Number(notaTextoLimpa)
    if (isNaN(nota) || nota < 0 || nota > 5) {
      await sendReply("⚠️ Envie uma nota válida de *0 a 5 estrelas*.")
      return
    }

    const db = await getDB()
    const pendente = db.data.pendentes?.find(p => p.user === user)

    if (!pendente) {
      await sendReply("📭 Você não tem nenhuma série pendente para avaliação.")
      return
    }

const serieId = pendente.serie
const titulo = pendente.titulo || 'Título desconhecido'

db.data.avaliacoes.push({ user, nome, serie: serieId, titulo, nota })
    db.data.pendentes = db.data.pendentes.filter(p => p.user !== user)
    await db.write()

    // ✅ Agora calcula a nova média já incluindo sua nota
    const avaliacoesDaSerie = db.data.avaliacoes.filter(a => a.serie === serieId)
    const novaMedia = (
      avaliacoesDaSerie.reduce((acc, cur) => acc + cur.nota, 0) / avaliacoesDaSerie.length
    ).toFixed(2)

    await sendReply(
      `✅ Sua avaliação de *${nota} estrelas* foi registrada!\n` +
      `📊 Nova média da série: *${novaMedia}* com ${avaliacoesDaSerie.length} votos.`
    )
  }
}