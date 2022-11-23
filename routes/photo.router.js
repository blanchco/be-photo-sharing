const express = require('express');
const router = express.Router();
const PhotoModel = require('../models/photo.model')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid');
const fs = require('fs')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'photos')
    },
    filename: (req, file, cb) => {
        const mimeType = file.mimetype.split('/')
        const fileType = mimeType[1]
        const fileName = file.originalname.split('.')[0] + '.' + uuidv4() + '.' + fileType
        cb(null, fileName)
    }
})

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ["image/webp", "image/png", "image/jpg", "image/jpeg"]
    req.isFileValid = true
    if(!allowedMimeTypes.includes(file.mimetype)) {
        req.isFileValid = false
        cb(null, false)
    }
    cb(null, true) 
}
const upload = multer({ storage: storage, fileFilter: fileFilter })

/* GET home page. */
router.get('/', async function(req, res, next) {
    let photos = await PhotoModel.find().sort({updatedAt: -1}).limit(20)
    res.send(photos);
});

router.post('/upload', upload.single('image'), function(req, res, next) {
    if(req.isFileValid === false) {
        return res.status(500).send({
            success: false,
            message: 'Error Uploading File'
        })
    }
    const newPhoto = new PhotoModel({
        name: req.body.name,
        image: req.file.path,
    })

    newPhoto.save();
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
  
module.exports = router;