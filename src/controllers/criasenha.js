const User = require("../models/User");
const { hashPassword } = require("../helpers/user");
const { Op } = require("sequelize");

exports.criaSenha = async (req, res) => {

  const data = req.body

	if (!data.usuario || !data.email) {
		res.status(400).json({
			message: "Usuario e email não enviados!",
		});
	}
	// SE EXISTIR OS PARAMETROS BUSCA O USUARIO
	User.findOne({
		where: {
			[Op.and]: [
				{ email: data.email },
				{ usuario: data.usuario },
			],
		},
	}).then(async (user) => {
		if (user == null) {
			return res.status(400).json({
				message: "Usuario não encontrado!",
			});
		}
		console.log(user.senha)
		if (user.senha != 'SEM_SENHA') {
			return res.status(400).json({
				message: "Usuario já possui senha cadastrada!",
			});
		} 
		// SE EXISTIR ATUALIZA A SENHA
		// Criptografar a senha inserida pelo usuário
		// hashPassword é um Promise, e para ser guardado dentro de uma variável, precisamos do await
		const passwordHashed = await hashPassword(data.senha, res);

		User.update({ senha: passwordHashed }, {
			where: { 
				[Op.and]: [
					{ email: data.email },
					{ usuario: data.usuario },
				] 
			},
		})
			.then(() => {
				res.status(200).json({
					message: 'Senha atualizada com sucesso!',
				});
			})
			.catch((err) => {
				console.log(err)
				res.status(500).json({
					message: "Erro interno!",
				});
			});
		});
};