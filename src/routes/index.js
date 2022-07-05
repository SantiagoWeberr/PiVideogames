const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const routerVideogames  = require( '../routes/VideogameRoute.js')
const routerGenre  = require( './GenreRoute')

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use('/videogames', routerVideogames)
router.use('/genre', routerGenre)

module.exports =  router;
