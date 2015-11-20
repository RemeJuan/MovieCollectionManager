var express = require('express');
var router = express.Router();
var mdb = require('moviedb')('1046d0e8bf3b7860228747333688b85d');
var http = require('http');
var moviesService = require('../services/movies-service');
var locale = require('../locale/en_gb');
var flash = require('connect-flash');
var session = require('express-session');

var movieData, limit = 10, pagination = [];

router.use(flash());

router.route('/')
.get(function (aRequest, aResponse) {
	moviesService.getAllWanted({}, 1, limit, function (aError, aMovies, aPageCount, aItemCount) {
		var pagination = [], vm;
		for (i = 1; i <= aPageCount; i++) {
			pagination.push(i);
		}

		vm = {
			searchView 		: true,
			searchable 		: true,
			wanted 				: true,
			user 					: aRequest.user || null,
			lang 					: locale,
			movies 				: aMovies,
			count 				: aItemCount,
			pagination 		: pagination,
			currentPage 	: 1
		}

		return aResponse.render('index', vm);
	});
})
.post(function (aRequest, aResponse) {
	var searchQuery = aRequest.body.search,
		searchQuery = encodeURIComponent(searchQuery);

	aResponse.redirect('/search-results/wanted/' + searchQuery);
});

router.route('/:page')
.get(function (aRequest, aResponse) {
	moviesService.getAllWanted({}, aRequest.params.page, limit, function (aError, aMovies, aCount) {
		var vm = {
			searchView 	: true,
			searchable	: true,
			wanted 			: true,
			user 				: aRequest.user || null,
			lang 				: locale,
			movies 			: aMovies,
			count 			: aCount,
			pagination	: pagination,
			currentPage : aRequest.params.page
		};

		return aResponse.render('index', vm);
	});
})
.post(function (aRequest, aResponse) {
	var searchQuery = aRequest.body.search,
		searchQuery = encodeURIComponent(searchQuery);

	aResponse.redirect('/search-results/wanted/' + searchQuery);
});

router.route('/add/:id')
.get(function (aRequest, aResponse) {
	mdb.movieInfo({id: aRequest.params.id  }, function(aError, aResults){
		movieData = aResults;
		movieData.wanted = true;

		moviesService.addMovie(movieData, {}, function (aError, aMovie) {
			if (aError) {

				aRequest.flash('error', 'Entry not added to wanted list');

				return aResponse.redirect('/movie-details/' + aRequest.params.id);
			}

			aRequest.flash('success', 'Entry added to wanted list');

			return aResponse.redirect('/movie-details/' + aRequest.params.id);
		});
	});
});

router.route('/move/:id')
.get(function (aRequest, aResponse) {
	moviesService.moveToCollection(aRequest.params.id, function (aError, aResults) {
		if (aError) {

			aRequest.flash('error', 'Error moving entry to collection');

			return aResponse.redirect('/movie-details/' + aRequest.params.id + '/edit');
		}

		aRequest.flash('success', 'Entry sucessfully moved to collection');

		return aResponse.redirect('/movie-details/' + aRequest.params.id + '/edit');
	})
});

module.exports = router;