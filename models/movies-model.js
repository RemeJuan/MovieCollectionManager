var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var movieService = require('../services/movies-service');

var movieSchema = new Schema({
    _id                 : {type: String, required: true, unique: true},
    title               : {type: String},
    tagline             : {type: String},
    release_date        : {type: Date},
    genres              : {type: Object},
    runtime             : {type: String},
    vote_average        : {type: String},
    vote_count          : {type: String},
    overview            : {type: String},
    homepage            : {type: String},
    tmdb_id             : {type: String},
    imdb_id             : {type: String},
    poster_path         : {type: String},
    collection_location : {type: String},
    collection_quality  : {type: String},
    collection_media    : {type: String}
});

var Movies = mongoose.model('Movies', movieSchema);

module.exports = {
    Movies: Movies
};