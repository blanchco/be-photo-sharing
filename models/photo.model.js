const mongoose = require('mongoose')

const PhotoSchema = mongoose.Schema({
    name: String,
    image: String,
    user_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user'
    },
    favourite: Boolean
}, {timestamps: true})

const PhotoModel = mongoose.model('photoModel', PhotoSchema, 'photos')

module.exports = PhotoModel