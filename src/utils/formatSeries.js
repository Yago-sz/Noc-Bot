const formatSeries = (serie, media, totalVotos) => {
  const nota = Number(media) || 0
  const estrelas = '⭐'.repeat(Math.round(nota)) || '✩'

  return `
📺 *${serie.title}* (${serie.year})
⭐ *Média dos usuários:* ${nota.toFixed(2)} (${totalVotos} votos)
📝 *Sinopse:* ${serie.overview}

Responda com /avaliar 1/2/3/4/5 para dar sua nota de 1 a 5 estrelas ⭐
`
}

module.exports = formatSeries