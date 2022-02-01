const { DataTypes } = require("sequelize");
const { sequelize } = require("../config");

const tamanhoSchema = (sequelize, type) => {
  return sequelize.define(
    "tamanho",
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

const Tamanho = tamanhoSchema(sequelize, DataTypes);

module.exports = Tamanho;
