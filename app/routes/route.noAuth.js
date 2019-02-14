module.exports = function (app) {
    var noAuth = require('./../validations/validation.noAuth');
    app.route('/appInitialize').post(noAuth.appInitialize);
}