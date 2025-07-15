const axios = require('axios')
const API_KEY = process.env.TMDB_API_KEY

const seriesIds = [1396,
    2316, //the office
    1399, //game of thrones
    66732, //stranget things
    1396, //breaking bad
    94605, //arcane
    1622, //Supernatural
    76479, //the boys
    60574, //peaky blinders
    48891, //brooklyn nine nine 
    1402, // the walking dead
    100088, //the last of us
        
        
        ]




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