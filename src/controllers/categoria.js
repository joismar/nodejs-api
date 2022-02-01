const Categoria = require("../models/Categoria");
const config = require("../config");
const { Op } = require("sequelize");

exports.getAll = async (req, res) => {
  try {
    Categoria.findAll({}).then(async (categorias) => {
      const status = categorias && categorias.length > 0 ? 200 : 204;
      return res.status(status).send(categorias);
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json(e);
  }
};

exports.addCategoria = async (req, res) => {
  try {
    console.log(req.body);
    const nome = req.body.nome;
    // Criando uma nova Categoria

    /* ***** Verificar se já tem essa categoria no BD ***** */
    return Categoria.findOne({ where: { nome: nome } }).then(
      async (categoriaExiste) => {
        console.log(categoriaExiste);

        // Caso essa Categoria não esteja no nosso banco, criar ela na tabela Categorias e salvar
        if (!categoriaExiste) {
          Categoria.create({
            nome: req.body.nome,
          })
            .then((newCategoria) => {
              return res.status(201).json({
                id: newCategoria.id,
                nome: newCategoria.nome,
                createdAt: newCategoria.createdAt,
                updatedAt: newCategoria.updatedAt,
              });
            })
            .catch((err) => {
              console.log(err);
              // Retornando a nossa função mais cedo caso haja um erro ao salvar a Categoria
              return res.status(303).json({
                message: "Houve um erro ao criar uma entrada na tabela ",
              });
            });
        } else {
          //Se a categoria já existir
          return res
            .status(409)
            .json({ mensagem: "Essa categoria já está cadastrada." });
        }
      }
    );
  } catch (e) {
    // Retornando erro de validação
    console.log({ e });
    return res.status(400).json(e);
  }
};

exports.updateCategoria = async (req, res) => {
  const { id } = req.params; //pega o ID na URL

  const data = {
    nome: req.body.nome,
  };

  Categoria.findByPk(id).then(async (categoria) => {
    // verifica se o valor passado é um ID e, se é válido no BD
    if (categoria == null) {
      return res.status(400).json({ message: "Esse ID não é válido." });
    }

    Categoria.update(data, {
      where: { id: id },
    })
      .then(() => {
        res.status(200).json({
          message: `A Categoria com o ID: ${id} foi atualizada.`,
        });
      })
      .catch((err) => {
        res.json(err);
      });
  });
};

exports.deleteCategoria = (req, res) => {
  const { id } = req.params; //pega o ID na URL

  Categoria.findByPk(id).then(async (categoria) => {
    // verifica se o valor passado é um ID e, se é válido no BD
    if (categoria == null) {
      return res.status(400).json({ message: "Esse ID não é válido." });
    }

    Categoria.destroy({
      where: { id: id },
    })
      .then(() => {
        res
          .status(200)
          .json({ message: `A Categoria com o ID: ${id} foi deletada.` });
      })
      .catch((err) => {
        throw new Error(err); // throw new Error => mostra o erro
      });
  });
};
