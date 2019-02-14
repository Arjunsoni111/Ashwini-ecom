var Product = require('../models/model.products'),
	Cart = require('../models/model.cart'),
	constant = require('../../config/constants'),
	Gen = require('../modules/module.generic'),
	objectID = require('mongodb').ObjectID;

module.exports.addToCart = function (res, decrypt) {
	try {
		var inputParam = {};
		inputParam.$and = [
			{ _id: new objectID(decrypt.productId) },
			{ isActive: true },
			{ isDeleted: false }
		]
		Product.findOne(inputParam).exec(function (err, product) {
			if (err) {
				return res.json(Gen.responseReturn(constant.EXCEPTION));
			} else if (product) {
				if (product.quantity >= decrypt.qty) {
					var inputParam = {};
					if (decrypt.decode.type == 'temp') {
						inputParam.$and = [
							{ productId: new objectID(decrypt.productId) },
							{ tempId: new objectID(decrypt.decode.tempId) },
							{ isActive: true },
							{ isDeleted: false }
						]
					} else if (decrypt.decode.type == 'user') {
						inputParam.$and = [
							{ productId: new objectID(decrypt.productId) },
							{ userId: new objectID(decrypt.decode.userId) },
							{ isActive: true },
							{ isDeleted: false }
						]
					}
					Cart.find(inputParam).exec(function (err, carItems) {
						if (err) {
							return res.json(Gen.responseReturn(constant.EXCEPTION));
						} else if (carItems.length == 0) {
							//add to cart
							var update = new Cart();
							update.productId = new objectID(decrypt.productId);
							update.quantity = decrypt.qty;
							if (product.offerStatus == true) {
								var price = product.offrePrice;
							} else {
								var price = product.price;
							}
							update.buyingPrice = price;
							update.price = product.price;
							if (decrypt.decode.type == 'temp') {
								update.tempId = new objectID(decrypt.decode.tempId);
							} else if (decrypt.decode.type == 'user') {
								update.userId = new objectID(decrypt.decode.userId);
							}
							update.save(function (err, saved, affected) {
								if (!err && saved && (affected == 1)) {
									return res.json(Gen.responseReturn(constant.ADDED_TO_CART, {}, true));
								} else {
									return res.json(Gen.responseReturn(constant.EXCEPTION));
								}
							})
						} else {
							return res.json(Gen.responseReturn(constant.ALLREADY_IN_CART));
						}
					})
				} else {
					return res.json(Gen.responseReturn(constant.OUT_OF_STOCK));
				}

			} else {
				return res.json(Gen.responseReturn(constant.EXCEPTION));
			}
		})
	} catch (Exception) {
		return res.json(Gen.responseReturn(constant.EXCEPTION));
	}
}

module.exports.getCart = function (res, decrypt) {
	try {
		var dataObj = [];
		var sort = { dateUpdated: -1 };
		if (decrypt.decode.type == 'temp') {
			dataObj.push(
				{
					$match: {
						$and: [
							{ "tempId": new objectID(decrypt.decode.tempId) },
							{ isActive: true },
							{ isDeleted: false }
						]
					}
				},
			)
		} else if (decrypt.decode.type == 'user') {
			dataObj.push(
				{
					$match: {
						$and: [
							{ "userId": new objectID(decrypt.decode.userId) },
							{ isActive: true },
							{ isDeleted: false }
						]
					}
				},
			)
		}

		dataObj.push(
			{
				$lookup: {
					from: 'products',
					localField: 'productId',
					foreignField: '_id',
					as: 'productData'
				}
			},
			{
				$match: {
					$and: [
						{ isActive: true },
						{ isDeleted: false }
					]
				}
			},
			{
				$project: {
					"_id": 0,
					cartId: "$_id",
					cartQuantity: "$quantity",
					buyingPrice: "$buyingPrice",
					originalPrice: "$price",
					productId: "$productId",
					sku: { $arrayElemAt: ["$productData.sku", 0] },
					productName: { $arrayElemAt: ["$productData.productName", 0] },
					price: { $arrayElemAt: ["$productData.price", 0] },
					offerPrice: { $arrayElemAt: ["$productData.offerPrice", 0] },
					offerStatus: { $arrayElemAt: ["$productData.offerStatus", 0] },
					quantity: { $arrayElemAt: ["$productData.quantity", 0] }
				}
			},
			{
				$sort: sort
			}
		)
		Cart.aggregate(dataObj).exec(function (err, cartDetails) {
			if (err) {
				return res.json(Gen.responseReturn(constant.EXCEPTION));
			}
			if (cartDetails && cartDetails.length > 0) {
				var result = {};
				result.carItems = cartDetails;
				return res.json(Gen.responseReturn(constant.SUCCESS, result, true));
			} else {
				return res.json(Gen.responseReturn(constant.NO_DATA));
			}
		})
	} catch (Exception) {
		return res.json(Gen.responseReturn(constant.EXCEPTION));
	}
}

module.exports.updateCart = function (res, decrypt) {
	try {
		var inputParam = {};
		inputParam.$and = [
			{ _id: new objectID(decrypt.productId) },
			{ isActive: true },
			{ isDeleted: false }
		]
		Product.findOne(inputParam).exec(function (err, product) {
			if (err) {
				return res.json(Gen.responseReturn(constant.EXCEPTION));
			} else if (product) {
				if (product.quantity >= decrypt.qty) {
					var inputParam = {};
					if (decrypt.decode.type == 'temp') {
						inputParam.$and = [
							{ _id: new objectID(decrypt.cartId) },
							{ productId: new objectID(decrypt.productId) },
							{ tempId: new objectID(decrypt.decode.tempId) },
							{ isActive: true },
							{ isDeleted: false }
						]
					} else if (decrypt.decode.type == 'user') {
						inputParam.$and = [
							{ _id: new objectID(decrypt.cartId) },
							{ productId: new objectID(decrypt.productId) },
							{ userId: new objectID(decrypt.decode.userId) },
							{ isActive: true },
							{ isDeleted: false }
						]
					}
					Cart.findOneAndUpdate(inputParam, { quantity: decrypt.qty }, { new: true }, function (err, updated) {
						if (err) {
							return res.json(Gen.responseReturn(constant.EXCEPTION));
						} else if (updated) {
							return res.json(Gen.responseReturn(constant.UPDATE_CART, {}, true));
						} else {
							return res.json(Gen.responseReturn(constant.NO_DATA));
						}
					})
				} else {
					return res.json(Gen.responseReturn(constant.OUT_OF_STOCK));
				}

			} else {
				return res.json(Gen.responseReturn(constant.EXCEPTION));
			}
		})
	} catch (Exception) {
		return res.json(Gen.responseReturn(constant.EXCEPTION));
	}
}

module.exports.removeCart = function (res, decrypt) {
	try {
		var inputParam = {};
		if (decrypt.decode.type == 'temp') {
			inputParam.$and = [
				{ _id: new objectID(decrypt.cartId) },
				{ productId: new objectID(decrypt.productId) },
				{ tempId: new objectID(decrypt.decode.tempId) }
			]
		} else if (decrypt.decode.type == 'user') {
			inputParam.$and = [
				{ _id: new objectID(decrypt.cartId) },
				{ productId: new objectID(decrypt.productId) },
				{ userId: new objectID(decrypt.decode.userId) }
			]
		}
		Cart.remove(inputParam).exec(function (err, deleteCart) {
			if (err) {
				return res.json(Gen.responseReturn(constant.EXCEPTION));
			} else if (deleteCart) {
				return res.json(Gen.responseReturn(constant.DELETE_CART, {}, true));
			} else {
				return res.json(Gen.responseReturn(constant.EXCEPTION));
			}
		})
	} catch (Exception) {
		return res.json(Gen.responseReturn(constant.EXCEPTION));
	}
}

