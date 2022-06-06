const db =  require('../models');
const { stringify } = require('csv-stringify/sync');
const fs = require('fs');
const dayjs = require('dayjs');
class RevenueReport {
    constructor(){
       
    }
    getDailyRevenueReport = async () => {
       /*  const filename =  */
       /*  fs.writeFileSync(__dirname + , stringify( "", { header: true })) */
    };
    /**
     * 
     * @returns {string} filename - File name destination
     */
    getDailyOrderReport =   async () =>{
        const filename = '../reports'+ dayjs('YY_MM_DD') + 'dailyreport.csv' 
        const orders = await db.Order.find({
            where: {
                
            }
        })
        fs.writeFileSync(__dirname + filename, stringify( orders , { header: true }));
        return filename
    }
}