const express = require('express');
const router = express.Router();
const PhotoModel = require('../models/photo.model')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid');

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
    allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false)
}
const upload = multer({ storage: storage, fileFilter: fileFilter })

/* GET home page. */
router.get('/', async function(req, res, next) {
    let photos = await PhotoModel.find().sort({updatedAt: -1}).limit(20)
    res.send(photos);
});

router.post('/upload', upload.single('image'), function(req, res, next) {
    const newPhoto = new PhotoModel({
        name: req.body.name,
        image: 'http://localhost:3000/' + req.file.path,
    })

    newPhoto.save();
    res.send('Uploaded Photo');
});
  
module.exports = router;