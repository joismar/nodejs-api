er = require("../models/User");
const Produto = require("../models/Produto");
const ImagemPerfil = require("../models/ImagemPerfil");
const ImagemProduto = require("../models/ImagemProduto");
const { uploader } = require("../config");
const { uploadImage } = require("../helpers/user");
const { uploadProdutoImage } = require("../helpers/produto");
const { sequelize } = require("../config");
const parseResult = require("../helpers/produto").parseResult;

exports.uploadImagemUsuario = async (req, res) => {
  let usuario = req.usuario
  const id = req.usuario ? req.usuario.id : req.userId
  const t = await sequelize.transaction();
  let image_uploaded = null

  if (!usuario) {
    // Faz relação entre User e ImagemPerfil
    User.hasOne(ImagemPerfil, { foreignKey: "usuarioId", sourceKey: "id" });
    ImagemPerfil.hasOne(User, { foreignKey: "id", sourceKey: "usuarioId" });

    User.findByPk(id, { include: [ImagemPerfil] }).then(async (user) => {
      // Verifica se o ID é válido.
      if (user == null) {
        return res.status(400).json({ message: "Esse ID não é válido." });
      }
      if (usuario.id != req.userId) {
        return res.status(400).json({ message: "Essa imagem não pertence a voce!" });
      }
      usuario = user
    })
  }
  // Faz relação entre User e ImagemPerfil
  // User.hasOne(ImagemPerfil, { foreignKey: "usuarioId", sourceKey: "id" });
  // ImagemPerfil.hasOne(User, { foreignKey: "id", sourceKey: "usuarioId" });

  // User.findByPk(id, { include: [ImagemPerfil] }).then(async (user) => {
  //   // Verifica se o ID é válido.
  //   if (user == null) {
  //     return res.status(400).json({ message: "Esse ID não é válido." });
  //   }
  // Tenta fazer upload da imagem para o Cloudinary
  try {
    await uploadImage(req.file)
      .then(async (imagem) => {
        // Se tudo der certo, checa se o usuário já não tem imagem
          if (usuario.imagem_perfil == null) {
            // Se não tiver, tenta persistir os metadados
            await ImagemPerfil.create(
              {
                usuarioId: id,
                public_id: imagem.public_id,
                url: imagem.url,
                signature: imagem.signature,
              },
              { transaction: t }
            );
          } else {
            // Se tiver, salva os dados da antiga imagem e faz update dos dados da nova imagem
            const imagem_antiga = usuario.imagem_perfil;
            await ImagemPerfil.update(
              {
                public_id: imagem.public_id,
                url: imagem.url,
                signature: imagem.signature,
              },
              { where: { usuarioId: id }, transaction: t }
            ).then(() => {
              // Se der tudo certo ao gravar a nova imagem, remove a antiga do Coudinary
              uploader.destroy(
                imagem_antiga.public_id,
                imagem_antiga.signature
              );
            });
          }
          image_uploaded = imagem
          await t.commit();
          if (req.usuario) {
            return res.status(200).json({
              id: usuario.id,
              tipo: usuario.tipo,
              usuario: usuario.usuario,
              email: usuario.email,
              nome: usuario.nome,
              sobrenome: usuario.sobrenome,
              cpf: usuario.cpf,
              cidadeId: usuario.cidadeId,
              estadoId: usuario.cidade.estadoId,
              telefone: usuario.telefone,
              createdAt: usuario.createdAt,
              updatedAt: usuario.updatedAt,
              imagemURL: imagem.url,
            });
          }
          res.status(200).json({
            message: "Imagem atualizada com sucesso.",
            url: imagem.url,
          });
      })
      .catch((err) => {
        // Se der erro no upload do cloudinary, simplesmente sai
        throw err;
      });
    } catch (err) {
      // Se der erro em uma das duas transações,
      // faz rollback no banco de dados e remove a imagem do Cloudinary
      console.log('Erro: ', err);
      await t.rollback();
      if (image_uploaded) { uploader.destroy(image_uploaded.public_id, image_uploaded.signature) }
      if (req.usuario) {
        return res.status(200).json({
          id: usuario.id,
          tipo: usuario.tipo,
          usuario: usuario.usuario,
          email: usuario.email,
          nome: usuario.nome,
          sobrenome: usuario.sobrenome,
          cpf: usuario.cpf,
          cidadeId: usuario.cidadeId,
          estadoId: usuario.cidade.estadoId,
          telefone: usuario.telefone,
          createdAt: usuario.createdAt,
          updatedAt: usuario.updatedAt,
          imagemURL: { error: err.message }
        });
      }
      res.json({ message: "Erro ao tentar salvar metadados!" });
    }
};

exports.deleteImagemUsuario = async (req, res) => {
  const id = req.userId;
  const t = await sequelize.transaction();

  // Faz relação entre User e ImagemPerfil
  User.hasOne(ImagemPerfil, { foreignKey: "usuarioId", sourceKey: "id" });
  ImagemPerfil.hasOne(User, { foreignKey: "id", sourceKey: "usuarioId" });

  User.findByPk(id, { include: [ImagemPerfil] }).then(async (usuario) => {
    // Verifica se o ID é válido.
    if (usuario == null) {
      return res.status(400).json({ message: "Esse ID não é válido." });
    }
    try {
      const imagem_antiga = usuario.imagem_perfil;
      await ImagemPerfil.destroy({
        where: { usuarioId: id },
        transaction: t,
      });
      await t.commit();
      uploader
        .destroy(imagem_antiga.public_id, imagem_antiga.signature)
        .then(() => {
          res.status(200).json({
            message: "Imagem removida com sucesso.",
          });
        })
        .catch(async (err) => {
          console.log(err);
          await t.rollback();
          res.json({ message: "Erro ao remover imagem!" });
        });
    } catch (err) {
      console.log(err);
      await t.rollback();
      res.json({ message: "Erro ao remover imagem!" });
    }
  });
};

exports.uploadImagemProduto = async (req, res) => {
  let produto = req.produto || null
  const id = req.produto ? req.produto.id : req.params.produto_id

  const t = await sequelize.transaction();

  if (!produto) {
    // Faz relação entre User e ImagemPerfil
    Produto.hasMany(ImagemProduto, { foreignKey: "produtoId", sourceKey: "id" });
    ImagemProduto.hasOne(Produto, { foreignKey: "id", sourceKey: "produtoId" });

    Produto.findByPk(id, { include: [ImagemProduto] }).then(async (produto) => {
      // Verifica se o ID é válido.
      if (produto == null) {
        return res.status(400).json({ message: "Esse ID não é válido." });
      }
      if (produto.userId != req.userId) {
        return res.status(400).json({ message: "Essa imagem não pertence a voce!" });
      }
    });
  }
  
  // Tenta fazer upload das imagens para o Cloudinary
  try {
    let images_uploaded = [];
    for (file of req.files) {
      console.log(file)
      await uploadProdutoImage(file)
        .then(async (imagem) => {
            await ImagemProduto.create(
              {
                produtoId: id,
                public_id: imagem.public_id,
                url: imagem.url,
                signature: imagem.signature,
              },
              { transaction: t }
            );
            images_uploaded.push(imagem);
        })
        .catch((err) => {
          throw new Error(err);
        });
    }
    await t.commit();
    if (req.produto) {
      produto = parseResult(req.produto, (public = false))
      produto.imagens = images_uploaded.map((img) => { 
        return {
          public_id: img.public_id, 
          url: img.url
        }
      })
      return res.json(produto)
    }
    res.json({
      imagens: images_uploaded.map((img) => { 
        return {
          public_id: img.public_id, 
          url: img.url
        }
      }),
    });
  } catch (err) {
    console.log(err);
    await t.rollback();
    for (img of images_uploaded) {
      uploader.destroy(img.public_id, img.signature);
    }
    if (req.produto) {
      produto = parseResult(req.produto, (public = false))
      produto.error = 'Falha ao tentar fazer upload da imagem!'
      return res.json(produto);
    }
    res.json({ message: "Erro ao tentar fazer upload!" });
  }
};

exports.deleteImagemProduto = async (req, res) => {
  const public_id = req.params.public_id;
  const t = await sequelize.transaction();

  // Faz relação entre User e ImagemPerfil
  Produto.hasMany(ImagemProduto, { foreignKey: "produtoId", sourceKey: "id" });
  ImagemProduto.hasOne(Produto, { foreignKey: "id", sourceKey: "produtoId" });

  ImagemProduto.findOne({ where: { public_id: 'produtos/' + public_id }, include: [Produto]}).then(async (imagem) => {
    // Verifica se o ID é válido.
    if (imagem == null) {
      return res.status(400).json({ message: "Essa imagem não existe." });
    }
    if (imagem.produto.userId != req.userId) {
      return res.status(400).json({ message: "Essa imagem não pertence a voce!" });
    }
    try {
      await ImagemProduto.destroy({
        where: { public_id: 'produtos/' + public_id },
        transaction: t,
      });
      uploader
        .destroy(imagem.public_id, imagem.signature)
        .then(async () => {
          await t.commit();
          res.status(200).json({
            message: "Imagem removida com sucesso.",
          });
        })
        .catch(async (err) => {
          console.log(err);
          await t.rollback();
          res.json({ message: "Erro ao remover imagem!" });
        });
    } catch (err) {
      console.log(err);
      res.json({ message: "Erro ao remover imagem!" });
    }
  });
};
