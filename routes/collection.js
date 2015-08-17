var express = require('express');
var router = express.Router();
var mdb = require('moviedb')('1046d0e8bf3b7860228747333688b85d');
var http = require('http');
var moviesService = require('../services/movies-service');

var movieData;

/* GET home page. */
router.route('/')
.get(function (aRequest, aResponse) {
	moviesService.getAllMovies({}, function (aError, aMovies) {
		return aResponse.render('index', {
			searchView: true,
			movies : aMovies
		});
	});
})
.post(function (aRequest, aResponse) {
	var searchQuery = aRequest.body.search,
		searchQuery = encodeURIComponent(searchQuery);

	aResponse.redirect('/search-results?search=' + searchQuery);
});

router.route('/movie-details/:id')
.get(function (aRequest, aResponse) {
	mdb.movieInfo({id: aRequest.params.id  }, function(aError, aResults){
		// var imgUrl = 'http://image.tmdb.org/t/p/w342' + aResults.poster_path;
		movieData = aResults
		return aResponse.render('index', {
			detailsView: true,
			movie : movieData
		});
	});
})
.post(function (aRequest, aResponse) {
	moviesService.addMovie(movieData, aRequest.body, function (aError, aMovie) {
		if (aError) {
			return aResponse.render('index', {
				detailsView: true,
				movie: movieData
			});
		}

		return aResponse.render('index', {
			detailsView: true,
			movie: movieData
		});
	});
});

router.route('/search-results')
.get(function (aRequest, aResponse) {
	var searchQuery = aRequest.query.search;

	mdb.searchMovie({query: searchQuery  }, function(aError, aResults){
	  return aResponse.render('index', {
	  	searchView: true,
	  	movies : aResults.results
	  });
	});
})

module.exports = router;
