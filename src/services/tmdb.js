const axios = require('axios')
const API_KEY = process.env.TMDB_API_KEY

const seriesIds = [
  2316, // The Office
  1399, // Game of Thrones
  66732, // Stranger Things
  1396, // Breaking Bad
  94605, // Arcane
  1622, // Supernatural
  76479, // The Boys
  60574, // Peaky Blinders
  48891, // Brooklyn Nine-Nine 
  1402, // The Walking Dead
  100088, // The Last of Us
  71446, //la casa de papel
]

const getRandomSeries = async (userId, db) => {
  const avaliacoesDoUsuario = db.data.avaliacoes?.filter(a => a.user === userId) || []
  const idsAvaliados = avaliacoesDoUsuario.map(a => a.serie)

  // Filtra os IDs que o usuário ainda não viu
  const idsDisponiveis = seriesIds.filter(id => !idsAvaliados.includes(id))

  if (idsDisponiveis.length === 0) return null

  const randomId = idsDisponiveis[Math.floor(Math.random() * idsDisponiveis.length)]

  const url = `https://api.themoviedb.org/3/tv/${randomId}?api_key=${API_KEY}&language=pt-BR`
  const response = await axios.get(url)
  const data = response.data

  return {
    id: data.id,
    title: data.name,
    overview: data.overview,
    poster: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
    rating: data.vote_average,
    year: new Date(data.first_air_date).getFullYear()
  }
}

module.exports = { getRandomSeries }