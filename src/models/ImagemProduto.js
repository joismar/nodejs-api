const { DataTypes } = require("sequelize");
const { sequelize } = require("../config");

const imagemProdutoSchema = (sequelize, type) => {
  return sequelize.define(
    "imagem_produto",
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      produtoId: {
        type: type.INTEGER,
        allowNull: false,
        references: {
          model: "produto",
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

const imagemProduto = imagemProdutoSchema(sequelize, DataTypes);

module.exports = imagemProduto;
