var express = require('express');
var router = express.Router();
var mdb = require('moviedb')('1046d0e8bf3b7860228747333688b85d');
var http = require('http');
var moviesService = require('../services/movies-service');

var movieData, location;

/* GET home page. */
router.route('/')
.get(function (aRequest, aResponse) {
	moviesService.getAllMovies({}, function (aError, aMovies) {
		return aResponse.render('index', {
			homeView: true,
			movies : aMovies
		});
	});
})
.post(function (aRequest, aResponse) {
	var searchQuery = aRequest.body.search,
		searchQuery = encodeURIComponent(searchQuery);

	aResponse.redirect('/search-results/tmdb/' + searchQuery);
});

router.route('/collection')
.get(function (aRequest, aResponse) {
	moviesService.getAllMoviesCollection({}, function (aError, aMovies) {
		return aResponse.render('index', {
			searchView: true,
			searchable: true,
			movies : aMovies
		});
	});
})
.post(function (aRequest, aResponse) {
	var searchQuery = aRequest.body.search,
		searchQuery = encodeURIComponent(searchQuery);

	aResponse.redirect('/search-results/collection/' + searchQuery);
});

router.route('/movie-details/:id')
.get(function (aRequest, aResponse) {
	moviesService.findMovie(aRequest.params.id, function (aError, aResults) {
		movieData = aResults;
		if (!aResults) {
			mdb.movieInfo({id: aRequest.params.id  }, function(aError, aResults){
				movieData = aResults;
				return aResponse.render('index', {
					detailsView: true,
					movie : aResults
				});
			});
		} else {
			return aResponse.render('index', {
				detailsView: true,
				inCollection: true,
				movie : aResults
			});
		}

	});
})
.post(function (aRequest, aResponse) {
	moviesService.addMovie(movieData, aRequest.body, function (aError, aMovie) {
		if (aError) {
			console.log(aError);
			return aResponse.render('index', {
				detailsView: true,
				movie: movieData,
				error: aError
			});
		}

		return aResponse.redirect('/movie-details/' + movieData.id);
	});
});

router.route('/movie-details/:id/edit')
.get(function (aRequest, aResponse) {
	moviesService.findMovie(aRequest.params.id, function (aError, aResults) {
		movieData = aResults
		return aResponse.render('index', {
			detailsView: true,
			inCollection: true,
			editable: true,
			movie: aResults
		});
	});
})
.post(function (aRequest, aResponse) {
	moviesService.updateMovie(aRequest.body, function (aError, aResults) {
		if (aError) {
			return aResponse.render('index', {
				detailsView: true,
				inCollection: true,
				editable: true,
				movie: aResults
			});
		}

		return aResponse.redirect('/movie-details/' + aRequest.params.id);
	})
});

router.route('/search-results/:location/:search')
.get(function (aRequest, aResponse) {
	location = aRequest.params.location;
	if (location == 'tmdb') {
		mdb.searchMovie({query: aRequest.params.search  }, function(aError, aResults){
		  return aResponse.render('index', {
		  	searchView: true,
		  	searchable: true,
		  	searchResults: true,
		  	movies : aResults.results
		  });
		});
	} else {
		moviesService.searchCollection(aRequest.params.search, function (aError, aResults) {
			if (aError) {
				console.log(aError);
				return aResponse.render('index', {
					detailsView: true,
					movie: movieData,
					error: aError
				});
			}

			return aResponse.render('index', {
				searchView: true,
				searchable: true,
				searchResults: true,
				movies : aResults
			});
		});
	}
})
.post(function (aRequest, aResponse) {
	var searchQuery = aRequest.body.search,
		searchQuery = encodeURIComponent(searchQuery);

	aResponse.redirect('/search-results/' + location + '/' + searchQuery);
})

module.exports = router;
