var bcrypt = require('bcrypt-nodejs'),
		User = require('../models/users-model').Users;

exports.findUser = function(aEmail, aNext) {
  User.findOne({
    email: aEmail.toLowerCase()
  }, function(aError, aUser) {
    aNext(aError, aUser);
  });
};