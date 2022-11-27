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
    req.isFileValid = true
    if(!allowedMimeTypes.includes(file.mimetype)) {
        req.isFileValid = false
        return cb(null, false)
    }
    cb(null, true) 
}
const upload = multer({ storage: storage, fileFilter: fileFilter })

module.exports = upload
