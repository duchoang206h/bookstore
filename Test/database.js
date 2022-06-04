const db = require('../models');

(async  () =>{
  await db.sequelize.authenticate();
  const cart_items =  await  db.Cart_item.findAll({
    include: db.Book
  });

  const count = await db.Book.count();
  console.log(count)
})()