'use strict';
const {
  Model, DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart_item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Cart_item.belongsTo(models.Book, { foreignKey:"book_id"});
      Cart_item.belongsTo(models.Cart, { foreignKey:"cart_id"});
    }
  }
  Cart_item.init({
    id: { type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    amount:DataTypes.INTEGER ,
    cart_id:{
        type: DataTypes.INTEGER,
    },
    book_id: {
        type: DataTypes.INTEGER,  
    }
  }, {
    sequelize,
    modelName: 'Cart_item',
  });
  return Cart_item;
};