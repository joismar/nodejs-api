const Estado = require("../../models/Estado");
const fs = require("fs");

exports.runEstadoMigration = () => {
  Estado.findOne({ where: { id: 1 } }).then(async (estado) => {
    if (estado == null) {
      var jsonEstados;
      fs.readFile(
        "./src/models/migrations/Estados.json",
        "utf8",
        function (err, data) {
          if (err) throw err;
          jsonEstados = JSON.parse(data);
          Estado.bulkCreate(jsonEstados).then((estado) => {
            if (estado != null) {
              console.log("Migração de estados realizado com sucesso!");
            } else {
              console.log("Migração não realizada.");
            }
          });
        }
      );
    } else {
      console.log("Todos os estados já estão migradas.");
    }
  });
};
