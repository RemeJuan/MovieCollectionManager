var passport        = require('passport'),
    passportLocal   = require('passport-local'),
    bcrypt          = require('bcrypt-nodejs'),
    userService     = require('../services/user-service');

module.exports = function() {
  passport.use( new passportLocal.Strategy( {usernameField: 'email'}, function(aEmail, aPassword, aNext) {
    userService.findUser(aEmail, function(aError, aUser) {
      if (aError) {
        return aNext(aError);
      }
      if(!aUser) {
        return aNext(null, false);
      }
      bcrypt.compare(aPassword, aUser.password, function(aError, aMatch) {
        if(aError) {
          return aNext(aError);
        }
        if(!aMatch) {
          return aNext(null, false);
        }
        aNext(null, aUser);
      });
    });
  }));
  passport.serializeUser(function(aUser, aNext) {
      aNext(null, aUser.email);
  });

  passport.deserializeUser(function(aEmail, aNext){
     userService.findUser(aEmail, function(aError, aUser) {
         aNext(aError, aUser);
     });
  });
};