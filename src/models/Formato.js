const { DataTypes } = require("sequelize");
const { sequelize } = require("../config");

const formatoSchema = (sequelize, type) => {
  return sequelize.define(
    "formato",
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

const Formato = formatoSchema(sequelize, DataTypes);

module.exports = Formato;
