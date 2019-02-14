process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var cluster = require('cluster');
var express = require('./config/express');
var mongoose = require('./config/mongoose');

var db = mongoose();
var app = express(db);
if (cluster.isMaster) {
    var cpuCount = require('os').cpus().length;
	console.log(cpuCount);
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }
	cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });
    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });
} else {
    var app = express(db);
	app.listen(9070, function(){
	  console.log('connected to port 9070');
	});
}
module.exports = app;
