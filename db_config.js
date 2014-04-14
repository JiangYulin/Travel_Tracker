/**
 * Created by jiangyulin on 13-12-25.
 */

var Server = 'localhost';
var DB = 'test';
var Port = '';

exports.mongoose = require('mongoose');
this.mongoose.connect("mongodb://"+Server+"/"+DB);
exports.db = this.mongoose.connection;
this.db.on('error',console.error.bind(console,'connection error:'));