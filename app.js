require('dotenv').config()

const path = require('path')
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const photosRouter = require('./routes/photo.router');

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
app.use(cors());
app.use('/photos', express.static(path.join('photos')))
app.use('/photo', photosRouter);