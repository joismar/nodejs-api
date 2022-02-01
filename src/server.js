require("express-async-errors");
/**
 * Module dependencies.
 */
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const { sequelize } = require('./config');
const { runEstadoMigration } = require('./models/migrations/Estado');
const { runCidadeMigration } = require('./models/migrations/Cidade');
const { runCategoriaMigration } = require('./models/migrations/Categoria');
const { runFormatoMigration } = require('./models/migrations/Formato');
const { runTamanhoMigration } = require('./models/migrations/Tamanho');

/**
 * Routes
 */
const index = require('./routes/index');
const categorias = require('./routes/categoria');
const publico = require('./routes/publico');
const admin = require('./routes/admin');
const login = require('./routes/login');
const usuario = require('./routes/usuario');
const produto = require('./routes/produto');
const cidade = require('./routes/cidade');
const authMiddleware = require('./middlewares/auth');
const adminMiddleware = require('./middlewares/authAdmin');
const refreshToken = require('./middlewares/refreshToken');

/**
 * Create Express server.
 */
const app = express();
app.use(cors({ exposedHeaders: ['Auth-Token'] }));

/**
 * Express configuration
 */
app.set('port', config.port || 8080);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", index);
app.use("/api", refreshToken, login);
app.use("/api/categorias", refreshToken, categorias);
app.use("/api/publico", refreshToken, publico);
app.use("/api/usuario", refreshToken, authMiddleware, usuario);
app.use("/api/produto", refreshToken, authMiddleware, produto);
app.use("/api/cidades", refreshToken, cidade); //authMiddleware
app.use("/api/admin", refreshToken, authMiddleware, adminMiddleware, admin);

app.use((error, req, res, next) => {
  res.status(500).json({ error: error.message });
});

/**
 * Sincronizando o Banco de Dados
 */
sequelize
   .sync()
   .then(() => {
      console.log(' ********** Banco de Dados sincronizado!');
   })
   .then(() => {
      /**
       * Roda migração de todos os estados
       */
      runEstadoMigration();

      /**
       * Roda migração de todas as cidades
       */
      runCidadeMigration();

      /**
       * Roda migração de todas as categorias
       */
      runCategoriaMigration();

      /**
       * Roda migração de todos os formatos
       */
      runFormatoMigration();

      /**
       * Roda migração de todos os tamanhos
       */
      runTamanhoMigration();
   });

/*
 * Error Handler.
 */
app.use((err, req, res, next) => {
   console.error(err);
   res.status(500).send('Server Error');
});

//const port = process.env.NODE_ENV === "production" ? 80 : process.env.PORT;

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
   console.log(
      '%s App is running at http://localhost:%d in %s mode',
      app.get('port'),
      app.get('port'),
      app.get('env')
   );
   console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
