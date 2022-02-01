const jwt = require("jsonwebtoken");
const config = require("../config");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Cidade = require("../models/Cidade");
const { hashPassword } = require("../helpers/user");
const { Op } = require("sequelize");
const { requestPasswordReset, resetPassword } = require("../services/auth");
const ImagemPerfil = require("../models/ImagemPerfil");


exports.accessToken = async (req, res) => {

  const { email, senha: passwordEntry } = req.body;

  User.hasOne(Cidade, { foreignKey: "id", sourceKey: "cidadeId" });

  user = await User.findOne({
    where: { email: email },
    include: [Cidade]
  })

  if (!user) { throw new Error("Usuário ou senha inválidos!") }

  const { id, senha: hashPassword, tipo } = user

  if (!bcrypt.compareSync(passwordEntry, hashPassword)) {
    throw new Error("Usuário ou senha inválidos!")
  }

  res.header('Auth-Token', jwt.sign({ id, email, tipo }, config.secret, {
    expiresIn: config.expiresIn,
  }))

  return res.json({
    id: user.id,
    tipo: user.tipo,
    usuario: user.usuario,
    email: user.email,
    nome: user.nome,
    sobrenome: user.sobrenome,
    cpf: user.cpf,
    cidadeId: user.cidadeId,
    estadoId: user.cidade.estadoId,
    telefone: user.telefone,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
};

exports.signup = async (req, res, next) => {
  // Lógica de salvar usuários no nosso banco
  // Recebemos pelo req.body, os valores para popular o nosso banco com um Usuário novo

  try {
    if (req.body.email === "" || req.body.senha === "") {
      res.json("Email e senha são necessários!");
    }

    User.hasOne(Cidade, { foreignKey: "id", sourceKey: "cidadeId" });
    User.hasOne(ImagemPerfil, { foreignKey: "usuarioId", sourceKey: "id" })
    ImagemPerfil.hasOne(User, { foreignKey: "id", sourceKey: "usuarioId" });

    // Procuramos se existe algum usuário no banco com esse e-mail
    User.findOne({
      where: {
        [Op.or]: [{ email: req.body.email }, { usuario: req.body.usuario }],
      }, include: [Cidade, ImagemPerfil]
    }).then(async (user) => {
      // Verificar se existe algum usuário com esse e-mail
      if (user != null) {
        // Se existir, retornamos um erro
        return res.status(400).json({
          message: "Já existe uma conta com esse e-mail ou usuário",
        });
      }

      // Criptografar a senha inserida pelo usuário
      // hashPassword é um Promise, e para ser guardado dentro de uma variável, precisamos do await
      const passwordHashed = await hashPassword(req.body.senha, res);

      // Salvar no banco
      User.create({
        usuario: req.body.usuario,
        email: req.body.email,
        senha: passwordHashed,
        nome: req.body.nome,
        sobrenome: req.body.sobrenome,
        cpf: req.body.cpf,
        cidadeId: req.body.cidadeId,
        telefone: req.body.telefone,
      })
        // Caso a requisição seja bem sucedida, retornar o usuário criado com status 200
        .then((user) => {
          User.findOne({ where: { id: user.id }, include: [Cidade] })
            .then((user) => {
              if (req.file) {
                req.usuario = user
                return next()
              }

              return res.status(200).json({
                id: user.id,
                tipo: user.tipo,
                usuario: user.usuario,
                email: user.email,
                nome: user.nome,
                sobrenome: user.sobrenome,
                cpf: user.cpf,
                cidadeId: user.cidadeId,
                estadoId: user.cidade.estadoId,
                telefone: user.telefone,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
              });
            })
          })
        // Caso a requisição não seja bem sucedida, retornar status 500 com o erro
        .catch((err) => {
          console.log(err);
          return res.status(500).json(err);
        });
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json(e);
  }
};

exports.resetPasswordRequestController = async (req, res, next) => {
  const requestPasswordResetService = await requestPasswordReset(
    req.body.email,
    req.body.usuario
  );
  return res.json(requestPasswordResetService);
};

exports.resetPasswordController = async (req, res, next) => {
  const passwordResetService = await resetPassword(
    req.body.userId,
    req.body.token,
    req.body.password,
  );
  return res.json(passwordResetService);
};