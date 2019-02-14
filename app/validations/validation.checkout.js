var Checkout = require('../controllers/controller.checkout'),
	constant = require('../../config/constants'),
	Gen = require('../modules/module.generic'),
	objectID = require('mongodb').ObjectID;

module.exports.checkout = function (req, res, next) {
	try {
        var decrypt = req.body;
        console.log(decrypt.decode);
		if (!decrypt) {
			return res.json(Gen.responseReturn(constant.DATA_MISS));
		} else if (decrypt.decode.type == 'user' && objectID.isValid(decrypt.decode.userId)) {
			Checkout.checkout(res, decrypt);
		} else {
			return res.json(Gen.responseReturn(constant.USER_NOT_LOGIN));
		}
	} catch (Exception) {
		return res.json(Gen.responseReturn(constant.EXCEPTION));
	}
}
