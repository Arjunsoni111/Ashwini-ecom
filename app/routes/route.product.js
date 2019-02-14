module.exports = function (app) {
    var product = require('../validations/validation.product');
    app.route('/getProducts').post(product.getProducts);
    app.route('/getProductById').post(product.getProductById);
}