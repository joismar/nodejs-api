const { DataTypes } = require("sequelize");
const { sequelize } = require("../config");

const imagemPerfilSchema = (sequelize, type) => {
  return sequelize.define(
    "imagem_perfil",
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      usuarioId: {
        type: type.INTEGER,
        allowNull: false,
        references: {
          model: "usuario",
          key: "id",
        },
      },
      public_id: { type: type.STRING, allowNull: false },
      url: { type: type.STRING, allowNull: false },
      signature: { type: type.STRING, allowNull: false },
    },
    {
      timestamps: true,
      freezeTableName: true,
    }
  );
};

const ImagemPerfil = imagemPerfilSchema(sequelize, DataTypes);

module.exports = ImagemPerfil;
