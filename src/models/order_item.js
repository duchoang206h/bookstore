'use strict';
const {
  Model, DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order_item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

    }
  }
  Order_item.init({
    id: { type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    amount:DataTypes.INTEGER ,
    order_id:{
        type: DataTypes.INTEGER,
  
    },
    book_id: {
        type: DataTypes.INTEGER,
    }
  }, {
    sequelize,
    modelName: 'Order_item',
    tableName:'Order_items'
  });
  return Order_item;
};