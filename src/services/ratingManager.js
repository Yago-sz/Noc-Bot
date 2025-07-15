async function calcularMediaPorSerie(serieId, db) {
  const avaliacoesDaSerie = db.data.avaliacoes.filter(a => a.serie === serieId)

  if (avaliacoesDaSerie.length === 0) return 0

  const soma = avaliacoesDaSerie.reduce((acc, cur) => acc + cur.nota, 0)
  return soma / avaliacoesDaSerie.length
}
async function registrarSeriePendente(userId, serieId, serieTitulo, db) {
  db.data.pendentes = db.data.pendentes || []
  db.data.pendentes.push({ user: userId, serie: serieId, titulo: serieTitulo })
}
module.exports = { registrarSeriePendente, calcularMediaPorSerie }