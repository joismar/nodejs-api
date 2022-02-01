const { DataTypes } = require("sequelize");
const { sequelize } = require("../config");

const produtoSchema = (sequelize, type) => {
  return sequelize.define(
    "produto",
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      public_id: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      titulo: { type: type.STRING, allowNull: false },
      descricao: {
        type: type.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [1, 350],
            msg: "A descrição pode ter, no máximo, 350 caracteres.",
          },
        },
      },
      condicao: { type: type.STRING, allowNull: false },
      marca: { type: type.STRING, allowNull: false },
      tamanhoId: {
        type: type.INTEGER,
        allowNull: false,
        references: {
          model: "tamanho",
          key: "id",
        },
      },
      peso: { type: type.FLOAT, allowNull: true },
      formatoId: {
        type: type.INTEGER,
        allowNull: false,
        references: {
          model: "formato",
          key: "id",
        },
      },
      categoriaId: {
        type: type.INTEGER,
        allowNull: false,
        references: {
          model: "categoria",
          key: "id",
        },
      },
      valor: { type: type.FLOAT, allowNull: false },
      cidadeId: {
        type: type.INTEGER,
        allowNull: false,
        references: {
          model: "cidade",
          key: "id",
        },
      },
      userId: {
        type: type.INTEGER,
        allowNull: false,
        references: {
          model: "usuario",
          key: "id",
        },
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
      hooks: {
        beforeValidate(produto, options) {
          produto.public_id =
            produto.titulo.replace(/[^a-zA-Z0-9]/g, "-").replace(/[-]+/g, "-") +
            `-${Math.random().toString(32).substring(2, 12)}`;
        },
      },
    }
  );
};

const Produto = produtoSchema(sequelize, DataTypes);

// Produto.beforeValidate(async (produto, options) => {
//   produto.public_id =
//     (await produto.titulo.replace(/[^a-zA-Z0-9]/g, "-")) +
//     `-${hash(produto.id)}`;
// });

module.exports = Produto;
