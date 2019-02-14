var User = require('../controllers/controller.user'),
	constant = require('../../config/constants'),
	Gen = require('../modules/module.generic');

module.exports.login = function (req, res, next) {
	try {
		var decrypt = req.body;
		if (!decrypt) {
			return res.json(Gen.responseReturn(constant.DATA_MISS));
		} else if (decrypt.loginType && (decrypt.accessToken || decrypt.loginId)) {
			User.login(res, decrypt);
		} else {
			return res.json(Gen.responseReturn(constant.DATA_MISS));
		}
	} catch (Exception) {
		return res.json(Gen.responseReturn(constant.EXCEPTION));
	}
}
