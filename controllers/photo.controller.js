const PhotoModel = require('../models/photo.model')
const fs = require('fs');
const mongoose = require('mongoose');
const toId = mongoose.Types.ObjectId

async function getPhotos(req, res, next) {
    let photos = await PhotoModel.find({user_id: req.user_id}).sort({createdAt: -1})
    res.send(photos);
}

async function uploadPhotos(req, res, next) {
    if(req.isFileValid === false) {
        return res.status(500).send({
            success: false,
            message: 'Error Uploading File'
        })
    }

    const newPhotos = req.files.map((file) => {
        return {
            name: file.filename,
            image: file.path,
            user_id: req.user_id
        }
    })

    await PhotoModel.insertMany(newPhotos)
    return res.status(200).send({
        success: true,
        message: 'Uploaded File'
    });
}

async function deletePhoto(req, res, next) {
    const id = req.params.id
    const photo = await PhotoModel.findOne({ _id: id });
    fs.unlink(`./${photo.image}`, err => {
        if (err) {
            return res.status(500).send({
                success: false,
                message: 'Error Deleting File'
            })
        }
    })
    await PhotoModel.deleteOne({ _id: id });

    return res.status(200).send({
        success: true,
        message: 'Deleted File'
    });
}

async function favouritePhoto(req, res, next){
    const id = req.params.id
    const photo = await PhotoModel.findOne({_id: id})
    photo.favourite = !photo.favourite
    await photo.save()
    return res.status(200).send({photo})
}

module.exports = {getPhotos, uploadPhotos, deletePhoto, favouritePhoto}