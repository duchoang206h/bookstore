'use strict';
const bcrypt = require('bcrypt')
module.exports = {
  async up (queryInterface, Sequelize) {
    
      await queryInterface.bulkInsert('Users', [{
        fullname: 'Duc Hoang',
        email: "duchoang206h@gmail.com",
        password:  bcrypt.hashSync('admin', 10),
        address: "Hue",
        role_id: 1
      }], {});
   
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
