const express = require("express");
const router = express.Router();
const categoriaController = require("../controllers/categoria");

/**
@route GET categorias
@desc Retornar todas as categorias
@access Public 
@endpoint http://localhost:porta/api/categorias
**/
router.get("/", categoriaController.getAll);

module.exports = router;
