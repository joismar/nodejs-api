const Tamanho = require("../../models/Tamanho");
const fs = require("fs");

exports.runTamanhoMigration = () => {
  Tamanho.findOne({ where: { id: 1 } }).then(async (tamanho) => {
    if (tamanho == null) {
      let jsonTamanhos = [
        { nome: "TAMANHO UNICO" },
        { nome: "PP" },
        { nome: "P" },
        { nome: "M" },
        { nome: "G" },
        { nome: "GG" },
        { nome: "GGG" },
        { nome: "34" },
        { nome: "36" },
        { nome: "38" },
        { nome: "40" },
        { nome: "42" },
        { nome: "44" },
        { nome: "46" },
        { nome: "48" },
        { nome: "50" },
        { nome: "52" },
        { nome: "54" },
        { nome: "56" },
        { nome: "58" },
        { nome: "60" },
        { nome: "62" },
        { nome: "64" },
        { nome: "66" },
        { nome: "68" },
      ];
      Tamanho.bulkCreate(jsonTamanhos).then((tamanho) => {
        if (tamanho != null) {
          console.log("Migração de tamanhos realizado com sucesso!");
        } else {
          console.log("Migração não realizada.");
        }
      });
    } else {
      console.log("Todos os tamanhos já estão migrados.");
    }
  });
};
