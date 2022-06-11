const { v4: uuidv4 } = require('uuid');

module.exports = (req) => {
   
    return uuidv4();
}