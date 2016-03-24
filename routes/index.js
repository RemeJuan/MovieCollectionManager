var express = require('express');
var router = express.Router();
var mdb = require('moviedb')('1046d0e8bf3b7860228747333688b85d');
var http = require('http');
var moviesService = require('../services/movies-service');
var locale = require('../locale/en_gb');
var fs = require('fs-extra');
var flash = require('connect-flash');
var session = require('express-session');

var movieData, location, limit = 10, pagination = [],
	imgDir = 'public/images/w342/',
	thumbDir = 'public/images/w92/';

router.use(flash());

/* GET home page. */
router.route('/')
.get(function (aRequest, aResponse) {
	moviesService.getAllMovies({}, function (aError, aMovies) {
		var vm = {
			homeView 	: true,
			user 			: aRequest.user || null,
			lang			: locale,
			movies 		: aMovies
		};

		return aResponse.render('index', vm);
	});
})
.post(function (aRequest, aResponse) {
	var searchQuery = aRequest.body.search,
		searchQuery = encodeURIComponent(searchQuery);

	aResponse.redirect('/search-results/tmdb/' + searchQuery);
});

router.route('/delete/:id')
.get(function (aRequest, aResponse) {
	moviesService.deleteTitle(aRequest.params.id, function (aError, aResults) {
		if (aError) {
			var vm = {
				detailsView		: true,
				inCollection	: true,
				editable			: true,
				user 					: aRequest.user || null,
				lang 					: locale,
				movie 				: aResults,
				error 				: aError
			};

			aRequest.flash('error', 'Entry not deleted');

			return aResponse.render('index', vm);
		}

		aRequest.flash('success', 'Entry sucessfully deleted');

		if (aResults) {
			if ( aResults.local_img ) {
				fs.remove(imgDir + aResults.poster_path, function (err) {
				  if (err) return console.error(err)
				});
			}

			if ( aResults.local_thumb ) {
				fs.remove(thumbDir + aResults.poster_path, function (err) {
				  if (err) return console.error(err)
				});
			}
		}

		return aResponse.redirect('/collection');
	});
});

module.exports = router;
