const { Videogame, Genre } = require("../db.js");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const { Op, UUID, INTEGER } = require("sequelize");
const db = require("../db.js");
const { API_KEY } = process.env;
const RUTA_GET_1 = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=40`;//40
const RUTA_GET_2 = `https://api.rawg.io/api/games?key=${API_KEY}&page=2&page_size=40`;//40
const RUTA_GET_3 = `https://api.rawg.io/api/games?key=${API_KEY}&page=3&page_size=20`;//20


const getVideogames = async (req, res) => {
  const { name } = req.query;
  console.log("req query console.log", req.query);
  if (!name) {
    try {
      const getDb = await Videogame.findAll({ include: Genre });

      const getApi1 = await axios.get(RUTA_GET_1);
      const getApi2 = await axios.get(RUTA_GET_2);
      const getApi3 = await axios.get(RUTA_GET_3);

      const resApi1 = await getApi1.data.results
      const resApi2 = await getApi2.data.results
      const resApi3 = await getApi3.data.results

      const getApi = resApi1.concat(resApi2,resApi3);

      if (getApi || getDb) {
        const responseApi = await getApi.map((g) => {
          return {
            id: g.id,
            name: g.name,
            image: g.background_image,
            genres: g.genres.map((g) => g.name),
            rating: g.rating_top,
          };
        });

        const responseAll = [...responseApi, ...getDb];

        // console.log(responseAll)
        return res.send(responseAll);
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    const nameDb = await Videogame.findAll({
      where: {
        name: { [Op.iLike]: `%${name}%` },
      },
      include: Genre,
    });
    const nameDbResponse = nameDb.map((n) => {
      return {
        id: n.id,
        name: n.name,
        description: n.description,
        date: n.date,
        rating: n.rating,
        platforms: n.platforms,
      };
    });
    const namesApi = await axios.get(
      `https://api.rawg.io/api/games?search=${name}&key=${API_KEY}`
    );
    const namesApiResponse = namesApi.data.results?.map((n) => {
      return {
        name: n.name,
        image: n.background_image,
        genres: n.genres.map((g) => g.name),
      };
    });
    const namesDbApi = nameDbResponse.concat(namesApiResponse);

    if (namesDbApi.length > 0) {
      return res.send(namesDbApi);
    } else {
      return res.json({ msg: "no se encontro el juego." });
    }
  }
};

const getVideogamesById = async (req, res) => {
  try {
    const idGame = req.params.idGame;
    console.log("params", req.params.idGame);
    if (idGame > 682815 || idGame < 0 || typeof idGame === uuidv4) {
      return res
        .status(400)
        .json({ msg: "no hay ningun juego con ese idGame" });
    } else if (idGame.includes("-")) {
      const dbId = await Videogame.findByPk(idGame, { include: Genre });
      console.log(dbId);

      const {
        id,
        name,
        genres,
        description,
        image,
        released,
        rating,
        platforms,
      } = dbId;

      const dateNow = released.toLocaleDateString();

      const platformNames = platforms.map((r) => r.platform.name); //esto lo hago para poder tener las plataformas en un string separados por coma.
      const platformsFinal = platformNames.join(", ");

      const map = {
        id,
        image,
        name: name,
        genre: genres.map((g) => g.name),
        description: description,
        released: dateNow,
        rating: Math.round(rating),
        platforms: platformsFinal,
      };

      if (!idGame) {
        return res.status(400).json({ msg: "no hay ningun juego con ese id" });
      }
      return res.send(map);
    } else {
      const idApi = await axios.get(
        `https://api.rawg.io/api/games/${idGame}?key=${API_KEY}`
      );

      const response = idApi.data;
      const {
        id,
        name,
        genres,
        description_raw,
        background_image,
        released,
        rating_top,
        platforms,
      } = response;

      const resp = {
        id: id,
        image: background_image,
        name: name,
        genres: genres.map((g) => g.name),
        description: description_raw,
        released: released,
        rating: rating_top,
        platforms: platforms.map((p) => p.platform.name),
      };
      if(resp){
        return res.send(resp)
      }else{
        return res.json({msg:"no se encontro el juego"})
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const getVideogameByName = async (req, res) => {
  const { name } = req.query;
  console.log(name);
  const namesApi = await axios.get(
    `https://api.rawg.io/api/games?search=${name}&key=${API_KEY}`
  );

  const response = namesApi.data.results?.map((n) => {
    return {
      name: n.name,
      image: n.background_image,
      genres: n.genres.map((g) => g.name),
    };
  });
  return res.send(response);
};

const postVideogame = async (req, res) => {
  const { name, description, released, rating, platforms, genre } = req.body;

  try {
    const [game, created] = await Videogame.findOrCreate({
      where: {
        id: uuidv4(),
        name: name,
        description: description,
        released: released,
        rating: rating,
        platforms: platforms,
      },
      includes: {
        genre: genre,
      },
    });
    // const game = await Videogame.create({
    //   id: uuidv4(),
    //   name,
    //   description,
    //   released,
    //   rating,
    //   platforms,

    // });

    await game.addGenres(genre);
    return res.send(game);
  } catch (error) {
    console.error(error);
  }
};

module.exports = { getVideogames, postVideogame, getVideogamesById, getVideogameByName};
