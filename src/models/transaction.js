'use strict';
const {
  Model, DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

    }
  }
  Transaction.init({
    id: { type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    type: DataTypes.STRING,
    status:DataTypes.SMALLINT,
    user_id:{
      type:DataTypes.INTEGER,
    
    },
    order_id:{
      type:DataTypes.INTEGER,
     
    }
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};