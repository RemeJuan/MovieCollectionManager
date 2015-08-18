var Movie = require('../models/movies-model').Movies;

exports.addMovie = function(aMovie, aForm, aNext) {
    var newMovie = new Movie({
        _id                 : aMovie.id,
        title               : aMovie.title,
        tagline             : aMovie.tagline,
        release_date        : aMovie.release_date,
        genres              : aMovie.genres,
        runtime             : aMovie.runtime,
        vote_average        : aMovie.vote_average,
        vote_count          : aMovie.vote_count,
        overview            : aMovie.overview,
        homepage            : aMovie.homepage,
        tmdb_id             : aMovie.id,
        imdb_id             : aMovie.imdb_id,
        poster_path         : aMovie.poster_path,
        collection_location : aForm.collection_location,
        collection_quality  : aForm.collection_quality,
        collection_media    : aForm.collection_media,
        collection_watched  : aForm.collection_watched,
        collection_rating   : aForm.collection_rating
    });

    newMovie.save(function(aError) {
        if (err) {
            return aNext(aError);
        }
        aNext(null);
    });
};

exports.getAllMovies = function(aMovies, aNext) {
    Movie.find({
        
    },
        'poster_path title overview id',
    {
        sort: {date: -1},
        limit: 5
    },
     function(aError, aMovies) {
        aNext(aError, aMovies);
    });
};

exports.getAllMoviesCollection = function(aMovies, aNext) {
    Movie.find({
        
    },
        'poster_path title overview id',
    {
        sort: {title: 1},
        limit: 20
    },
     function(aError, aMovies) {
        aNext(aError, aMovies);
    });
};

exports.searchCollection = function (movieTitle, aNext) {
    Movie.find({
        title: {'$regex': movieTitle}
    },
        'poster_path title overview id',
    {
        sort: {title: 1},
        limit: 20
    }, function (aError, aMovies) {
        aNext(aError, aMovies);
    });
}

exports.findMovie = function(aMovie, aNext) {
    Movie.findOne({
        _id: aMovie
    }, function(aError, aMovie) {
        aNext(aError, aMovie);
    });
};

exports.deleteTitle = function (aMovie, aNext) {
    Movie.findOneAndRemove({
        e_id: aMovie
    }, function(aError) {
        aNext(aError);
    });
};

exports.updateMovie = function(aMovie, aData, aNext) {
    console.log(aData);
    Movie.update({_id: aMovie}, {
        collection_location : aData.collection_location,
        collection_quality  : aData.collection_quality,
        collection_media    : aData.collection_media,
        collection_rating   : aData.collection_rating,
        collection_watched  : aData.collection_watched
    }, function(aError, numberAffected, rawResponse, aData) {
       if (aError) {
           return aNext(aError);
       }
       aNext(null, aData);
    });
};