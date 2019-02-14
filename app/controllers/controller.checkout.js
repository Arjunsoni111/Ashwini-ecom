var Product = require('../models/model.products'),
    Cart = require('../models/model.cart'),
    Order = require('../models/model.order'),
    constant = require('../../config/constants'),
    Gen = require('../modules/module.generic'),
    async = require('async'),
    objectID = require('mongodb').ObjectID;


module.exports.checkout = function (res, decrypt) {
    try {
        var water_data = {};
        async.waterfall([
            function (cb_water) {
                var inputParam = {};
                inputParam.$and = [
                    { isActive: true },
                    { isDeleted: false },
                    { userId: new objectID(decrypt.decode.userId) }
                ]
                Cart.find(inputParam).exec(function (err, cartItems) {
                    if (err) {
                        cb_water(err, null);
                    } else if (cartItems.length > 0) {
                        water_data.cartItems = cartItems;
                        cb_water(null, water_data);
                    } else {
                        cb_water(null, water_data);
                    }
                })
            },
            function (water_data, cb_water) {
                if (water_data.cartItems && water_data.cartItems.length > 0) {
                    var orderId = Math.floor(Math.random() * 90000) + 10000;
                    water_data.orderDetails = [];
                    async.eachSeries(water_data.cartItems, function (cartData, cb_fav) {
                        var inputParam = {};
                        inputParam.$and = [
                            { _id: new objectID(cartData.productId) },
                            { isActive: true },
                            { isDeleted: false }
                        ]
                        Product.findOne(inputParam).exec(function (err, product) {
                            if (err) {
                                cb_water(err, null);
                            } else if (product) {
                                if (product.quantity >= cartData.quantity) {
                                    var orderData = new Order();
                                    orderData.orderId = 'ORDER' + orderId;
                                    orderData.productId = new objectID(cartData.productId);
                                    orderData.quantity = cartData.quantity;
                                    orderData.buyingPrice = cartData.buyingPrice;
                                    orderData.price = cartData.price;
                                    orderData.userId = new objectID(decrypt.decode.userId);

                                    orderData.save(function (err, saved, affected) {
                                        if (!err && saved && (affected == 1)) {
                                            Product.findOneAndUpdate({ _id: new objectID(product._id) }, { quantity: (product.quantity - cartData.quantity) }, { new: true }, function (err, updated) {
                                                water_data.orderDetails.push(saved);
                                                cb_fav();
                                            })
                                        } else {
                                            cb_fav();
                                        }
                                    })
                                } else {
                                    cb_fav();
                                }
                            } else {
                                cb_fav();
                            }
                        })
                    }, function (err) {
                        if (err) {
                            cb_water(err, null);
                        } else {
                            cb_water(null, water_data);
                        }
                    })
                } else {
                    cb_water(null, water_data);
                }
            },
            function (water_data, cb_water) {
                if (water_data.orderDetails && water_data.orderDetails.length > 0) {
                    Cart.remove({userId: new objectID(decrypt.decode.userId)}).exec(function (err, deleteCart) {
                        cb_water(null, water_data);
                    })
                } else {
                    cb_water(null, water_data);
                }
            },
        ], function (err, results) {
            if (err) {
                console.log(err);
                return res.json(Gen.responseReturn(constant.EXCEPTION));
            } else {
                if (results) {
                    var orderId = results.orderDetails[0].orderId;
                    if(orderId != ""){
                        return res.json(Gen.responseReturn(constant.CHECKOUT_SUCCESS, {"orderId": orderId}, true));
                    } else{
                        return res.json(Gen.responseReturn(constant.NO_DATA));
                    }
                } else {
                    return res.json(Gen.responseReturn(constant.NO_DATA));
                }
            }
        })
    } catch (Exception) {
        console.log(Exception);
        return res.json(Gen.responseReturn(constant.EXCEPTION));
    }
}