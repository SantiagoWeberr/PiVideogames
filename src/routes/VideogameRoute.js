const { Router } = require("express");
const {
  getVideogames,
  postVideogame,
  getVideogamesById
} = require("../controllers/VideogameController");

const routerVideogames = Router();

routerVideogames.get("/getVideogames", getVideogames);
routerVideogames.get("/getVideogames/:idGame", getVideogamesById);
routerVideogames.post("/postVideogames", postVideogame);

module.exports = routerVideogames;
