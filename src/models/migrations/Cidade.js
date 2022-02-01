const Cidade = require("../../models/Cidade");
const fs = require("fs");

exports.runCidadeMigration = () => {
  Cidade.findOne({ where: { id: 1 } }).then(async (cidade) => {
    if (cidade == null) {
      var jsonCidades;
      fs.readFile(
        "./src/models/migrations/Cidades.json",
        "utf8",
        function (err, data) {
          if (err) throw err;
          jsonCidades = JSON.parse(data);
          Cidade.bulkCreate(jsonCidades).then((cidade) => {
            if (cidade != null) {
              console.log("Migração de cidades realizado com sucesso!");
            } else {
              console.log("Migração não realizada.");
            }
          });
        }
      );
    } else {
      console.log("Todos os cidades já estão migradas.");
    }
  });
};
