var express = require('express');
var router = express.Router();
var mdb = require('moviedb')('1046d0e8bf3b7860228747333688b85d');
var http = require('http');
var moviesService = require('../services/movies-service');
var locale = require('../locale/en_gb');
var downloader = require('downloader');
var fs = require('fs-extra');

var movieData, location, limit = 10, pagination = [],
	imgDir = 'public/images/w342/',
	thumbDir = 'public/images/w92/';

/* GET home page. */
router.route('/')
.get(function (aRequest, aResponse) {
	moviesService.getAllMovies({}, function (aError, aMovies) {
		return aResponse.render('index', {
			homeView: true,
			lang: locale,
			movies : aMovies
		});
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
			return aResponse.render('index', {
				detailsView: true,
				inCollection: true,
				editable: true,
				lang: locale,
				movie: aResults,
				error: aError
			});
		}

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

		return aResponse.redirect('/collection');
	});
});

module.exports = router;