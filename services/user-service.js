var bcrypt = require('bcrypt-nodejs'),
		User = require('../models/user').User;

exports.findUser = function(email, next) {
  User.findOne({
    email: email.toLowerCase()
  }, function(err, user) {
    next(err, user);
  });
};