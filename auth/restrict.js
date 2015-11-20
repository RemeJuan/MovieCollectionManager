'use-strict';

var isLoggedIn = function (aRequest, aResponse, aNext)  {
	if ( !aRequest.isAuthenticated() ) {
		aRequest.session.returnTo = aRequest.originalUrl;

		return aResponse.redirect('/login');
	}

	return aNext();
}

module.exports = {
	isLoggedIn		: isLoggedIn
}