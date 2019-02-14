"use strict"
var constant = require('../../config/constants');

exports.isEmpty = function (str) {
    return (!str || 0 === str.length);
}

exports.isNumber = function (num) {
    return (!isNAN(num) && (num >= 0));
}

exports.loginAuthenticated = function (req, res, next) {
    if (req.user) {
        next();
    } else {
        return res.json({ data: Gen.responseReturn(constant.codeNoData, constant.authError) });
    }
}

exports.sanitizeString = function (str) {
    if (str) {
        str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "");
        return str.trim();
    } else {
        return str;
    }
}

exports.responseReturn = function (code, data = {}, status = false) {
    var result = {};
    result.code = code;
    result.message = exports.getMessageByCode(code);
    result.data = (Object.getOwnPropertyNames(data).length === 0) ? {} : (data);
    result.success = status;
    return result;
}

exports.getMessageByCode = function (code) {
    var message = 'Unknown error';
    if ((constant.codes[code] !== undefined) && (Number.isInteger(code)) && (code !== 0) && (code.toString().length <= 7)) {
        message = constant.codes[code];
    }
    return message;
}
