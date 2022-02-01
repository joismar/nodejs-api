const { uploader } = require("../config");
const streamifier = require("streamifier");
const { Op } = require("sequelize");

exports.uploadProdutoImage = async (file) => { 
  return new Promise((resolve, reject) => {
    console.log("Uploading image to Cloudinary..."); 
    const stream = uploader.upload_stream(
      {
        folder: "produtos",
        allowed_formats: ["jpg", "png"], 
        transformation: [
          { width: 500, height: 500, crop: "limit", quality: "auto" }, 
        ],
      }, 
      (err, response) => {
        if (err != null) return reject(err); 
        return resolve(response);
      } 
    );
    streamifier.createReadStream(file.buffer).pipe(stream); 
  });
}; 

exports.parseResult = (produto, public) => {
  if (public) {
    return {
      public_id: produto.public_id,
      titulo: produto.titulo,
      descricao: produto.descricao,
      condicao: produto.condicao,
      categoria: produto.categorium.nome,
      marca: produto.marca,
      tamanho: produto.tamanho.nome,
      peso: produto.peso,
      formato: produto.formato.nome,
      valor: produto.valor,
      cidade: produto.cidade.nome,
      estado: produto.cidade.estado.nome,
      usuario: produto.usuario.usuario,
      imagens: produto.imagem_produtos
        ? produto.imagem_produtos.map((imagem) => {
            return { url: imagem.url, public_id: imagem.public_id };
          })
        : [],
    };
  } else {
    return {
      id: produto.id,
      public_id: produto.public_id,
      titulo: produto.titulo,
      descricao: produto.descricao,
      condicao: produto.condicao,
      categoriaId: produto.categoriaId,
      marca: produto.marca,
      tamanho: produto.tamanho,
      peso: produto.peso,
      formatoId: produto.formatoId,
      valor: produto.valor,
      cidadeId: produto.cidadeId,
      userId: produto.userId,
      imagens: produto.imagem_produtos
        ? produto.imagem_produtos.map((imagem) => {
            return { url: imagem.url, public_id: imagem.public_id };
          })
        : [],
    };
  } 
};

exports.getQuery = (
  body,
  Cidade,
  Estado,
  Categoria,
  Tamanho,
  Formato,
  User
) => {
  let where = [];
  let query;
  
  if (body.query) {
    query = body.query;

    if (query.titulo) {
      where.push({ titulo: { [Op.iLike]: `%${query.titulo}%` } });
    }
    if (query.descricao) {
      where.push({ descricao: { [Op.iLike]: `%${query.descricao}%` } });
    }
    if (query.condicao) {
      where.push({ condicao: { [Op.like]: query.condicao } });
    }
    if (query.marca) {
      where.push({ marca: { [Op.iLike]: `%${query.marca}%` } });
    }
    if (query.valor) {
      where.push({
        valor: { [Op.between]: [parseFloat(query.valor.min), parseFloat(query.valor.max)] },
      });
    }
    if (query.categorias) {
      where.push({ categoriaId: { [Op.in]: query.categorias } });
    }
    if (query.tamanhos) {
      where.push({ tamanhoId: { [Op.in]: query.tamanhos } });
    }
    if (query.formatos) {
      where.push({ formatoId: { [Op.in]: query.formatos } });
    }
    if (query.cidades) {
      where.push({ cidadeId: { [Op.in]: query.cidades } });
    }
    if (query.estados) {
      query.estados = { estadoId: { [Op.in]: query.estados } }
    } else {
      query.estados = []
    }
  } else {
    query = {}
    query.estados = []
  }

  return {
    where: { [Op.and]: where },
    include: [
      {
        model: Cidade,
        where: { [Op.and]: query.estados },
        include: [Estado]
      },
      Categoria,
      Tamanho,
      Formato,
      User,
    ],
    limit: body.paginacao.limite,
    offset: (body.paginacao.pagina - 1) * body.paginacao.limite,
  };
};
