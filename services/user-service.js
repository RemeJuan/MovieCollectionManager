var bcrypt = require('bcrypt-nodejs'),
		User = require('../models/users-model').Users;

exports.findUser = function(aEmail, aNext) {
  User.findOne(
  {
    email: aEmail.toLowerCase()
  },
  function(aError, aUser) {
    aNext(aError, aUser);
  });
};

exports.updateUser = function(uId, aData, aNext) {
	var userModel = {
		name: aData.name,
		email: aData.email
	};

	if(aData.password) {
		bcrypt.hash(aData.password, null, null, function(aError, aHash) {
		  if(aError) {
		    return aNext(aError);
		  }
		  userModel.password = aHash;
		});
	}

	User.findOne(
	{
		_id: uId
	},
	userModel,
	function(aError, aAffected, aResponse, aUser) {
		if (aError) {
			console.log('error', aError);
			return aNext(aError);
		};

		return aNext(null, aUser);
	});
}

exports.setupDefault = function(aNext) {
	User.findOne(
	{
		email: 'admin@admin'
	},
	function(aError, aUser) {
		if(!aUser) {
			// create a default user
			var defaultUser = User({
			  name: 'Admin User',
			  email: 'admin@admin',
			  password: 'password'
			});

			// save the user
			defaultUser.save(function(aError) {
			  if (aError) aNext(aError);
			  return aNet(null);
			});
		}
	})
}