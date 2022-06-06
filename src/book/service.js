const BaseRepo =require( "../repo/BaseRepo");
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
    async searchByCategory (id){
        return await this.model.findAll({
            where:{
                category_id: id
            }
        })
    }
}
module.exports = new BookService(db.Book);