const UserModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

async function login(req, res, next) {
    let userData = req.body;
    UserModel.findOne({username: userData.username}, async (error, user) => {
        if(error){
            console.log(error)
        } else {
            if(!user || !bcrypt.compareSync(userData.password, user.password)){
                res.status(401).send('Invalid details')
            } else {
                const accessToken = jwt.sign(
                    {
                        user_id: user._id,
                        username: user.username
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    {expiresIn: '30s'}
                )
                const refreshToken = jwt.sign(
                    {
                        user_id: user._id,
                        username: user.username
                    },
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
}

async function refresh(req, res, next) {
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
                        if(error || user._id.toString() !== decoded.user_id) {
                            return res.sendStatus(403)
                        }
                        const accessToken = jwt.sign(
                            {
                                user_id: decoded.user_id,
                                username: decoded.username
                            },
                            process.env.ACCESS_TOKEN_SECRET,
                            {expiresIn: '30s'}
                        )
                        res.json({accessToken})
                    }
                )
            }
        }
    })
}

async function logout(req, res, next) {
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
}

async function register(req, res, next) {
    let {username, password } = req.body
    const hash = await bcrypt.hash(password, 10)

    let userData = {
        username,
        password: hash,
        requestToken: ''
    }

    UserModel.findOne({username}, async (error, user) => {
        if(error){
            console.log(error)
        } else {
            if(!user){
                let newUser = new UserModel(userData)
                await newUser.save()
                return res.status(200).send({
                    success: true,
                    message: 'Registered User'
                });
            } else {
                return res.status(200).send({
                    success: false,
                    message: 'User already exists'
                });
            }
        }
    })
}

module.exports = {login, refresh, logout, register}