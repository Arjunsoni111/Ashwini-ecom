module.exports = function (app) {
    var user = require('../validations/validation.user');
    app.route('/login').post(user.login);
}