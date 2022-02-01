const { DataTypes } = require("sequelize");
const { sequelize } = require("../config");

const cidadeSchema = (sequelize, type) => {
  return sequelize.define(
    "cidade",
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      estadoId: {
        type: type.INTEGER,
        allowNull: false,
        references: {
          model: "estado",
          key: "id",
        },
      },
      nome: { type: type.STRING, allowNull: false },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );
};

const Cidade = cidadeSchema(sequelize, DataTypes);

module.exports = Cidade;
