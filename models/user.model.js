const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    username: String,
    password: String,
    refreshToken: String,
}, {timestamps: true})

const UserModel = mongoose.model('user', UserSchema, 'users')

module.exports = UserModel