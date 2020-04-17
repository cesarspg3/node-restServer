const express = require('express');
const { checkToken } = require('./../middlewares/auth');
const _ = require('underscore')
const app = express();
const Product = require('./../models/product');

//Devolver todas los productos
app.get('/products', checkToken, async (req,res)=> {
    console.log('get all products')
    const cont = await Product.countDocuments();

    const since = Number(req.query.desde) || 0;
    const limit = Number(req.query.limite) || cont;

    Product.find({}, 'descripcion usuario')
        .skip(since)
        .limit(limit)
        .populate('usuario', 'nombre, email')//junta este campo con el de la tabla al que esté apuntando en el model
        .populate('categoria')
        .sort('descripcion')
        .exec( (err, products) => {

            if (err) return res.status(400).json({ ok: false, err })

            res.json({
                ok:true,
                producto: products,
                cantidad: cont
            })

        })
});

//Mostar un producto por el id
app.get('/products/:id', checkToken, (req, res)=> {
    console.log('Consultar un producto por su id')
    const id = req.params.id;
    Product.findById(id)
        .populate('usuario', 'nombre, email')
        .populate('categoria')
        .exec( (err, products) => {
            if (err) return res.status(400).json({ ok: false, err })
            res.json({
                ok:true,
                producto: products,
        })
    })
});

//Buscar un producto
app.get('/products/search/:search', checkToken, (req, res)=> {
    console.log('Buscar producto por su id')
    const search = req.params.search;
    const regex = new RegExp(search, 'i')
    Product.find({ nombre: regex })
        .populate('usuario', 'nombre, email')
        .populate('categoria')
        .exec( (err, products) => {
            if (err) return res.status(400).json({ ok: false, err })
            res.json({
                ok:true,
                producto: products,
        })
    })
});

//crear un nuevo producto y devolverla
app.post('/products', checkToken, (req,res)=> {
    console.log('post products');
    console.log(req.userToken);

    const body = req.body;
    const product = new Product({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.userToken._id,
    });

    product.save( (err, productDB) => {

        if (err) return res.status(500).json({ ok: false, err })
        
        res.json({
            ok: true,
            producto: productDB
        })

    })
});

//Modificar producto y devolverle
app.put('/products/:id', checkToken, (req,res)=> {
    console.log('actualizar producto');

    const id = req.params.id;
    const body = _.pick(req.body, ['nombre','precioUni','descripcion']);

    Product.findByIdAndUpdate( id, body, {new: true, runValidators:true}, (err, productDB) => {
        
        if (err) return res.status(400).json({ ok: false, err })

        res.json({
            ok: true,
            producto: productDB
        })
    
    })
});

//borrar producto y devolverla
app.delete('/products/:id', checkToken, (req,res)=> {
    
    const id = req.params.id;
    const body = {disponible: false};
    Product.findByIdAndUpdate( id, body, { new: true }, (err, disabledProduct) => {
        
        if (err) return res.status(400).json({ ok: false, err })

        res.json({
            ok: true,
            producto: disabledProduct
        })
    
    })

});



module.exports = app; 