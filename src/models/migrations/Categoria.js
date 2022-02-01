const Categoria = require("../../models/Categoria");
const fs = require("fs");

exports.runCategoriaMigration = () => {
  Categoria.findOne({ where: { id: 1 } }).then(async (categoria) => {
    if (categoria == null) {
      let jsonCategorias = [
        { nome: "FEMININO" },
        { nome: "MASCULINO" },
        { nome: "UNISEX" },
        { nome: "KIDS" },
      ];
      Categoria.bulkCreate(jsonCategorias).then((categoria) => {
        if (categoria != null) {
          console.log("Migração de categorias realizado com sucesso!");
        } else {
          console.log("Migração não realizada.");
        }
      });
    } else {
      console.log("Todas as categorias já estão migradas.");
    }
  });
};
