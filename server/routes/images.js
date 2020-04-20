const express = require('express');
const _ = require('underscore')
const app = express();
const { checkImgToken } = require('./../middlewares/auth');
const path = require('path');
const fs = require('fs');

app.get('/image/:type/:img', checkImgToken, (req,res)=> {
    console.log('get img')

    const type = req.params.type;
    const img = req.params.img; 

    const noImagePath = path.resolve(__dirname, './../assets/original.jpg')
    const pathImg = path.resolve(__dirname, `./../../uploads/${type}/${img}`);

    if ( fs.existsSync(pathImg) ) {
        res.sendFile(pathImg);
    } else {
        res.sendFile(noImagePath);
    }
});

module.exports = app;