const dotenv = require("dotenv");
const Sequelize = require("sequelize");
const cloudinary = require("cloudinary").v2;

process.env.NODE_ENV = process.env.NODE_ENV || "development";

if (process.env.NODE_ENV == "development") {
  dotenv.config({ path: __dirname + "/./../../.env" });
}

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DBLOGIN,
  process.env.DBPASSWORD,
  {
    host: process.env.HOST,
    dialect: "postgres",
  }
);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

module.exports = {
  secret: process.env.SECRET,
  expiresIn: process.env.EXPIRESIN,
  stringConnection: process.env.DATABASE,
  port: process.env.PORT,
  sequelize: sequelize,
  uploader: cloudinary.uploader,
};
