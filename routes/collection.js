var express = require('express');
var router = express.Router();
var http = require('http');
var moviesService = require('../services/movies-service');
var locale = require('../locale/en_gb');
var flash = require('connect-flash');
var session = require('express-session');

var movieData, location, limit = 10, pagination = [];

router.use(flash());

function buildPagination(aPageCount) {
	pagination = [];
	for (i = 1; i <= aPageCount; i++) {
		pagination.push(i);
	}
}

router.route('/')
.get(function (aRequest, aResponse) {
	moviesService.getAllMoviesCollection({}, 1, limit, function (aError, aMovies, aPageCount, aItemCount) {
		var flashSuccess = aRequest.flash('success'),
			flashError = aRequest.flash('error')
			vm = {
			searchView	: true,
			searchable 	: true,
			collection 	: true,
			user 				: aRequest.user || null,
			lang				: locale,
			movies 			: aMovies,
			count 			: aItemCount,
			pagination 	: pagination,
			currentPage : 1,
			success 		: flashSuccess,
			error 			: flashError
		};

		buildPagination(aPageCount);

		return aResponse.render('index', vm);
	});
})
.post(function (aRequest, aResponse) {
	var searchQuery = aRequest.body.search,
		searchQuery = encodeURIComponent(searchQuery);

	aResponse.redirect('/search-results/collection/' + searchQuery);
});

router.route('/:page')
.get(function (aRequest, aResponse) {
	moviesService.getAllMoviesCollection({}, aRequest.params.page, limit, function (aError, aMovies, aPageCount, aItemCount) {
		var vm = {
			searchView 	: true,
			searchable 	: true,
			collection 	: true,
			user 				: aRequest.user || null,
			lang 				: locale,
			movies 			: aMovies,
			count 			: aItemCount,
			pagination 	: pagination,
			currentPage : aRequest.params.page
		};

		buildPagination(aPageCount);

		return aResponse.render('index', vm);
	});
})
.post(function (aRequest, aResponse) {
	var searchQuery = aRequest.body.search,
		searchQuery = encodeURIComponent(searchQuery);

	aResponse.redirect('/search-results/collection/' + searchQuery);
});

router.route('/tags/:query/:tag')
.get(function (aRequest, aResponse) {
	var query = aRequest.params.query;
	function returnResponse(aResults) {
		var vm = {
			searchView  : true,
			searchable  : true,
			collection 	: true,
			user 				: aRequest.user || null,
			lang 				: locale,
			movies 			: aResults
		};

		return aResponse.render('index', vm);
	}
	if (query == 'genre') {
		moviesService.getAllByTag(aRequest.params.tag, function (aError, aResults) {
			returnResponse(aResults);
		});
	}

	if (query == 'watched') {
		moviesService.getAllByWatched(aRequest.params.tag, function (aError, aResults) {
			returnResponse(aResults);
		});
	}

	if (query == 'location') {
		moviesService.getAllByLocation(aRequest.params.tag, function (aError, aResults) {
			returnResponse(aResults);
		});
	}

	if (query == 'quality') {
		moviesService.getAllByQuality(aRequest.params.tag, function (aError, aResults) {
			returnResponse(aResults);
		});
	}

});

module.exports = router;