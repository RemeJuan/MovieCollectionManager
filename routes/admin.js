var express 				= require('express'),
		router 					= express.Router(),
		mdb 						= require('moviedb')('1046d0e8bf3b7860228747333688b85d'),
		http 						= require('http'),
		moviesService 	= require('../services/movies-service'),
		userService 		= require('../services/user-service'),
		locale 					= require('../locale/en_gb'),
		downloader 			= require('downloader'),
		fs 							= require('fs-extra'),
		flash 					= require('connect-flash'),
		session 				= require('express-session'),

		movieData, location, limit = 10, pagination = [], messageSent,
		imgDir = 'public/images/w342/',
		thumbDir = 'public/images/w92/';

router.use(flash());

router.route('/')
.get(function (aRequest, aResponse) {
	moviesService.prepAdmin({}, function (aError, aResults) {
		var flashSuccess = aRequest.flash('success'),
			flashError = aRequest.flash('error'),
			vm = {
				adminView	: true,
				user 			: aRequest.user || null,
				lang			: locale,
				admin 		: aResults,
				success 	: flashSuccess,
				error 		: flashError
			};

		return aResponse.render('index', vm);
	});
})
.post(function (aRequest, aResponse) {

});

router.route('/:collection/save')
.post(function (aRequest, aResponse) {
	moviesService.adminSave(aRequest.params.collection, aRequest.body, function (aError, aResults) {
		if (aError) {
			console.error(aError);
			aRequest.flash('error', 'Entry not saved');
		} else {
			aRequest.flash('success', 'New entry added');
		};

		return aResponse.redirect('/admin');
	});
});

router.route('/:collection/update')
.post(function (aRequest, aResponse) {
	moviesService.adminUpdate(aRequest.params.collection, aRequest.body, function (aError, aResults) {
		if (aError) {
			console.error(aError);
			aRequest.flash('error', 'Entry not updated');
		} else {
			aRequest.flash('success', 'New updated');
		};

		return aResponse.redirect('/admin');
	});
});

router.route('/:collection/delete/:entry')
.get(function (aRequest, aResponse) {
	moviesService.adminDelete(aRequest.params.collection, aRequest.params.entry, function (aError, aResults) {
		if (aError) {
			console.error(aError);
			aRequest.flash('error', 'Entry not deleted');
		} else {
			aRequest.flash('success', 'Entry deleted');
		};

		return aResponse.redirect('/admin');
	});
});

router.route('/updateuser')
.post(function(aRequest, aResponse) {
	userService.updateUser(aRequest.user._id, aRequest.body, function(aError, aResult) {

	});
});

module.exports = router;