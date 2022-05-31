const BaseService =require( "../interfaces/BaseService");
const db = require('../../models')
const { Op } = require('sequelize')
 class BookService extends BaseService {
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