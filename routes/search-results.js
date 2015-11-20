var express = require('express');
var router = express.Router();
var http = require('http');
var mdb = require('moviedb')('1046d0e8bf3b7860228747333688b85d');
var moviesService = require('../services/movies-service');
var locale = require('../locale/en_gb');

var movieData, location, limit = 10, pagination = [];

router.route('/:location/:search')
.get(function (aRequest, aResponse) {
	location = aRequest.params.location;

	if (location == 'tmdb') {
		mdb.searchMovie({query: aRequest.params.search  }, function(aError, aResults) {
			var vm = {
		  	searchView 		: true,
		  	searchable 		: true,
		  	searchResults : true,
		  	user 					: aRequest.user || null,
		  	lang					: locale,
		  	movies 				: aResults.results
		  };

		  return aResponse.render('index', vm);
		});
	} else {
		moviesService.searchCollection(aRequest.params.search, 1, limit, function (aError, aResults, aPageCount, aItemCount) {
			var pagination = [];
			for (i = 1; i <= aPageCount; i++) {
				pagination.push(i);
			}

			if (aError) {
				console.error(aError);
				return aResponse.render('index', {
					detailsView 	: true,
					user 					: aRequest.user || null,
					lang 					: locale,
					movie 				: movieData,
					error 				: aError,
					count 				: aItemCount,
					pagination 		: pagination,
					currentPage 	: 1
				});
			}

			return aResponse.render('index', {
				searchView 		: true,
				searchable 		: true,
				searchResults : true,
				user 					: aRequest.user || null,
				lang					: locale,
				movies 				: aResults,
				count 				: aItemCount,
				pagination 		: pagination,
				currentPage 	: 1
			});
		});
	}
})
.post(function (aRequest, aResponse) {
	var searchQuery = aRequest.body.search,
		searchQuery = encodeURIComponent(searchQuery);

	aResponse.redirect('/search-results/' + location + '/' + searchQuery);
});

router.route('/:location/:search/:page')
.get(function (aRequest, aResponse) {
	moviesService.searchCollection(aRequest.params.search, aRequest.params.page, limit, function (aError, aResults, aPageCount, aItemCount) {
		if (aError) {
			var vm = {
				detailsView 	: true,
				user 					: aRequest.user || null,
				lang					: locale,
				movie 				: movieData,
				error 				: aError,
				count 				: aItemCount,
				pagination 		: pagination,
				currentPage 	: aRequest.params.page
			};

			console.error(aError);

			return aResponse.render('index', vm);
		}
		var vm = {
			searchView 		: true,
			searchable  	: true,
			searchResults : true,
			user 					: aRequest.user || null,
			lang					: locale,
			movies 				: aResults,
			count 				: aItemCount,
			pagination 		: pagination,
			currentPage 	: aRequest.params.page
		};

		return aResponse.render('index', vm);
	});
})
.post(function (aRequest, aResponse) {
	var searchQuery = aRequest.body.search,
		searchQuery = encodeURIComponent(searchQuery);

	aResponse.redirect('/search-results/' + location + '/' + searchQuery);
});

module.exports = router;