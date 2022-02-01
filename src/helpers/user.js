const bcrypt = require("bcrypt");
const { uploader } = require("../config")
const streamifier = require('streamifier');

exports.hashPassword = async (password, res) => {
  try {
    // Salt/salteador de senha
    // Adc mais um nível de aleatoriedade para que as senhas critografadas nunca tenha o mesmo valor
    const salt = await bcrypt.genSalt(10);

    // Hashear a senha (extra segurança)
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      errors: ["Aconteceu algo de errado ao salvar a senha"],
    });
  }
};

exports.uploadImage = async (file) => {
  return new Promise((resolve, reject) => {
    console.log('Uploading image to Cloudinary...')
    const stream = uploader.upload_stream(
      {
        folder: "profile_images",
        allowed_formats: ["jpg", "png", "jpeg"],
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
}

exports.assignDefined = async (target, ...sources) => {
  for (const source of sources) {
      for (const key of Object.keys(source)) {
          const val = source[key];
          if (val !== undefined) {
              target[key] = val;
          }
      }
  }
  return target;
}
