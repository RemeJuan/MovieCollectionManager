var express = require('express');
var router = express.Router();
var mdb = require('moviedb')('1046d0e8bf3b7860228747333688b85d');
var http = require('http');
var moviesService = require('../services/movies-service');
var locale = require('../locale/en_gb');
var downloader = require('downloader');
var fs = require('fs-extra');
var flash = require('connect-flash');
var session = require('express-session');

var movieData, location, limit = 10, pagination = [], messageSent,
	imgDir = 'public/images/w342/',
	thumbDir = 'public/images/w92/';

router.use(session({
	secret: 'keyboard cowboy',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 60000 }
}))
router.use(flash());

router.route('/')
.get(function (aRequest, aResponse) {
	moviesService.prepAdmin({}, function (aError, aResults) {
		var flashSuccess = aRequest.flash('success'),
			flashError = aRequest.flash('error');

		return aResponse.render('index', {
			adminView: true,
			lang: locale,
			admin: aResults,
			success: flashSuccess,
			error: flashError
		});

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

module.exports = router;	