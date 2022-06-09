'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     Book.belongsTo(models.Category,  {  foreignKey: 'category_id'});
    }
  }
  Book.init({
    id: {
      type:DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: DataTypes.STRING,
    image:  DataTypes.STRING,
    price: DataTypes.FLOAT,
    category_id:{
      type:DataTypes.INTEGER
    },
    description:DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Book',
    tableName:"Books"
  });
  return Book;
};