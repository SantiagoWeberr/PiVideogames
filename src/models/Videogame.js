const { DataTypes, UUID, STRING, UUIDV4 } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('videogame', {
    id: {
      type: UUID,
      primaryKey: true,
      allowNull:false,
      // defaultValue: UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description:{
      type:DataTypes.STRING,
      allowNull:false,
    },
    released:{
      type:DataTypes.DATE,
    },
    rating:{
      type:DataTypes.INTEGER,
    },
    platforms:{
      type:DataTypes.STRING,
    },
  });
};
