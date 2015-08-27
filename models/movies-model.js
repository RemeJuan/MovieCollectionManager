var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var movieService = require('../services/movies-service');
var mongoosePaginate = require('mongoose-paginate');

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
    imdb_id             : {type: String},
    poster_path         : {type: String},
    collection_location : {type: Schema.Types.ObjectId, ref: "Locations"},
    collection_quality  : {type: Schema.Types.ObjectId, ref: "Qualities"},
    collection_media    : {type: Schema.Types.ObjectId, ref: "Mediatypes"},
    collection_watched  : {
        type: Boolean,
        default: false
    },
    collection_rating   : {
        type: Number,
        default: 0
    },
    created_date        : {
        type: Date,
        default: Date.now
    },
    local_img           : {
        type: Boolean,
        default: false
    },
    local_thumb         : {
        type: Boolean,
        default: false
    },
    collection_wanted: {
        type: Boolean,
        default: false
    }
});

var locationSchema = new Schema({
    location: {type: String, unique: true}
});

var qualitySchema = new Schema({
    quality: {type: String, unique: true}
});

var mediaSchema = new Schema({
    media: {type: String, unique: true}
});


movieSchema.plugin(mongoosePaginate);

var Movies = mongoose.model('Movies', movieSchema);
var Locations = mongoose.model('Locations', locationSchema);
var Qualities = mongoose.model('Qualities', qualitySchema);
var MediaTypes = mongoose.model('Mediatypes', mediaSchema);

module.exports = {
    Movies: Movies,
    Locations: Locations,
    Qualities: Qualities,
    MediaTypes: MediaTypes
};