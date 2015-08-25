var Movie = require('../models/movies-model').Movies;
var Locations = require('../models/movies-model').Locations;
var Qualities = require('../models/movies-model').Qualities;
var MediaTypes = require('../models/movies-model').MediaTypes;
var async = require('async');

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
        collection_location : aForm.collection_location || null,
        collection_quality  : aForm.collection_quality || null,
        collection_media    : aForm.collection_media || null,
        collection_watched  : aForm.collection_watched,
        collection_rating   : aForm.collection_rating,
        collection_wanted   : aMovie.wanted
    });

    newMovie.save(function(aError) {
        if (aError) {
            return aNext(aError);
        }
        aNext(null);
    });
};

var listViewTables = 'poster_path title overview id local_thumb, genres';

exports.getAllMovies = function(aMovies, aNext) {
    Movie.find({
        collection_wanted: {'$ne': true}
    },
        null,
    {
        sort: {created_date: -1},
        limit: 5
    },
     function(aError, aMovies) {
        aNext(aError, aMovies);
    });
};

exports.getAllMoviesCollection = function(aMovies, aPage, aLimit, aNext) {
    Movie.paginate({
        collection_wanted: {'$ne': true}
    },
    {
        page: aPage,
        limit: aLimit,
        sortBy: {title: 1},
        populate: 'collection_location collection_media collection_quality'
    },
    function(aError, aMovies, aPageCount, aItemCount) {
        aNext(aError, aMovies, aPageCount, aItemCount);
    });
};

exports.getAllWanted = function(aMovies, aPage, aLimit, aNext) {
    Movie.paginate({
        collection_wanted: true
    },
    {
        page: aPage,
        limit: aLimit,
        sortBy: {title: 1}
    },
    function(aError, aMovies, aPageCount, aItemCount) {
        aNext(aError, aMovies, aPageCount, aItemCount);
    });
};

exports.searchWanted = function(aMovies, aNext) {
    Movie.find({
        
    },
        null,
    {
        sort: {title: 1},
        limit: 20
    },
     function(aError, aMovies) {
        aNext(aError, aMovies);
    });
};

exports.searchCollection = function (movieTitle, aPage, aLimit, aNext) {
    Movie.paginate({
        title: {'$regex': new RegExp(movieTitle, 'i')}
    },
    {
        page: aPage,
        limit: aLimit,
        sortBy: {title: 1},
        populate: 'collection_location collection_media collection_quality'
    }, function (aError, aMovies, aPageCount, aItemCount) {
        aNext(aError, aMovies, aPageCount, aItemCount);
    });

}

exports.getAllByTag = function (aTag, aNext) {
    Movie.find({
        'genres.name' : aTag
    },
        null,
    {
        sort: {title: 1},
        limit: 20
    },
     function(aError, aMovies) {
        console.log(aMovies)
        aNext(aError, aMovies);
    });
}

exports.getAllByLocation = function (aTag, aNext) {
    Movie.find({
        collection_location : aTag
    },
        null,
    {
        sort: {title: 1},
        limit: 20
    },
     function(aError, aMovies) {
        console.log(aMovies)
        aNext(aError, aMovies);
    });
}

exports.getAllByWatched = function (aTag, aNext) {
    Movie.find({
        collection_watched : aTag
    },
        null,
    {
        sort: {title: 1},
        limit: 20
    },
     function(aError, aMovies) {
        console.log(aMovies)
        aNext(aError, aMovies);
    });
}

exports.getAllByQuality = function (aTag, aNext) {
    Movie.find({
        collection_quality : aTag
    },
        null,
    {
        sort: {title: 1},
        limit: 20
    },
     function (aError, aMovies) {
        aNext(aError, aMovies);
    });
}

exports.findMovie = function(aMovie, aNext) {
    async.parallel({
        getLocations: function (aResult) {
            Locations.find({})
            .exec(aResult);
        },
        getMovie: function (aResult) {
            Movie.findOne({_id: aMovie})
                .populate('collection_location')
                .populate('collection_quality')
                .populate('collection_media')
                .exec(aResult);
        },
        getQualities: function (aResult) {
            Qualities.find({})
                .exec(aResult);
        },
        getMediaTypes: function (aResult) {
            MediaTypes.find({})
                .exec(aResult);
        }
    },
    function (aError, aResult) {
        var aReturn = {};
        aReturn = {
            movie: aResult.getMovie,
            locations: aResult.getLocations,
            qualities: aResult.getQualities,
            mediatypes: aResult.getMediaTypes
        }

        aNext(aError, aReturn);
    });
};

exports.prepAdmin = function(aMovie, aNext) {
    async.parallel({
        getLocations: function (aResult) {
            Locations.find({})
            .exec(aResult);
        },
        getQualities: function (aResult) {
            Qualities.find({})
                .exec(aResult);
        },
        getMediaTypes: function (aResult) {
            MediaTypes.find({})
                .exec(aResult);
        }
    },
    function (aError, aResult) {
        var aReturn = {};
        aReturn = {
            locations: aResult.getLocations,
            qualities: aResult.getQualities,
            mediatypes: aResult.getMediaTypes
        }

        aNext(aError, aReturn);
    });
};

exports.deleteTitle = function (aMovie, aNext) {
    Movie.findOneAndRemove({
        _id: aMovie
    }, function(aError, aMovie) {
        aNext(aError, aMovie);
    });
};

exports.updateMovie = function(aMovie, aData, aNext) {
    Movie.update({_id: aMovie}, {
        collection_location : aData.collection_location || null,
        collection_quality  : aData.collection_quality || null,
        collection_media    : aData.collection_media || null,
        collection_rating   : aData.collection_rating,
        collection_watched  : aData.collection_watched
    }, function(aError, numberAffected, rawResponse, aData) {
       if (aError) {
           return aNext(aError);
       }
       aNext(null, aData);
    });
};

exports.moveToCollection = function(aMovie, aNext) {
    Movie.update({_id: aMovie}, {
        collection_wanted   : false
    }, function(aError, numberAffected, rawResponse, aData) {
       if (aError) {
           return aNext(aError);
       }
       aNext(null, aData);
    });
}

exports.updateImg = function(aMovie, aNext) {
    Movie.update({_id: aMovie}, {
        local_img : true,
    }, function(aError, numberAffected, rawResponse, aData) {
       if (aError) {
           return aNext(aError);
       }
       aNext(null, aData);
    });
};

exports.updateThumb = function(aMovie, aNext) {
    Movie.update({_id: aMovie}, {
        local_thumb : true,
    }, function(aError, numberAffected, rawResponse, aData) {
       if (aError) {
           return aNext(aError);
       }
       aNext(null, aData);
    });
};

exports.adminUpdate = function(aCollection, aData, aNext) {
    if (aCollection == 'locations') {
        var id = aData.id || null;
        Locations.findOneAndUpdate({_id: id }, {
            location: aData.location
        },
        {
            upsert: true
        },
        function(aError, numberAffected, rawResponse, aData) {
           if (aError) { return aNext(aError); }
           aNext(null, aData);
        });
    }

    if (aCollection == 'qualities') {
        var id = aData.id || null;
        Qualities.findOneAndUpdate({_id: id }, {
            quality: aData.quality
        },
        {
            upsert: true
        },
        function(aError, numberAffected, rawResponse, aData) {
           if (aError) { return aNext(aError); }
           aNext(null, aData);
        }); 
    }

    if (aCollection == 'mediatypes') {
        var id = aData.id || null;
        Qualities.findOneAndUpdate({_id: id }, {
            media: aData.media
        },
        {
            upsert: true
        },
        function(aError, numberAffected, rawResponse, aData) {
           if (aError) { return aNext(aError); }
           aNext(null, aData);
        }); 
    }

};

exports.adminSave = function(aCollection, aData, aNext) {
    if (aCollection == 'locations') {
        var newLocation = new Locations({
            location : aData.location,
        });

        newLocation.save(function(aError) {
            if (aError) {
                return aNext(aError);
            }
            aNext(null);
        });
    }

    if (aCollection == 'qualities') {
        var newQuality = new Qualities({
            quality : aData.quality,
        });

        newQuality.save(function(aError) {
            if (aError) {
                return aNext(aError);
            }
            aNext(null);
        });
    }

    if (aCollection == 'mediatypes') {
        var newMediaType = new MediaTypes({
            media : aData.media,
        });

        newMediaType.save(function(aError) {
            if (aError) {
                return aNext(aError);
            }
            aNext(null);
        });
    }

};

exports.adminDelete = function(aCollection, aData, aNext) {
    if (aCollection == 'locations') {
        Locations.findOneAndRemove({
            _id: aData
        }, function(aError, aMovie) {
            aNext(aError, aMovie);
        });
    }

    if (aCollection == 'qualities') {
        Qualities.findOneAndRemove({
            _id: aData
        }, function(aError, aMovie) {
            aNext(aError, aMovie);
        });
    }

    if (aCollection == 'mediatypes') {
        MediaTypes.findOneAndRemove({
            _id: aData
        }, function(aError, aMovie) {
            aNext(aError, aMovie);
        });
    }

};