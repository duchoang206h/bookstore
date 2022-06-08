'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};


const sequelize = new Sequelize(config['DB_URL'], 
                  {
                    logging: false, 
                    dialectOptions: {
                    ssl: {
                      require: true, 
                      rejectUnauthorized: false 
                    }
                    }
                  })
/* if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], 
    {
    logging: false, 
    dialectOptions: {
    ssl: {
      require: true, 
      rejectUnauthorized: false 
    }
  }
    });
} else {
 // sequelize = new Sequelize(config.database, config.username, config.password, {...config, logging: false});
 sequelize = new Sequelize('postgres://jiftgzsagynlbp:19a6290afb58209ad3c05ab98f420c67d827fbaf09a894fb7fc426bda4258f17@ec2-44-196-174-238.compute-1.amazonaws.com:5432/ddd7g7d4j5jcva', 
 {
  logging: false, 
  dialectOptions: {
    ssl: {
      require: true, 
      rejectUnauthorized: false 
    }
  }
});
} */

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
