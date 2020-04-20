const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

app.use( fileUpload({ useTempFiles: true }));
const User = require('./../models/user');
const Product = require('./../models/product')
const fs = require('fs');
const path = require('path');

app.put('/upload/:type/:id', function(req, res) {

    const type = req.params.type;
    const id = req.params.id;
    const validTypes = ['products', 'users'];

    if (!type || !validTypes.includes(type) ) {
        return res.status(400).json({ok:false, err:{message:'Tipo incorrecto, los permitidos son: ' + validTypes.join(', '), actualType: type}});
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ok:false, err:{message:'No se ha seleccionado ningún archivo'}});
    }

    const file = req.files.archivo;
    const fullFileName = file.name.split('.');
    const fileExtension = fullFileName[1];
    const validExtensions = ['jpg', 'png', 'gif', 'jpeg'];

    if ( !validExtensions.includes(fileExtension) ) {
      return res.status(400).json({ok:false, err:{message:'Extensión no válida, las permitidas son: ' + validExtensions.join(', '), extension: fileExtension}});
    }

    const uniqueFileName = `${id}-${new Date().getMilliseconds()}.${fileExtension}`

    file.mv(`./uploads/${type}/${uniqueFileName}`, function(err) {
      if (err)
        return res.status(500).json({ok:false, err});

        //   res.json({ok:true, err:{message:'Archivo subido correctamente'}});
        if (type === 'users') {
            userImg(id, res, uniqueFileName, type);
        } else if (type === 'products') {
            productImg(id, res, uniqueFileName, type);
        } 
    });
})

const userImg = (id, res, fileName, type) => {
    User.findById(id, (err, userDB) => {
        if (!userDB) {
            deleteFile(fileName, type);
            return res.status(400).json({ok:false, err:{message:'El usuario no existe', user: id}});
        }
        if (err) return res.status(500).json({ok:false, err});

        deleteFile(userDB.img, type);

        userDB.img = fileName;
        userDB.save((err, savedUser) => {
            if (err)  res.status(500).json({ok:false, err});
            res.status(400).json({ok:false, usuario: savedUser, img: fileName});
        })
    })
}

const productImg = (id, res, fileName, type) => {
    Product.findById(id, (err, productDB) => {
        if (!productDB) {
            deleteFile(fileName, type);
            return res.status(400).json({ok:false, err:{message:'El producto no existe', user: id}});
        }
        if (err) return res.status(500).json({ok:false, err});

        deleteFile(productDB.img, type);

        productDB.img = fileName;
        productDB.save((err, savedProduct) => {
            if (err)  res.status(500).json({ok:false, err});
            res.status(400).json({ok:false, product: savedProduct, img: fileName});
        })
    })
}

const deleteFile = (name, type) => {
    const pathImg = path.resolve(__dirname, `./../../uploads/${type}/${name}`);
    if ( fs.existsSync(pathImg) ) {//Comprobar si existe la imagen y borrarla
        fs.unlinkSync(pathImg);
    }
}

module.exports = app;