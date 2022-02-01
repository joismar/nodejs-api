const Formato = require("../../models/Formato");
const fs = require("fs");

exports.runFormatoMigration = () => {
  Formato.findOne({ where: { id: 1 } }).then(async (formato) => {
    if (formato == null) {
      let jsonFormatos = [
        { nome: "VENDA" },
        { nome: "ALUGUEL" },
        { nome: "TROCA" },
      ];
      Formato.bulkCreate(jsonFormatos).then((formato) => {
        if (formato != null) {
          console.log("Migração de formatos realizado com sucesso!");
        } else {
          console.log("Migração não realizada.");
        }
      });
    } else {
      console.log("Todos os formatos já estão migrados.");
    }
  });
};
