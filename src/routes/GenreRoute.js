const { Router } = require('express')
const {getGenre} = require('../controllers/GenreController')
const routerGenre = Router()


routerGenre.get('/getGenre', getGenre);

module.exports = routerGenre;