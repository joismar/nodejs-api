const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const produtoController = require("../controllers/produto");
const criaSenhaController = require("../controllers/criasenha");

/**
 * Rotas públicas de USUÁRIO
 */

/**
@route GET usuário por NOME DE USUARIO
@desc Retornar um usuário por NOME DE USUARIO
@access Public 
@endpoint http://localhost:porta/api/publico/perfil/:usuario
**/
router.get("/perfil/:usuario", userController.getByUsername);

/**
 * Rotas públicas de PRODUTO
 */

/**
@route GET produtos
@desc Retornar todos os produtos
@access Public 
@endpoint http://localhost:porta/api/publico/produtos
**/
router.get("/produtos", produtoController.getAll);

/**
@route GET produto por PUBLIC_ID
@desc Retornar um produto por PUBLIC_ID
@access Public 
@endpoint http://localhost:porta/api/publico/produto/:public_id
**/
router.get("/produto/:public_id", produtoController.getByPublicId);

/**
@route GET produtos por username
@desc Retornar produtos por username
@access Public 
@endpoint http://localhost:porta/api/publico/produtos/usuario/:username
**/
router.get("/produtos/usuario/:username", produtoController.getByUsuario);

/**
@route POST cria senha usuario migrado
@desc Cria senha para usuários migrados
@access Public 
@endpoint http://localhost:porta/api/publico/criarsenha
**/
router.post("/criarsenha", criaSenhaController.criaSenha);

module.exports = router;
