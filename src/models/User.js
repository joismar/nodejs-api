const { DataTypes } = require("sequelize");
const { sequelize } = require("../config");

const userSchema = (sequelize, type) => {
  return sequelize.define(
    "usuario",
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      usuario: { type: type.STRING, allowNull: false },
      email: {
        type: type.STRING,
        allowNull: false,
        validate: {
          isEmail: {
            msg: "Email inválido!",
          },
        },
      },
      senha: { type: type.STRING, allowNull: false },
      nome: { type: type.STRING, allowNull: false },
      sobrenome: { type: type.STRING, allowNull: false },
      cpf: { type: type.BIGINT, allowNull: false },
      cidadeId: {
        type: type.INTEGER,
        allowNull: false,
        references: {
          model: "cidade",
          key: "id",
        },
      },
      telefone: { type: type.STRING, allowNull: false },
      tipo: { type: type.INTEGER, allowNull: false, defaultValue: 2 }, // tipo 1 = adm , tipo 2 = usuário comum
    },
    {
      timestamps: true,
      freezeTableName: true,
    }
  );
};

const User = userSchema(sequelize, DataTypes);

module.exports = User;
