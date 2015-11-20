'use-strict';

var isLoggedIn = function (aRequest, aResponse, aNext)  {
	if ( !aRequest.isAuthenticated() ) {
		aRequest.session.returnTo = aRequest.originalUrl;

		return aResponse.redirect('/login');
	}

	return aNext();
},

isLoggedOut = function (aRequest, aResponse, aNext) {
	if ( aRequest.isAuthenticated() ) {
		return aResponse.redirect('/');
	}

	return aNext();
};

module.exports = {
	isLoggedIn		: isLoggedIn,
	isLoggedOut		: isLoggedOut
}