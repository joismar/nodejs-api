const { DataTypes } = require("sequelize");
const { sequelize } = require("../config");

const tokenSchema = (sequelize, type) => {
  return sequelize.define(
    "token",
		{
			userId: {
				type: type.INTEGER,
        allowNull: false,
        references: {
          model: "usuario",
          key: "id",
        },
			},
			token: {
				type: type.STRING,
				allowNull: false,
			},
			tokenExpires : {
        type: type.DATE,
        defaultValue: Date.now() + 86400000
    	},
		},
    {
      timestamps: true,
      freezeTableName: true,
    }
  );
};

const Token = tokenSchema(sequelize, DataTypes);

module.exports = Token;