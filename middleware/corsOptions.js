const corsOptions = {
    origin: (origin, cb) => {
        if(origin === process.env.FE_SERVER || !origin){
            cb(null, true)
        } else {
            cb(new Error('Not allowed by CORS'))
        }

    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions