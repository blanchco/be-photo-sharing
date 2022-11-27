const mongoose = require('mongoose')

const PhotoSchema = mongoose.Schema({
    name: String,
    image: String,
    username: String,
    favourite: Boolean
}, {timestamps: true})

const PhotoModel = mongoose.model('photoModel', PhotoSchema)

module.exports = PhotoModel