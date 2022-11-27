const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload')
const {getPhotos, uploadPhotos, deletePhoto, favouritePhoto} = require('../controllers/photo.controller')

router.get('/', getPhotos);

router.post('/upload', upload.array('image'), uploadPhotos);

router.delete('/:id/delete', deletePhoto)

router.patch('/:id/favourite', favouritePhoto)
  
module.exports = router;