var express 	= require('express'),
		router 		= express.Router();

router.get('/', function(aRequest, aResponse, aNext) {
	aRequest.session.destroy();
	aRequest.logout();
	aResponse.redirect('/');
});

module.exports = router;