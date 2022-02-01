const crypto = require("crypto");
const bcrypt = require("bcrypt");
const Token = require("../models/Token");
const { Op } = require("sequelize");
const User = require("../models/User");
const { sendMail } = require("./mail");

const bcryptSalt = process.env.BCRYPT_SALT;
const clientURL = process.env.CLIENT_URL;

exports.requestPasswordReset = async (email, usuario) => {
  const user = await User.findOne({ where: {
    [Op.and]: [{ email: email }, { usuario: usuario }],
  }});

  if (!user) throw new Error("Email ou Usuário não existe!");

  // await user.update({ senha: crypto.randomBytes(32).toString("hex") });

  let token = await Token.findOne({ where: { userId: user.id } });
  if (token) await token.destroy();

  let resetToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));

  await Token.build({
    userId: user.id,
    token: hash,
  }).save();

  const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user.id}`;

  mailSended = sendMail(
    user.email,
    "email@email.com",
    "Solicitação de Recuperação de Senha",
    `Para recuperar a senha clique no link a seguir: ${link}`
  );

  if (!mailSended) { throw new Error("Erro ao tentar enviar email!") }

  return { message: "Link de confirmação enviado com sucesso" };
};

// TEM QUE ARRUMAR
exports.resetPassword = async (userId, token, password) => {
  let passwordResetToken = await Token.findOne({ where: { userId: userId } });
	let tokenExpired = passwordResetToken.tokenExpires < new Date()

  if (!passwordResetToken || tokenExpired) {
    throw new Error("Token inválido ou expirado!");
  }

  const isValid = await bcrypt.compare(token, passwordResetToken.token);

  if (!isValid) {
    throw new Error("Token inválido!");
  }

  const salt = await bcrypt.genSalt(10)
  const passwordHashed = await bcrypt.hash(password, salt);

  await User.update(
    { senha: passwordHashed },
    { where: { id: userId } },
  );

  const user = await User.findOne({ where: { id: userId } });

  mailSended = sendMail(
    user.email,
    "email@email.com",
    "Senha resetada com sucesso!",
    "Sua senha foi resetada com sucesso :D"
  );

  if (!mailSended) { throw new Error("Erro ao tentar enviar email!") }

  await passwordResetToken.destroy();

  return { message: "Recuperação de senha concluída!" };
};