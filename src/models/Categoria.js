const { DataTypes } = require("sequelize");
const { sequelize } = require("../config");

const categoriaSchema = (sequelize, type) => {
  return sequelize.define(
    "categoria",
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nome: { type: type.STRING, allowNull: false },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );
};

const Categoria = categoriaSchema(sequelize, DataTypes);

module.exports = Categoria;
