'use strict';
const {
  Model, DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    
    }
  }
  Cart.init({
    id: {
      type:DataTypes.STRING,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      references:{
        model:{ name:"User", tableName:"Users"},
        key:"id"
      }
    }
  }, {
    sequelize,
    modelName: 'Cart',
  });
  return Cart;
};