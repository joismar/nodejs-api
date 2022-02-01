const { DataTypes } = require("sequelize");
const { sequelize } = require("../config");

const estadoSchema = (sequelize, type) => {
  return sequelize.define(
    "estado",
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sigla: { type: type.STRING, allowNull: false },
      nome: { type: type.STRING, allowNull: false },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );
};

const Estado = estadoSchema(sequelize, DataTypes);

module.exports = Estado;
