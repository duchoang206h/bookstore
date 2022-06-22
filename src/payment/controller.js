const paymentService = require("./service");
const userService = require("../user/service");
const cartService = require("../cart/service");
const { USD_DONG } = require("../constants");
class PaymentController {
  getPaypalRedirectUrl = async (req, res) => {
    let items = await userService.getOrderItems(req.session.user.id);
    items = items.map((item) => {
      return {
        name: item.title,
        sku: item.id,
        price: (item.price / USD_DONG).toFixed(2),
        currency: "USD",
        quantity: item.amount,
      };
    });
    const amount = {
      currency: "USD",
      total: items
        .reduce((pre, current) => pre + current.price * current.quantity, 0)
        .toFixed(2),
    };
    req.session.user.amount = amount;
    const url = await paymentService.getRedirectUrlPaypal(items, amount);
    res.redirect(url);
  };

  paypalSuccess = async (req, res) => {
    try {
      const { PayerID, paymentId } = req.query;
      const result = await paymentService.executePaymentPaypal(
        PayerID,
        paymentId,
        req.session.user.amount
      );
      if (!result) return res.render("users/checkoutError");
      await userService.placeOrder(req.session.orderOject);
      return res.render("users/thankyou");
    } catch (error) {
      return res.render("users/checkoutError");
    }
  };

  paypalCancel = (req, res) => res.render("users/orderError");
}
module.exports = new PaymentController();
