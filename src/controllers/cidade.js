const Cidade = require("../models/Cidade");
const Estado = require("../models/Estado");

// listar todas as cidades de um Estado
exports.getByEstado  = async (req, res) => {
  try {
    const estadoId = req.params.estado_id;
       
    Cidade.hasOne(Estado, { foreignKey: "id", sourceKey: "estadoId" });
		
    Cidade.findAll({ where: { estadoId: estadoId } }).then(async (cidades) => {
      const status = cidades && cidades.length > 0 ? 200 : 204;

      return res.status(status).send(cidades);
    }); 
  } catch (e) {
    console.log(e);
    return res.status(400).json(e);
  }
};