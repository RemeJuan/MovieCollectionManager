var locale = {
	global: {
		siteName: 'My Movie Collection',
		searchResults: 'Search results',
		saveButt: 'Save',
		cancelButt: 'Cancel',
		unknown: 'Unknown',
		searchCollection: 'Search Collection',
		administration: 'Collection Administration',
		account: 'Account Administration',
		myCollection: 'Movie Collection',
		wantedCollection: 'Wanted movies'
	},
	homeView: {
		mainHeading: 'Welcome',
		introText: 'Search below to add movies to your collection',
		search: 'Search TMDB...',
		secondHeading: 'Latest additions to you collection'
	},
	detailsView: {
		collectionDetails: 'Collection Details',
		labels: {
			genres: 'Genres',
			runtime: 'Runtime',
			votes: 'Votes',
			fromt: 'from',
			location: 'Location',
			quality: 'Quality',
			mediaType: 'Media Type',
			rating: 'Rating',
			watched: 'Watched'
		},
		links: {
			movieSite: 'Movie Website',
			tmdbSite: 'TMDB',
			imdbSite: 'IMDB'
		}
	},
	listView: {

	},
	loginView: {
		title: 'Login',
		email: 'E-Mail Address',
		password: 'Password',
		forgotPassword: 'Forgotten password?',
		submit: 'Login'
	},
	adminView: {
		headingLocations: 'Media locations',
		headingQualities: 'Media qualities',
		headingTypes: 'Media types',
		headingAccount: 'Update details',
		name: 'Name',
		email: 'E-Mail address',
		password: 'Password',
		conPassword: 'Confirm Password'
	},
	navigation: {
		home: 'Home',
		collection: 'My Collection',
		wanted: 'Wanted',
		admin: 'Admin',
		login: 'Login',
		logout: 'Logout'
	},
	locations: [
		'Media Server',
		'Folder 1',
		'Folder 2'
	],
	qualities: [
		'1080p',
		'720p',
		'480p',
		'360p'
	],
	mediaTypes: [
		'Blu-ray',
		'DVD',
		'Web-Rip'
	],
	ratings: [
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		10
	],
	tags: {
		watched: 'Watched',
		unwatched: 'Unwatched',
		unLocation: 'Unknown Location',
		unQuality: 'Unknown Quality'
	}
};


module.exports = locale;