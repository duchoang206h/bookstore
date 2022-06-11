const db = require("../models")
module.exports = async ()=>{
 await db.sequelize.authenticate();
 console.log("database connected")
}