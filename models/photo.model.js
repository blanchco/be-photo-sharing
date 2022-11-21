const mongoose = require('mongoose')

const PhotoSchema = mongoose.Schema({
    name: String,
    image: String
}, {timestamps: true})

const PhotoModel = mongoose.model('photoModel', PhotoSchema)

module.exports = PhotoModel