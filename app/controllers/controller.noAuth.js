var Device = require('../models/model.devices'),
	constant = require('../../config/constants'),
	Dev = require('../../config/env/' + process.env.NODE_ENV),
	Gen = require('../modules/module.generic'),
	jsonwebtoken = require('jsonwebtoken');

module.exports.appInitialize = function (res, decrypt) {
	try {
		var update = new Device();
		var serach = {};
		update.deviceId = serach.deviceId = decrypt.deviceId;
		update.deviceToken = serach.deviceToken = decrypt.deviceToken;
		update.ipAddress = decrypt.ipAddress;
		update.os = decrypt.os ? Gen.sanitizeString(decrypt.os) : "";
		update.osVersion = decrypt.osVersion ? Gen.sanitizeString(decrypt.osVersion) : "";
		update.platform = decrypt.platform ? Gen.sanitizeString(decrypt.platform) : "";
		update.make = decrypt.make ? Gen.sanitizeString(decrypt.make) : "";
		update.model = decrypt.model ? Gen.sanitizeString(decrypt.model) : "";
		update.manufacturer = decrypt.manufacturer ? Gen.sanitizeString(decrypt.manufacturer) : "";
		update.screenWidth = decrypt.screenWidth ? decrypt.screenWidth : "";
		update.screenHeight = decrypt.screenHeight ? decrypt.screenHeight : "";

		Device.findOne(serach).exec(function (err, device) {
			if (err) {
				return res.json(Gen.responseReturn(constant.EXCEPTION));
			} else if (device) {
				var response = {};
				response.tempId = device._id;
				response.token = jsonwebtoken.sign({ type: "temp", tempId: device._id }, Dev.JWT_CONSTANT, { expiresIn: '1h' });
				return res.json(Gen.responseReturn(constant.SUCCESS, response, true));
			} else {
				update.save(function (err, saved, affected) {
					if (!err && saved && (affected == 1)) {
						var response = {};
						response.tempId = saved._id;
						response.token = jsonwebtoken.sign({ type: "temp", tempId: saved._id }, Dev.JWT_CONSTANT, { expiresIn: '1h' });
						return res.json(Gen.responseReturn(constant.SUCCESS, response, true));
					} else {
						return res.json(Gen.responseReturn(constant.EXCEPTION));
					}
				})
			}
		});
	} catch (Exception) {
		return res.json(Gen.responseReturn(constant.EXCEPTION));
	}
}
