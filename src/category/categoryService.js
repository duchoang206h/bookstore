const BaseService = require('../interfaces/BaseService');
const db = require('../../models')
 class CategoryService extends BaseService{
    constructor(model) {
        super(model);
    }
}
module.exports = new CategoryService(db.Category)