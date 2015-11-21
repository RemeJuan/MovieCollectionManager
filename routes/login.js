var express 	= require('express'),
		router 		= express.Router(),
		locale 		= require('../locale/en_gb'),
		passport 	= require('passport'),
		flash = require('connect-flash'),
		session 	= require('express-session'),
		userService = require('../services/user-service');

var movieData,
	imgDir = 'public/images/w342/',
	thumbDir = 'public/images/w92/';

router.use(flash());

router.route('/')
.get(function (aRequest, aResponse) {
	var flashSuccess = aRequest.flash('success'),
		flashError = aRequest.flash('error');

	userService.setupDefault();

	var vm =  {
		loginView	: true,
		user 			: aRequest.user || null,
		lang			: locale,
		message 	: aRequest.session.messages,
		success 	: flashSuccess,
		error 		: flashError
	};

	return aResponse.render('index', vm);
})
.post(function (aRequest, aResponse, aNext) {
	passport.authenticate('local', function(aError, aUser, aInfo) {
		if (aError) {
			return aNext(aError);
		}
		if (!aUser) {
			aRequest.flash('error', 'Invalid login details');
			return aResponse.redirect('/login');
		}

		aRequest.logIn(aUser, function(aError) {
			if (aError) {
				return aNext(aError);
			}
			return aResponse.redirect('/');
		});
	})(aRequest, aResponse, aNext);
});

module.exports = router;