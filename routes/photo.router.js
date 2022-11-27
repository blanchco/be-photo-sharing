const express = require('express');
const router = express.Router();
const PhotoModel = require('../models/photo.model')
const upload = require('../middleware/upload')
const fs = require('fs');

/* GET home page. */
router.get('/', async function(req, res, next) {
    let photos = await PhotoModel.find({username: req.username}).sort({createdAt: -1})
    res.send(photos);
});

router.post('/upload', upload.array('image'), function(req, res, next) {
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
            username: req.username
        }
    })

    PhotoModel.insertMany(newPhotos)
    return res.status(200).send({
        success: true,
        message: 'Uploaded File'
    });
});

router.delete('/:id/delete', async function(req, res, next) {
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
    
})

router.patch('/:id/favourite', async function (req, res, next) {
    const id = req.params.id
    const photo = await PhotoModel.findOne({_id: id})
    photo.favourite = !photo.favourite
    await photo.save()
    return res.status(200).send({photo})
})
  
module.exports = router;