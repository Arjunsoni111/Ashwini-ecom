var constant = require('../../config/constants'),
	Gen = require('../modules/module.generic'),
	noAuth = require('../controllers/controller.noAuth');

module.exports.appInitialize = function (req, res, next) {
	try {
		var decrypt = req.body;
		if (!decrypt) {
			return res.json(Gen.responseReturn(constant.DATA_MISS));
		} else if (
			decrypt.os &&
			decrypt.osVersion &&
			decrypt.platform &&
			decrypt.make &&
			decrypt.model &&
			decrypt.manufacturer &&
			decrypt.screenWidth &&
			decrypt.screenHeight &&
			decrypt.deviceId &&
			decrypt.deviceToken
		) {
			var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
			if (ip.substr(0, 7) == "::ffff:") {
				decrypt.ipAddress = ip.substr(7)
			}
			noAuth.appInitialize(res, decrypt);
		} else {
			return res.json(Gen.responseReturn(constant.DATA_MISS));
		}
	} catch (Exception) {
		return res.json(Gen.responseReturn(constant.EXCEPTION));
	}
}
