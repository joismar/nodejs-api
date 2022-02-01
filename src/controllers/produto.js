const Produto = require("../models/Produto");
const ImagemProduto = require("../models/ImagemProduto");
const Categoria = require("../models/Categoria");
const Formato = require("../models/Formato");
const Cidade = require("../models/Cidade");
const Tamanho = require("../models/Tamanho");
const Estado = require("../models/Estado");
const User = require("../models/User");
const parseResult = require("../helpers/produto").parseResult;
const getQuery = require("../helpers/produto").getQuery;


exports.getAll = async (req, res) => {
  try {
    Produto.hasMany(ImagemProduto, {
      foreignKey: "produtoId",
      sourceKey: "id",
    });
    ImagemProduto.hasOne(Produto, { foreignKey: "id", sourceKey: "produtoId" });
    Cidade.hasOne(Estado, { foreignKey: "id", sourceKey: "estadoId" });
    Produto.hasOne(User, { foreignKey: "id", sourceKey: "userId" });
    Produto.hasOne(Categoria, { foreignKey: "id", sourceKey: "categoriaId" });
    Produto.hasOne(Formato, { foreignKey: "id", sourceKey: "formatoId" });
    Produto.hasOne(Tamanho, { foreignKey: "id", sourceKey: "tamanhoId" });
    Produto.hasOne(Cidade, { foreignKey: "id", sourceKey: "cidadeId" });

    let query = getQuery(
      req.body,
      Cidade,
      Estado,
      Categoria,
      Tamanho,
      Formato,
      User
    );

    Produto.findAll(query).then(async (produtos) => {
      const status = produtos && produtos.length > 0 ? 200 : 204;

      produtos = produtos.map((produto) => {
        return parseResult(produto, (public = true));
      });

      return res.status(status).send(produtos);
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json(e);
  }
};

// Listar produtos por usuário
exports.getByUsuario = async (req, res) => {
  try {
    const username = req.params.username;

    Produto.hasMany(ImagemProduto, {
      foreignKey: "produtoId",
      sourceKey: "id",
    });
    ImagemProduto.hasOne(Produto, { foreignKey: "id", sourceKey: "produtoId" });
    Cidade.hasOne(Estado, { foreignKey: "id", sourceKey: "estadoId" });
    Produto.hasOne(User, { foreignKey: "id", sourceKey: "userId" });
    Produto.hasOne(Categoria, {
      foreignKey: "id",
      sourceKey: "categoriaId",
    });
    Produto.hasOne(Formato, { foreignKey: "id", sourceKey: "formatoId" });
    Produto.hasOne(Tamanho, { foreignKey: "id", sourceKey: "tamanhoId" });
    Produto.hasOne(Cidade, { foreignKey: "id", sourceKey: "cidadeId" });

    Produto.findAll({
      include: [
        { model: User, where: { usuario: username } },
        { model: Cidade, include: [Estado] },
        Categoria,
        Formato,
        Tamanho,
      ],
    }).then(async (produtos) => {
      const status = produtos && produtos.length > 0 ? 200 : 204;

      produtos = produtos.map((produto) => {
        return parseResult(produto, (public = true));
      });

      return res.status(status).send(produtos);
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json(e);
  }
};

exports.getByPublicId = async (req, res) => {
  try {
    const public_id = req.params.public_id;

    Produto.hasMany(ImagemProduto, {
      foreignKey: "produtoId",
      sourceKey: "id",
    });
    ImagemProduto.hasOne(Produto, { foreignKey: "id", sourceKey: "produtoId" });
    Cidade.hasOne(Estado, { foreignKey: "id", sourceKey: "estadoId" });
    Produto.hasOne(User, { foreignKey: "id", sourceKey: "userId" });
    Produto.hasOne(Categoria, { foreignKey: "id", sourceKey: "categoriaId" });
    Produto.hasOne(Formato, { foreignKey: "id", sourceKey: "formatoId" });
    Produto.hasOne(Tamanho, { foreignKey: "id", sourceKey: "tamanhoId" });
    Produto.hasOne(Cidade, { foreignKey: "id", sourceKey: "cidadeId" });

    Produto.findOne({
      where: { public_id: public_id },
      include: [
        { model: Cidade, include: [Estado] },
        User,
        Categoria,
        Formato,
        Tamanho,
      ],
    }).then(async (produto) => {
      const status = produto ? 200 : 204;
      const result = produto ? parseResult(produto, (public = true)) : null;

      return res.status(status).send(result);
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json(e);
  }
};

exports.getById = async (req, res) => {
  try {
    const id = req.params.id;

    Produto.hasMany(ImagemProduto, {
      foreignKey: "produtoId",
      sourceKey: "id",
    });
    ImagemProduto.hasOne(Produto, { foreignKey: "id", sourceKey: "produtoId" });

    Produto.findOne({ where: { id: id } }).then(async (produto) => {
      const status = produto ? 200 : 204;
      const result = produto ? parseResult(produto, (public = false)) : null;

      return res.status(status).send(result);
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json(e);
  }
};

exports.addProduto = async (req, res, next) => {
  try {
    const id = req.userId;

    // Criando um novo Produto
    Produto.create({
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      condicao: req.body.condicao,
      categoriaId: req.body.categoriaId,
      marca: req.body.marca,
      tamanhoId: req.body.tamanhoId,
      peso: req.body.peso,
      formatoId: req.body.formatoId,
      valor: req.body.valor,
      cidadeId: req.body.cidadeId,
      userId: id,
    })
      .then((newProduto) => {
        if (req.files) {
          req.produto = newProduto
          return next()
        }
        console.log('oxi, passou?')
        return res.status(201).json(parseResult(newProduto, (public = false)));
      })
      .catch((err) => {
        console.log(err);
        // Retornando a nossa função mais cedo caso haja um erro ao salvar o Produto
        return res.status(303).json({
          message: "Houve um erro ao criar uma entrada na tabela.",
        });
      });
  } catch (e) {
    // Retornando erro de validação
    console.log(e);
    return res.status(400).json(e);
  }
};

exports.updateProduto = async (req, res) => {
  const { id } = req.params; //pega o ID na URL
  const userId = req.userId;

  const data = {
    titulo: req.body.titulo,
    descricao: req.body.descricao,
    condicao: req.body.condicao,
    categoriaId: req.body.categoriaId,
    marca: req.body.marca,
    tamanho: req.body.tamanho,
    peso: req.body.peso,
    formatoId: req.body.formatoId,
    valor: req.body.valor,
    cidadeId: req.body.cidadeId,
    userId: userId,
  };

  Produto.findOne({ where: { id: id, userId: userId } }).then(
    async (produto) => {
      // verifica se o valor passado é um ID e, se é válido no BD
      if (produto == null) {
        return res
          .status(400)
          .json({ message: "ID de usuário ou ID do Produto inválido." });
      }

      Produto.update(data, {
        where: { id: id },
      })
        .then((newProduto) => {
          if (req.files) {
            req.produto = newProduto
            return next()
          }
          res.status(200).json({
            message: `O Produto com o ID: ${id} foi atualizado.`,
          });
        })
        .catch((err) => {
          res.json(err);
        });
    }
  );
};

exports.deleteProduto = (req, res) => {
  const { id } = req.params; //pega o ID na URL
  const userId = req.userId;

  Produto.findOne({ where: { id: id, userId: userId } }).then(
    async (produto) => {
      // verifica se o valor passado é um ID e, se é válido no BD
      if (produto == null) {
        return res
          .status(400)
          .json({ message: "ID de usuário ou ID do Produto inválido." });
      }

      Produto.destroy({ where: { id: id, userId: userId } })
        .then(() => {
          res.status(200).json({ message: "Produto deletado com sucesso!" });
        })
        .catch((err) => {
          throw new Error(err); // throw new Error => mostra o erro
        });
    }
  );
};
