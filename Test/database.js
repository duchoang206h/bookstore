const db = require('../src/models');

(async  () =>{
  await db.sequelize.authenticate();
  let orders = await db.Order.findAll({
   where: {user_id: 2},
  include:{ model: db.Order_item, as:"items", include:{ model: db.Book}},

  });
  
  orders = orders.map(order => {
    let items = order.items.map( item =>{
      return { 
        amount: item['amount'],
        title: item['Book'].title,
        image: item['Book'].image,
        price: item['Book'].price,
        total: item['amount'] * item['Book'].price
      }
    });
    
    return Object.assign(order, { items})
  });
  console.log(orders[0])
})()