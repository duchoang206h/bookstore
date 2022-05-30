
module.exports =  class BaseService {

    constructor( model){
        this.model = model
    }
     async findById (id ){
        return await this.model.findByPk
    }

    async findAll() {
        return await this.model.findAll();
    }

    async count(){
        return await this.model.count();
    }

    async create(object){
        return await this.model.create(object);
    }

    async createMany  (objects) {
        return await  this.model.bulkCreate(objects);
    }

    async  update (id , update){
        return await  this.model.update(update, {where:{id:id}})
    }

    async delete  (id ) {
        return await this.model.destroy({where:{id:id}});
    }
}