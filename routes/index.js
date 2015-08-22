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

router.route('/wanted')
.get(function (aRequest, aResponse) {
	moviesService.getAllWanted({}, 1, limit, function (aError, aMovies, aCount){
		var total = Math.round(aCount / limit),
			pagination = [];
		for (i = 1; i <= total; i++) {
			pagination.push(i);
		}

		return aResponse.render('index', {
			searchView: true,
			searchable: true,
			lang: locale,
			movies : aMovies,
			count: aCount,
			pagination: pagination,
			currentPage: 1
		});
	});
})
.post(function (aRequest, aResponse) {
	var searchQuery = aRequest.body.search,
		searchQuery = encodeURIComponent(searchQuery);

	aResponse.redirect('/search-results/wanted/' + searchQuery);
});

router.route('/wanted/:page')
.get(function (aRequest, aResponse) {
	moviesService.getAllWanted({}, aRequest.params.page, limit, function (aError, aMovies, aCount) {
		return aResponse.render('index', {
			searchView: true,
			searchable: true,
			lang: locale,
			movies : aMovies,
			count: aCount,
			pagination: pagination,
			currentPage: aRequest.params.page
		});
	});
})
.post(function (aRequest, aResponse) {
	var searchQuery = aRequest.body.search,
		searchQuery = encodeURIComponent(searchQuery);

	aResponse.redirect('/search-results/wanted/' + searchQuery);
});

router.route('/wanted/add/:id')
.get(function (aRequest, aResponse) {
	mdb.movieInfo({id: aRequest.params.id  }, function(aError, aResults){
		movieData = aResults;
		movieData.wanted = true;
		
		moviesService.addMovie(movieData, {}, function (aError, aMovie) {
			if (aError) {
				return aResponse.render('index', {
					detailsView: true,
					movie: movieData,
					lang: locale,
					error: aError
				});
			}

			return aResponse.redirect('/movie-details/' + aRequest.params.id);
		});
	});
});

router.route('/wanted/move/:id')
.get(function (aRequest, aResponse) {
	moviesService.moveToCollection(aRequest.params.id, function (aError, aResults) {
		if (aError) {
			return aResponse.render('index', {
				detailsView: true,
				inCollection: true,
				editable: true,
				lang: locale,
				movie: aResults
			});
		}

		return aResponse.redirect('/movie-details/' + aRequest.params.id + '/edit');
	})
});

router.route('/collection')
.get(function (aRequest, aResponse) {
	moviesService.getAllMoviesCollection({}, 1, limit, function (aError, aMovies, aCount) {
		var total = Math.round(aCount / limit),
			pagination = [];
		for (i = 1; i <= total; i++) {
			pagination.push(i);
		}

		return aResponse.render('index', {
			searchView: true,
			searchable: true,
			lang: locale,
			movies : aMovies,
			count: aCount,
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

router.route('/collection/:page')
.get(function (aRequest, aResponse) {
	moviesService.getAllMoviesCollection({}, aRequest.params.page, limit, function (aError, aMovies, aCount) {
		return aResponse.render('index', {
			searchView: true,
			searchable: true,
			lang: locale,
			movies : aMovies,
			count: aCount,
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

router.route('/collection/tags/:query/:tag')
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

})

router.route('/movie-details/:id')
.get(function (aRequest, aResponse) {
	moviesService.findMovie(aRequest.params.id, function (aError, aResults) {
		movieData = aResults.movie;
		var cDetails = aResults;

		if (movieData) {
			if(!aResults.movie.local_img) {
				fs.mkdirs(imgDir, function (err) {
				  if (err) return console.error(err);

				  	downloader.download('http://image.tmdb.org/t/p/w342' + movieData.poster_path, imgDir);
				  	downloader.on('done', function (aResponse) {
				  		moviesService.updateImg(aRequest.params.id, function (aError, aResults) {});
				  	});				
				})
			}

			if (!aResults.movie.local_thumb) {
				fs.mkdirs(thumbDir, function (err) {
				  if (err) return console.error(err);

				  	downloader.download('http://image.tmdb.org/t/p/w92' + movieData.poster_path, thumbDir);
				  	downloader.on('done', function (aResponse) {
				  		moviesService.updateThumb(aRequest.params.id, function (aError, aResults) {});
				  	});
				})

			}
		}

		if (!aResults.movie) {
			mdb.movieInfo({id: aRequest.params.id  }, function(aError, aResults){
				movieData = aResults;

				return aResponse.render('index', {
					detailsView: true,
					lang: locale,
					movie : movieData,
					cDetails: cDetails
				});
			});
		} else {
			return aResponse.render('index', {
				detailsView: true,
				inCollection: true,
				lang: locale,
				movie: movieData
			});
		}

	});
})
.post(function (aRequest, aResponse) {
	movieData.collection_wanted = false;
	moviesService.addMovie(movieData, aRequest.body, function (aError, aMovie) {
		if (aError) {
			console.error(aError);
			return aResponse.render('index', {
				detailsView: true,
				movie: movieData,
				lang: locale,
				error: aError
			});
		}

		return aResponse.redirect('/movie-details/' + aRequest.params.id);
	});
});

router.route('/movie-details/:id/edit')
.get(function (aRequest, aResponse) {
	moviesService.findMovie(aRequest.params.id, function (aError, aResults) {
		console.log(aResults);
		return aResponse.render('index', {
			detailsView: true,
			inCollection: true,
			editable: true,
			lang: locale,
			movie: aResults.movie,
			cDetails: aResults
		});
	});
})
.post(function (aRequest, aResponse) {
	moviesService.updateMovie(aRequest.params.id, aRequest.body, function (aError, aResults) {
		if (aError) {
			console.error(aError);
			return aResponse.render('index', {
				detailsView: true,
				inCollection: true,
				editable: true,
				lang: locale,
				movie: aResults,
				cDetails: aResults
			});
		}

		return aResponse.redirect('/movie-details/' + aRequest.params.id);
	})
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

router.route('/search-results/:location/:search')
.get(function (aRequest, aResponse) {
	location = aRequest.params.location;

	if (location == 'tmdb') {
		mdb.searchMovie({query: aRequest.params.search  }, function(aError, aResults){
		  return aResponse.render('index', {
		  	searchView: true,
		  	searchable: true,
		  	searchResults: true,
		  	lang: locale,
		  	movies : aResults.results
		  });
		});
	} else {
		moviesService.searchCollection(aRequest.params.search, function (aError, aResults) {
			if (aError) {
				console.log(aError);
				return aResponse.render('index', {
					detailsView: true,
					lang: locale,
					movie: movieData,
					error: aError
				});
			}

			return aResponse.render('index', {
				searchView: true,
				searchable: true,
				searchResults: true,
				lang: locale,
				movies : aResults
			});
		});
	}
})
.post(function (aRequest, aResponse) {
	var searchQuery = aRequest.body.search,
		searchQuery = encodeURIComponent(searchQuery);

	aResponse.redirect('/search-results/' + location + '/' + searchQuery);
});

module.exports = router;
