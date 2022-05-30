const BaseService = require('../interfaces/BaseService');
const db = require('../../models')
const db = require("../../models");
class Service extends BaseService{
    constructor(model) {
        super(model);
    }
}