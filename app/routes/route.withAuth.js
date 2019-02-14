module.exports = function (app) {
    require('./route.user')(app);
    require('./route.product')(app);
    require('./route.cart')(app);
    require('./route.checkout')(app);
}