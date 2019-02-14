var Product = require('../models/model.products'),
	constant = require('../../config/constants'),
	Gen = require('../modules/module.generic'),
	objectID = require('mongodb').ObjectID;

module.exports.getProducts = function (res, decrypt) {
	try {
		var inputParam = { isActive: true, isDeleted: false };
		if (decrypt.search_key != "") {
			inputParam.$or = [
				{ name: new RegExp(".*" + decrypt.search_key + ".*", 'i') },
				{ type: new RegExp(".*" + decrypt.search_key + ".*", 'i') },
				{ category: new RegExp(".*" + decrypt.search_key + ".*", 'i') },
				{ sku: new RegExp(".*" + decrypt.search_key + ".*", 'i') },
				{ description: new RegExp(".*" + decrypt.search_key + ".*", 'i') },
			]
		}
		var limit = constant.ADMIN_LIST_LIMIT;
		if (decrypt.pageSize >= 5) {
			limit = decrypt.pageSize;
		}
		var skip = 0;
		if (decrypt.pageNo) {
			skip = (limit * decrypt.pageNo) - limit;
		}
		Product.find(inputParam).sort({ dateUpdated: -1 }).skip(skip).limit(limit).exec(function (err, product) {
			if (err) {
				return res.json(Gen.responseReturn(constant.EXCEPTION));
			} else if (product.length > 0) {
				return res.json(Gen.responseReturn(constant.SUCCESS, product, true));
			} else {
				return res.json(Gen.responseReturn(constant.NO_DATA, [], false));
			}
		})
	} catch (Exception) {
		return res.json(Gen.responseReturn(constant.EXCEPTION));
	}
}
module.exports.getProductById = function (res, decrypt) {
	try {
		Product.findOne({ _id: objectID(decrypt.productId), isActive: true, isDeleted: false }).exec(function (err, product) {
			if (err) {
				return res.json(Gen.responseReturn(constant.EXCEPTION));
			} else if (product) {
				return res.json(Gen.responseReturn(constant.SUCCESS, product, true));
			} else {
				return res.json(Gen.responseReturn(constant.NO_DATA, {}, true));
			}
		})
	} catch (Exception) {
		return res.json(Gen.responseReturn(constant.EXCEPTION));
	}
}
