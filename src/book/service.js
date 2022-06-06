const BaseRepo =require( "../interfaces/BaseRepo");
const db = require('../models')
const { Op } = require('sequelize')
 class BookService extends BaseRepo {
    constructor(model) {
        super(model);
    }
    async searchByTitle(title){
        return await  this.model.findAll({where:{
            title:{
                [Op.like]: `%${title}%`
            }}})
    }
}
module.exports = new BookService(db.Book);