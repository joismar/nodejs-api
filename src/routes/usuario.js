const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const imageController = require("../controllers/imagem");
const multerUpload = require("../middlewares/multerUpload");

/**
@route PUT usuário
@desc Atualizar um usuário
@access Private 
@endpoint http://localhost:porta/api/usuario/editar?id=<USER_ID>
**/
router.put("/editar", 
  multerUpload.userStorage,
  userController.atualizarUser,
  imageController.uploadImagemUsuario,
);

/**
@route DELETE usuários
@desc Deletar um usuário pelo seu id
@access Private 
@endpoint http://localhost:porta/api/usuario/deletar?id=<USER_ID>
**/
router.delete("/deletar", userController.deletarUser);

/**
@route GET usuário por ID
@desc Retornar um usuário por ID
@access Private 
@endpoint http://localhost:porta/api/usuario?id=<USER_ID>
**/
router.get("/", userController.getById);

/**
@route POST imagem usuario
@desc Faz upload da imagem do usuário
@access Private 
@endpoint http://localhost:porta/api/usuario/imagem/upload
**/
router.post(
  "/imagem/upload",
  multerUpload.userStorage,
  imageController.uploadImagemUsuario,
);

/**
@route DELETE imagem usuario
@desc Remove imagem do usuario
@access Private 
@endpoint http://localhost:porta/api/usuario/imagem/delete
**/
router.delete("/imagem/delete", imageController.deleteImagemUsuario);

module.exports = router;
