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

router.route('/')
.get(function (aRequest, aResponse) {
		return aResponse.render('index', {
			homeView: true,
			lang: locale,
			movies : aMovies
		});
})
.post(function (aRequest, aResponse) {

});

module.exports = router;	