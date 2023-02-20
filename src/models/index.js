/**
 * Database connection and models loading
 */
const { Sequelize, DataTypes } = require('sequelize');
const { db } = require('../config/config');
const logger = require('../config/logger');

const sequelize = new Sequelize(db.database, db.username, db.password, db);

sequelize
  .authenticate()
  .then(() => logger.info('Connected to database server'))
  .catch(() => logger.warn('Unable to connect to database server. Make sure you have configured the DB options in .env and database with provided name exist on the server'));

const models = {
  sequelize,
  Sequelize,
  User: require('./user')(sequelize, Sequelize.DataTypes),
  token: require('./token')(sequelize, Sequelize.DataTypes),
  Message: require('./message')(sequelize, Sequelize.DataTypes),
  Recipient: require('./recipient')(sequelize, Sequelize.DataTypes),
  Group: require('./group')(sequelize, Sequelize.DataTypes),
  Participant: require('./participant')(sequelize, Sequelize.DataTypes),
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

sequelize.sync({alter: false});

module.exports = models;
