const db = require('../models');

(async  () =>{
  await db.sequelize.authenticate();
  const users = await  User.findAll({
    include:  db.Role });

  const cart_items =  await  db.Cart_item.findAll({
    include: db.Book
  });
  console.log(users)
})()