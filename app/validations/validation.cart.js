var Cart = require('../controllers/controller.cart'),
	constant = require('../../config/constants'),
	Gen = require('../modules/module.generic'),
	objectID = require('mongodb').ObjectID;

module.exports.getCart = function (req, res, next) {
	try {
		var decrypt = req.body;
		Cart.getCart(res, decrypt);
	} catch (Exception) {
		return res.json(Gen.responseReturn(constant.EXCEPTION));
	}
}

module.exports.addToCart = function (req, res, next) {
	try {
		var decrypt = req.body;
		if (!decrypt) {
			return res.json(Gen.responseReturn(constant.DATA_MISS));
		} else if (objectID.isValid(decrypt.productId) && decrypt.qty > 0) {
			Cart.addToCart(res, decrypt);
		} else {
			return res.json(Gen.responseReturn(constant.DATA_MISS));
		}
	} catch (Exception) {
		return res.json(Gen.responseReturn(constant.EXCEPTION));
	}
}

module.exports.updateCart = function (req, res, next) {
	try {
		var decrypt = req.body;
		if (!decrypt) {
			return res.json(Gen.responseReturn(constant.DATA_MISS));
		} else if (objectID.isValid(decrypt.productId) && objectID.isValid(decrypt.cartId) && decrypt.qty > 0) {
			Cart.updateCart(res, decrypt);
		} else {
			return res.json(Gen.responseReturn(constant.DATA_MISS));
		}
	} catch (Exception) {
		return res.json(Gen.responseReturn(constant.EXCEPTION));
	}
}

module.exports.removeCart = function (req, res, next) {
	try {
		var decrypt = req.body;
		if (!decrypt) {
			return res.json(Gen.responseReturn(constant.DATA_MISS));
		} else if (objectID.isValid(decrypt.productId) && objectID.isValid(decrypt.cartId)) {
			Cart.removeCart(res, decrypt);
		} else {
			return res.json(Gen.responseReturn(constant.DATA_MISS));
		}
	} catch (Exception) {
		return res.json(Gen.responseReturn(constant.EXCEPTION));
	}
}
