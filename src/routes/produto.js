const express = require("express");
const router = express.Router();
const produtoController = require("../controllers/produto");
const imageController = require("../controllers/imagem");
const multerUpload = require("../middlewares/multerUpload");

/**
@route POST produto
@desc Cadastrar um novo produto
@access Private 
@endpoint http://localhost:porta/api/produto/novo
**/
router.post("/novo", 
  multerUpload.produtoStorage,
  produtoController.addProduto,
  imageController.uploadImagemProduto
);

/**
@route PUT produto
@desc Atualizar um produto
@access Private
@endpoint http://localhost:porta/api/produto/editar/:id
**/
router.put("/editar/:id", 
  multerUpload.produtoStorage,  
  produtoController.updateProduto,
  imageController.uploadImagemProduto
);

/**
@route DELETE produto
@desc Deletar um produto pelo seu id
@access Private 
@endpoint http://localhost:porta/api/produto/deletar/:id
**/
router.delete("/deletar/:id", produtoController.deleteProduto);

/**
@route POST imagem produto
@desc Faz upload da imagem do produto
@access Private 
@endpoint http://localhost:porta/api/produto/imagem/upload/:produto_id
**/
router.post(
  "/imagem/upload/:produto_id",
  multerUpload.produtoStorage,
  imageController.uploadImagemProduto
);

/**
@route DELETE imagem produto
@desc Remove uma imagem de um produto
@access Private 
@endpoint http://localhost:porta/api/produto/imagem/delete/:public_id
**/
router.delete(
  "/imagem/delete/:public_id",
  imageController.deleteImagemProduto
);

/**
@route GET produto por ID
@desc Retornar um produto por ID
@access Private 
@endpoint http://localhost:porta/api/produto/:id
**/
router.get("/:id", produtoController.getById);

module.exports = router;
