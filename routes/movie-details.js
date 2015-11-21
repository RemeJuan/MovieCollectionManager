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

var movieData,
	imgDir = 'public/images/w342/',
	thumbDir = 'public/images/w92/';

router.use(flash());

router.route('/:id')
.get(function (aRequest, aResponse) {
	moviesService.findMovie(aRequest.params.id, function (aError, aResults) {
		var cDetails = aResults, flashSuccess = aRequest.flash('success'),
			flashError = aRequest.flash('error');

		movieData = aResults.movie;

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
			mdb.movieInfo({id: aRequest.params.id  }, function(aError, aResults) {
				var vm;
				movieData = aResults;
				vm = {
					detailsView	: true,
					user 				: aRequest.user || null,
					lang				: locale,
					movie 			: movieData,
					cDetails 		: cDetails,
					success 		: flashSuccess,
					error 			: flashError
				};

				return aResponse.render('index', vm);
			});
		} else {
			var vm = {
				detailsView		: true,
				user 					: aRequest.user || null,
				inCollection	: true,
				lang					: locale,
				movie 				: movieData,
				success 			: flashSuccess,
				error 				: flashError
			};

			return aResponse.render('index', vm);
		}

	});
})
.post(function (aRequest, aResponse) {
	movieData.collection_wanted = false;
	moviesService.addMovie(movieData, aRequest.body, function (aError, aMovie) {
		if (aError) {
			console.error(aError);

			aRequest.flash('error', 'Entry not added to collection');

			return aResponse.redirect('/movie-details/' + aRequest.params.id);
		}

		aRequest.flash('success', 'Entry added to collection');

		return aResponse.redirect('/movie-details/' + aRequest.params.id);
	});
});

router.route('/:id/edit')
.get(function (aRequest, aResponse) {
	moviesService.findMovie(aRequest.params.id, function (aError, aResults) {
		var flashSuccess = aRequest.flash('success'),
			flashError = aRequest.flash('error'),
			vm = {
			detailsView 	: true,
			inCollection	: true,
			editable			: true,
			user 					: aRequest.user || null,
			lang					: locale,
			movie 				: aResults.movie,
			cDetails 			: aResults,
			success 			: flashSuccess,
			error 				: flashError
		};

		return aResponse.render('index', vm);
	});
})
.post(function (aRequest, aResponse) {
	moviesService.updateMovie(aRequest.params.id, aRequest.body, function (aError, aResults) {
		if (aError) {
			console.error(aError);
			aRequest.flash('success', 'Entry not updated');

			return aResponse.redirect('/movie-details/' + aRequest.params.id);
		}

		aRequest.flash('success', 'Entry successfully updated');

		return aResponse.redirect('/movie-details/' + aRequest.params.id);
	})
});

module.exports = router;