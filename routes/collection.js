var express = require('express');
var router = express.Router();
var http = require('http');
var moviesService = require('../services/movies-service');
var locale = require('../locale/en_gb');

var movieData, location, limit = 10, pagination = [];

router.route('/')
.get(function (aRequest, aResponse) {
	moviesService.getAllMoviesCollection({}, 1, limit, function (aError, aMovies, aPageCount, aItemCount) {
		var pagination = [];
		for (i = 1; i <= aPageCount; i++) {
			pagination.push(i);
		}

		return aResponse.render('index', {
			searchView: true,
			searchable: true,
			lang: locale,
			movies : aMovies,
			count: aItemCount,
			pagination: pagination,
			currentPage: 1
		});
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
		return aResponse.render('index', {
			searchView: true,
			searchable: true,
			lang: locale,
			movies : aMovies,
			count: aItemCount,
			pagination: pagination,
			currentPage: aRequest.params.page
		});
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
		return aResponse.render('index', {
			searchView: true,
			searchable: true,
			lang: locale,
			movies : aResults
		});
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