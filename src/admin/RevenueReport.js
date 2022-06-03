const db =  require('../models');
const { stringify } = require('csv-stringify/sync');
const day = require('dayjs')
const fs = require('fs');
class RevenueReport {
    constructor(){
       
    }
    getDailyRevenueReport = async () => {
        fs.writeFileSync(__dirname + '/csv.csv', stringify( "", {header: true}))
    };
    getDailyOrderReport =   async () =>{
        /* const orders = await db.Order.find({
            where: {
                
            }
        })
        fs.writeFileSync(__dirname + '/csv.csv', stringify( , {header: true})) */
    }
}