var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var movieService = require('../services/users-service');

var userSchema = new Schema({
	name: {type: String},
	email: {type: String},
	password: {type: String}
});

var Users = mongoose.model('Users', userSchema);

module.exports = {
    Users: Users
};