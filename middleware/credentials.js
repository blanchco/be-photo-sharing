const credentials = (req, res, next) => {
    const origin = req.headers.origin
    if (origin === process.env.FE_SERVER){
        res.header('Access-Control-Allow-Credentials', true)
    }
    next()
}

module.exports = credentials
