var Device = require('../models/model.devices'),
	User = require('../models/model.users'),
	Cart = require('../models/model.cart'),
	constant = require('../../config/constants'),
	Gen = require('../modules/module.generic'),
	jsonwebtoken = require('jsonwebtoken'),
	Dev = require('../../config/env/' + process.env.NODE_ENV),
	objectID = require('mongodb').ObjectID;

module.exports.login = function (res, decrypt) {
	try {
		decrypt.loginType = decrypt.loginType.toLowerCase();
		var inputParams = {
			$or: [
				{ loginId: decrypt.loginId },
				{ accessToken: decrypt.accessToken }
			],
			isActive: true,
		};
		var updateUserId = ((userId) => {
			Cart.updateMany({ tempId: objectID(decrypt.decode.tempId) }, { userId: new objectID(userId) }, { new: true })
			Device.updateMany({ _id: objectID(decrypt.decode.tempId) }, { userId: new objectID(userId) }, { new: true })
		})
		User.findOne(inputParams).exec(function (err, user) {
			if (err) {
				return res.json(Gen.responseReturn(constant.EXCEPTION));
			} else if (user) {
				var resObj = {};
				resObj.type = "user";
				resObj.appUserId = user._id;
				resObj.appPhotoId = user.photoId;
				resObj.appPhotoUrl = user.photoUrl;
				resObj.appUserName = user.name;
				resObj.appUserPhone = user.phone;
				resObj.appUserEmail = user.email;
				resObj.token = jsonwebtoken.sign({ type: "user", userId: user._id }, Dev.JWT_CONSTANT);
				updateUserId(user._id);
				return res.json(Gen.responseReturn(constant.LOGIN_SUCCESS, resObj, true));
			} else {
				var dataObj = new User();
				dataObj.loginId = decrypt.loginId;
				dataObj.accessToken = decrypt.accessToken;
				dataObj.loginType = decrypt.loginType;
				dataObj.save(function (err, saved, affected) {
					if (affected == 1) {
						var resObj = {};
						resObj.type = "user";
						resObj.appUserId = saved._id;
						resObj.token = jsonwebtoken.sign({ type: "user", userId: saved._id }, Dev.JWT_CONSTANT);
						updateUserId(user._id);
						return res.json(Gen.responseReturn(constant.LOGIN_SUCCESS, resObj, true));
					} else {
						return res.json(Gen.responseReturn(constant.EXCEPTION));
					}
				});
			}
		});
	} catch (Exception) {
		return res.json(Gen.responseReturn(constant.EXCEPTION));
	}
}