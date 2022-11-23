require('dotenv').config()

const path = require('path')
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const photosRouter = require('./routes/photo.router');
const authRouter = require('./routes/auth.router');
const verifyJWT = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser')
const credentials = require('./middleware/credentials')
const corsOptions = require('./middleware/corsOptions')

const app = express();
const ports = process.env.PORT | 3000

mongoose.connect(
    'mongodb://127.0.0.1:27017', {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      }
).then(() =>{
    app.listen(ports, console.log(`The server is running on port ${ports}`))
}).catch((err) =>{
    console.log(err)
});

app.use(bodyParser.json());
app.use(cookieParser())
app.use(credentials)
app.use(cors(corsOptions));
app.use('/photos', express.static(path.join('photos')))
app.use('/auth', authRouter);

app.use(verifyJWT)
app.use('/photo', photosRouter);