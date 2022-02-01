const jwt = require("jsonwebtoken");
const config = require("../config");
const { promisify } = require("util");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next();
  }

	const [, token] = authHeader.split(" ");

	try {
		const decoded = await promisify(jwt.verify)(token, config.secret);
		res.header('Auth-Token', jwt.sign({ id: decoded.id, email: decoded.email, tipo: decoded.tipo }, config.secret, {
			//gera o token a partir do id
			expiresIn: config.expiresIn,
		}))
		return next()
	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Erro no servidor!" });
	}
};