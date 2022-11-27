const jwt = require('jsonwebtoken')
require('dotenv').config()

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if(!authHeader){
        // no authorization
        return res.sendStatus(401)
    }

    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
        if(error){
            // invalid token
            return res.sendStatus(401)
        }

        req.user_id = decoded.user_id
        req.username = decoded.username
        next()
    })
}

module.exports = verifyJWT