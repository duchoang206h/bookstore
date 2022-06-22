const BaseRepo =require( "../repo/BaseRepo");
const db = require('../models')
const { Op } = require('sequelize');
const cachService = require('../cache/cacheService');
const EXPIRED_TIME_IN_SECOND = 3600*6;
 class BookService extends BaseRepo {
    constructor(model) {
        super(model);
    }

     async count() {
         const count = cachService.get('book_count')
         if(!count) {
             const count = await this.model.count();
             cachService.set('book_count', count, EXPIRED_TIME_IN_SECOND );
             return count
         }
         return count
     }

      async findAll(Oject) {
         return await this.model.findAll(Oject)
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