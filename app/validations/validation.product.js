var product = require('../controllers/controller.product'),
	constant = require('../../config/constants'),
	Gen = require('../modules/module.generic'),
	objectID = require('mongodb').ObjectID;

module.exports.getProducts = function (req, res, next) {
	try {
		var decrypt = req.body;
		if (!decrypt) {
			return res.json(Gen.responseReturn(constant.DATA_MISS));
		} else if (decrypt.pageNo && decrypt.pageSize) {
			product.getProducts(res, decrypt);
		} else {
			return res.json(Gen.responseReturn(constant.DATA_MISS));
		}
	} catch (Exception) {
		return res.json(Gen.responseReturn(constant.EXCEPTION));
	}
}
module.exports.getProductById = function (req, res, next) {
	try {
		var decrypt = req.body;
		if (!decrypt) {
			return res.json(Gen.responseReturn(constant.DATA_MISS));
		} else if (objectID.isValid(decrypt.productId)) {
			product.getProductById(res, decrypt);
		} else {
			return res.json(Gen.responseReturn(constant.DATA_MISS));
		}
	} catch (Exception) {
		return res.json(Gen.responseReturn(constant.EXCEPTION));
	}
}
