'use strict';
const {
  Model, DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
   
    }
  }
  Order.init({
    id: { type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    fullname: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    address: DataTypes.STRING,
    shipping: DataTypes.FLOAT,
    total: DataTypes.FLOAT,
    user_id:{
      type: DataTypes.INTEGER,
    
    }
  }, {
    sequelize,
    modelName: 'Order',
    tableName:'Orders'
  });
  return Order;
};