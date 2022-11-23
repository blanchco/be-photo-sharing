const express = require('express');
const router = express.Router();
const UserModel = require('../models/user.model')
const jwt = require('jsonwebtoken')

/* GET home page. */
router.get('/', async function(req, res, next) {
    res.send('test');
});

router.post('/login', async function(req, res, next) {
    let userData = req.body;
    UserModel.findOne({username: userData.username}, async (error, user) => {
        if(error){
            console.log(error)
        } else {
            if(!user || (user.password !== userData.password)){
                res.status(401).send('Invalid details')
            } else {
                const accessToken = jwt.sign(
                    {username: user.username},
                    process.env.ACCESS_TOKEN_SECRET,
                    {expiresIn: '30s'}
                )
                const refreshToken = jwt.sign(
                    {username: user.username},
                    process.env.REFRESH_TOKEN_SECRET,
                    {expiresIn: '30d'}
                )
                user.refreshToken = refreshToken
                await user.save()
                res.cookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None', secure: true, maxAge: 30 * 24 * 60 * 60 * 1000})
                res.status(200).send({accessToken})
            }
        }
    })
});

router.get('/refresh', async function(req, res, next) {
    const cookies = req.cookies;
    if(!cookies.jwt) {
        return res.sendStatus(403)
    }
    const refreshToken = cookies.jwt

    UserModel.findOne({refreshToken: refreshToken}, async (error, user) => {
        if(error){
            console.log(error)
        } else {
            if(!user){
                return res.status(401).send('Invalid details')
            } else {
                jwt.verify(
                    refreshToken,
                    process.env.REFRESH_TOKEN_SECRET,
                    (error, decoded) => {
                        if(error || user.username !== decoded.username) {
                            return res.sendStatus(403)
                        }
                        const accessToken = jwt.sign(
                            {username: decoded.username},
                            process.env.ACCESS_TOKEN_SECRET,
                            {expiresIn: '30s'}
                        )
                        res.json({accessToken})
                    }
                )
            }
        }
    })
})

router.delete('/logout', async function(req, res, next) {
    const cookies = req.cookies;
    if(!cookies.jwt) {
        return res.sendStatus(204)
    }
    const refreshToken = cookies.jwt

    UserModel.findOne({refreshToken: refreshToken}, async (error, user) => {
        if(error){
            console.log(error)
        } else {
            res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true})
            if(!user){
                return res.sendStatus(204)
            } else {
                user.refreshToken = ''
                await user.save()
            }
            res.sendStatus(204)
        }
    })
})

router.post('/register', function(req, res, next) {
    let userData = req.body;
    let user = new UserModel(userData)
    user.save()

    return res.status(200).send({
        success: true,
        message: 'Registered User'
    });
});

router.delete

  
module.exports = router;