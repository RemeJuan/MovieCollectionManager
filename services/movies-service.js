var Movie = require('../models/movies-model').Movies;

exports.addMovie = function(movie, form, next) {
    var newMovie = new Movie({
        _id                 : movie.id,
        title               : movie.title,
        tagline             : movie.tagline,
        release_date        : movie.release_date,
        genres              : movie.genres,
        runtime             : movie.runtime,
        vote_average        : movie.vote_average,
        vote_count          : movie.vote_count,
        overview            : movie.overview,
        homepage            : movie.homepage,
        tmdb_id             : movie.id,
        imdb_id             : movie.imdb_id,
        poster_path         : movie.poster_path,
        collection_location : form.collection_location,
        collection_quality  : form.collection_quality,
        collection_media    : form.collection_media
    });

    newMovie.save(function(err) {
        if (err) {
            return next(err);
        }
        next(null);
    });
};

exports.getAllMovies = function(movies, next) {
    Movie.find({
        
    },
        'poster_path title overview id',
    {
        sort: {date: -1},
        limit: 5
    },
     function(err, movies) {
        next(err, movies);
    });
};

exports.getAllMoviesCollection = function(movies, next) {
    Movie.find({
        
    },
        'poster_path title overview id',
    {
        sort: {title: 1},
        limit: 20
    },
     function(err, movies) {
        next(err, movies);
    });
};

exports.searchCollection = function (movieTitle, next) {
    Movie.find({
        title: {'$regex': movieTitle}
    },
        'poster_path title overview id',
    {
        sort: {title: 1},
        limit: 20
    }, function (err, movies) {
        next(err, movies);
    });
}

exports.findMovie = function(movie, next) {
    Movie.findOne({
        _id: movie
    }, function(err, movie) {
        next(err, movie);
    });
};

exports.updateMovie = function(movie, next) {
    Movie.update({_id: movie.id}, {
        collection_location: movie.collection_location,
        collection_quality: movie.collection_quality,
        collection_media: movie.collection_media
    }, function(err, numberAffected, rawResponse, content) {
       if (err) {
           return next(err);
       }
       next(null, content);
    });
};