const axios = require('axios')
const API_KEY = process.env.TMDB_API_KEY

const seriesIds = [1396, 2316, 1399, 82856, 1434, 1418, 2734, 60625, 1100]

const getRandomSeries = async () => {
  const randomId = seriesIds[Math.floor(Math.random() * seriesIds.length)]

  const url = `https://api.themoviedb.org/3/tv/${randomId}?api_key=${API_KEY}&language=pt-BR`
  const response = await axios.get(url)
  const data = response.data

  return {
    id: data.id,
    title: data.name,
    overview: data.overview,
    poster: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
    rating: data.vote_average
  }
}

module.exports = { getRandomSeries }