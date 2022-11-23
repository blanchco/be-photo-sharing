const corsOptions = {
    origin: (origin, cb) => {
        if(origin === 'http://localhost:4200' || !origin){
            cb(null, true)
        } else {
            cb(new Error('Not allowed by CORS'))
        }

    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions