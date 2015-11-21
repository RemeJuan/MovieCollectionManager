var bcrypt 	= require('bcrypt-nodejs'),
		User 		= require('../models/users-model').Users,
		async 	= require('async');

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
	async.waterfall([
		function(aDone) {
			var userModel;

			if(aData.password) {
				bcrypt.hash(aData.password, null, null, function(aError, aHash) {
				  if(aError) {
				    return aNext(aError);
				  }
				  userModel = {
			  		name: aData.name,
			  		email: aData.email,
			  		password: aHash
			  	}
			  	return aDone(null, userModel);
				});
			}
			else {
			  userModel = {
		  		name: aData.name,
		  		email: aData.email
		  	}
		  	return aDone(null, userModel);
			};
		},
		function(userModel, aDone) {
			User.update(
			{
				_id: uId
			},
			userModel,
			function(aError, aAffected) {
				if (aError) {
					console.log('error', aError);
					return aNext(aError);
				};

				return aDone(null);
			});
		}
	], function(aError) {
	  if (aError) return aNext(aError);
	  return aNext(null);
	});
}

exports.setupDefault = function(aNext) {
	User.find({},
	function(aError, aUser) {
		if(aUser.length === 0) {
			// create a default user
			var defaultUser = User({
			  name: 'Admin User',
			  email: 'admin@admin',
			  password: '$2a$10$h/ZkJFAjUYGPsJYAILVbjOnfsuyDX5YU/SNeLZbCy.SzKWsgPHNIC'
			});
			// save the user
			defaultUser.save(function(aError) {
			  if (aError) aNext(aError);
			  return aNet(null);
			});
		}
	})
}