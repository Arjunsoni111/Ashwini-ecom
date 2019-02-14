module.exports = function (app) {
    var Cart = require('../validations/validation.cart');
    app.route('/addToCart').post(Cart.addToCart);
    app.route('/getCart').post(Cart.getCart);
    app.route('/updateCart').post(Cart.updateCart);
    app.route('/removeCart').post(Cart.removeCart);
}