const { Sequelize, DataTypes } = require('sequelize');
const config = require('./config.json'); 
const path = require('path');
const fs = require('fs');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig);

const db = {
    sequelize,
    Sequelize,
    DataTypes,
    models: {}
};

const modelsDir = path.join(__dirname, '../models');

fs.readdirSync(modelsDir)
    .filter(file => (file.indexOf('.') !== 0) && (file.slice(-3) === '.js'))
    .forEach(file => {
        const model = require(path.join(modelsDir, file))(sequelize);
        db.models[model.name] = model;
    });

console.log('Modelos carregados:', Object.keys(db.models));

Object.keys(db.models).forEach(modelName => {
  if (db.models[modelName].associate) {
      db.models[modelName].associate(db.models);
  }
});

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

const syncDatabase = async () => {
    await sequelize.sync(); 
    console.log("All models were synchronized successfully.");
};


module.exports = { 
    ...db, 
    testConnection,
    syncDatabase
};