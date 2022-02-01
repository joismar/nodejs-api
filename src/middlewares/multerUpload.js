const multer = require("multer");
const storage = multer.memoryStorage();

exports.userStorage = multer({ storage }).single("image");

exports.produtoStorage = multer({ storage }).array('images', 5);
