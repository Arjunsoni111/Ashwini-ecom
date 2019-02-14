module.exports = function (app) {
    var Checkout = require('../validations/validation.checkout');
    app.route('/checkout').post(Checkout.checkout);
}