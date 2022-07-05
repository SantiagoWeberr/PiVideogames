const axios = require("axios")
const { Genre } = require("../db")
const {API_KEY} = process.env;
const RUTA_GENRE = `https://api.rawg.io/api/genres?key=${API_KEY}`;


const getGenre = async (req, res) => {
    const getGenre = await axios.get(RUTA_GENRE)
    const response = await getGenre.data.results?.map((g)=>{
        return {
            id: g.id,
            name:g.name,
        }
    })

    return res.send(response);
}

module.exports = { getGenre }