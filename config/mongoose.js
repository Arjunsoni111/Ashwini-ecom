var config = require('./config');
var mongoose = require('mongoose');
mongoose.promise = require('bluebird');

module.exports = function(req, res){
	var db = mongoose.connect(config.db);
	return db;
}
