var express = require('express');
var router = express.Router();
var locale = require('../locale/en_gb');
var flash = require('connect-flash');
var session = require('express-session');

var movieData,
	imgDir = 'public/images/w342/',
	thumbDir = 'public/images/w92/';

router.use(session({
	secret: 'keyboard cowboy',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 60000 }
}));
router.use(flash());

router.route('/')
.get(function (aRequest, aResponse) {
	return aResponse.render('index', {
		loginView: true,
		lang: locale
	});
})
.post(function (aRequest, aResponse) {

});

module.exports = router;