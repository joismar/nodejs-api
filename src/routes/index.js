const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  res.status(200).send({
    title: "Complete NodeJS API",
    dev: "Joismar Braga & Jennyffer de Morais",
    version: "1.1.0",
  });
});

module.exports = router;
