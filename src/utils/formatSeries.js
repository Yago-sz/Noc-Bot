const formatSeries = (serie, media, totalVotos) => {
  const nota = Number(media) || 0
  const estrelas = '⭐'.repeat(Math.round(nota)) || '✩'

  return `
📺 *${serie.title}* (${serie.year})
⭐ *Média dos usuários:* ${nota.toFixed(2)} / 5 (${totalVotos} votos)
📝 *Sinopse:* ${serie.overview}

responda com /avaliar 1/2/3/4/5 de 1 a 5 estrelas pra dar sua nota para a série!!!
`
}

module.exports = formatSeries