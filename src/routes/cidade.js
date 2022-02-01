const express = require("express");
const router = express.Router();
const cidadeController = require("../controllers/cidade");

/**
@route GET cidades
@desc Retornar todas as cidades de um Estado
@access Public 
@endpoint http://localhost:porta/api/cidades/:estado_id
**/
router.get("/:estado_id", cidadeController.getByEstado);

module.exports = router;
