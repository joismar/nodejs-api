const express = require("express");
const router = express.Router();
const loginController = require("../controllers/login");
const multerUpload = require("../middlewares/multerUpload");
const imageController = require("../controllers/imagem");

/**
@route POST login user
@desc Fazer login
@access Public 
@endpoint http://localhost:porta/api/signin
**/
router.post("/signin", loginController.accessToken);

/**
@route POST usuários
@desc Criar um novo usuário
@access Public 
@endpoint http://localhost:porta/api/signup
**/
router.post("/signup", 
	multerUpload.userStorage,
	loginController.signup,
	imageController.uploadImagemUsuario,
);

/**
@route POST requisição de redefinição de senha
@desc Cria uma requisição de redefinição de senha e manda um email com o token
@access Public 
@endpoint http://localhost:porta/api/reset-password
**/
router.post("/reset-password", loginController.resetPasswordRequestController);

/**
@route POST requisição de redefinição de senha
@desc Cria uma requisição de redefinição de senha e manda um email com o token
@access Public 
@endpoint http://localhost:porta/api/reset-password
**/
router.post("/password-reset", loginController.resetPasswordController);

module.exports = router;
