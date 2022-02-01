const User = require("../models/User");
const { hashPassword, assignDefined } = require("../helpers/user");
const Cidade = require("../models/Cidade");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const { uploader } = require("../config");
const ImagemPerfil = require("../models/ImagemPerfil")
const Estado = require("../models/Estado")


exports.getByUsername = async (req, res) => {
  try {
    const usuario = req.params.usuario;

    User.hasOne(Cidade, { foreignKey: "id", sourceKey: "cidadeId" });
    Cidade.hasOne(Estado, { foreignKey: "id", sourceKey: "estadoId" });
    User.hasOne(ImagemPerfil, { foreignKey: "usuarioId", sourceKey: "id" });
    ImagemPerfil.hasOne(User, { foreignKey: "id", sourceKey: "usuarioId" });

    User.findOne({
      where: { usuario: usuario },
      include: [{ model: Cidade, include: [Estado] }, ImagemPerfil]
    }).then(async (user) => {
      // console.log("USER: ", user);
      // console.log('CIDADE', user.cidade)
      const status = user ? 200 : 204;
      const result = user
        ? {
            usuario: user.usuario,
            nome: user.nome,
            sobrenome: user.sobrenome,
            cidade: user.cidade.nome,
            estado: user.cidade.estado.nome,
            telefone: user.telefone,
            imagemURL: user.imagem_perfil ? user.imagem_perfil.url : null,
          }
        : null;

      return res.status(status).send(result);
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: 'Erro interno!' });
  }
};

exports.getById = async (req, res) => {
  try {
    let id;

    // se o usuário for admin, ele precisa passar um id para atualizar
    if (req.isAdmin) {
      if (req.query.id) {
        id = req.query.id;
      } else {
        return res
          .status(400)
          .json({ message: "O ID deve ser passado na URL." });
      }
    } else {
      id = req.userId;
    }

    User.hasOne(Cidade, { foreignKey: "id", sourceKey: "cidadeId" });
    User.hasOne(ImagemPerfil, { foreignKey: "usuarioId", sourceKey: "id" });
    ImagemPerfil.hasOne(User, { foreignKey: "id", sourceKey: "usuarioId" });

    User.findOne({ where: { id: id }, include: [Cidade] }).then(
      async (user) => {
        console.log("USER: ", user);
        const status = user ? 200 : 204;
        const result = user
          ? {
              usuario: user.usuario,
              email: user.email,
              nome: user.nome,
              sobrenome: user.sobrenome,
              cpf: user.cpf,
              cidadeId: user.cidadeId,
              estadoId: user.cidade.estadoId,
              telefone: user.telefone,
              imagemURL: user.imagem_perfil ? user.imagem_perfil.url : null,
            }
          : null;

        return res.status(status).send(result);
      }
    );
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: 'Erro interno!' });
  }
};

exports.atualizarUser = async (req, res, next) => {
  let id;

  // se o usuário for admin, ele precisa passar um id para atualizar
  if (req.isAdmin) {
    if (req.query.id) {
      id = req.query.id;
    } else {
      throw new Error("O ID deve ser passado na URL.")
    }
  } else {
    id = req.userId;
  }

  const data = {
    usuario: req.body.usuario,
    email: req.body.email,
    nome: req.body.nome,
    sobrenome: req.body.sobrenome,
    cpf: req.body.cpf,
    cidadeId: req.body.cidadeId,
    estadoId: req.body.estadoId,
    telefone: req.body.telefone,
    senhaAntiga: req.body.senha_antiga,
  };

  User.hasOne(Cidade, { foreignKey: "id", sourceKey: "cidadeId" });
  User.hasOne(ImagemPerfil, { foreignKey: "usuarioId", sourceKey: "id" })
  ImagemPerfil.hasOne(User, { foreignKey: "id", sourceKey: "usuarioId" });

  let user = await User.findOne({
    where: { id: id },
    include: [Cidade, ImagemPerfil]
  })

  // verifica se o valor passado é um ID e, se é válido no BD
  if (user == null) {
    throw new Error("Esse ID não é válido.")
  }

  let op = []

  if (user.email && (user.email != data.email)) { op.push({ email: data.email ? data.email : "" }) }
  if (user.usuario && (user.usuario != data.usuario)) { op.push({ usuario: data.usuario ? data.usuario : "" }) }

  if (op.length > 0) {
    await User.findOne({
      where: {
        [Op.or]: op,
      },
    }).then((user_finded) => {
      if (user_finded != null) {
        throw new Error("Já existe uma conta com esse e-mail ou usuário!")
      }
    });
  }

  if (req.body.senha) {
    try {
      if (data.senhaAntiga) {
        try {
          if (!bcrypt.compareSync(data.senhaAntiga, user.senha)) {
            throw new Error("Senha antiga incorreta!")
          }
        } catch (e) {
          throw e
        }
      } else {
        throw new Error("Impossível atualizar senha sem a senha antiga!")
      }

      data.senha = await hashPassword(req.body.senha, res);
    } catch (err) {
      console.log(err);
      throw new Error("Erro interno, verifique se todos os parametros obrigatórios foram passados!")
    }
  }

  assignDefined(user, data)

  user.save()

  if (req.file) {
    req.usuario = user
    return next()
  }

  return res.status(200).json({
    message: `O usuário com o ID: ${id} foi atualizado.`,
  })
}

exports.deletarUser = async (req, res) => {
  let id;

  // se o usuário for admin, ele precisa passar um id para deletar
  if (req.isAdmin) {
    if (req.query.id) {
      id = req.query.id
    } else {
      throw new Error("O ID deve ser passado na URL.")
    }
  } else {
    id = req.userId
  }

  User.hasOne(ImagemPerfil, { foreignKey: "usuarioId", sourceKey: "id" })
  ImagemPerfil.hasOne(User, { foreignKey: "id", sourceKey: "usuarioId" })

  let user = await User.findOne({
    where: { id: id },
    include: [ImagemPerfil]
  })

  if (user == null) {
    throw new Error("Esse ID não é válido.")
  }

  let imagem_antiga = user.imagem_perfil

  try {
    imagem_antiga.destroy()
    user.destroy()
    uploader.destroy(imagem_antiga.public_id, imagem_antiga.signature)

    res.status(200).json({ message: "Usuário deletado." })
  } catch(e) {
    console.log(e)
    throw new Error("Erro interno!")
  }
};
