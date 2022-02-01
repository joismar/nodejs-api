const express = require("express");
const router = express.Router();
const categoriaController = require("../controllers/categoria");
const userController = require("../controllers/user");

/* *** CATEGORIAS *** */
/**
@route POST categorias
@desc Criar uma nova categoria
@access Private 
@endpoint http://localhost:porta/api/admin/categorias/novo
**/
router.post("/categorias/novo", categoriaController.addCategoria);

/**
@route PUT categorias
@desc Atualizar uma categoria
@access Private 
@endpoint http://localhost:porta/api/admin/categorias/editar/:id
**/
router.put("/categorias/editar/:id", categoriaController.updateCategoria);

/**
@route DELETE categorias
@desc Deletar uma categoria pelo seu id
@access Private 
@endpoint http://localhost:porta/api/admin/categorias/deletar/:id
**/
router.delete("/categorias/deletar/:id", categoriaController.deleteCategoria);

/* *** USERS *** */

/**
@route GET usuários
@desc Retornar todos os usuários
@access Private 
@endpoint http://localhost:porta/api/admin/users
**/
//router.get("/users", userController.getAll);

/**
@route GET usuário por ID
@desc Retornar um único usuário por ID
@access Private 
@endpoint http://localhost:porta/api/admin/users/:id
**/
//router.get("/users/:id", userController.getById);

module.exports = router;
