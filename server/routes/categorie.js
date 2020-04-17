const express = require('express');
const { checkToken, checkUserAdmin } = require('./../middlewares/auth');
const _ = require('underscore')
const app = express();
const Categorie = require('./../models/categorie');

//Devolver todas las categorias
app.get('/categorie', checkToken, async (req,res)=> {
    console.log('get categorias')
    const cont = await Categorie.countDocuments();

    const since = Number(req.query.desde) || 0;
    const limit = Number(req.query.limite) || cont;

    Categorie.find({}, 'descripcion usuario')
        .skip(since)//desde este registro
        .limit(limit)//registros a devolver
        .populate('usuario', 'nombre, email')//junta este campo con el de la tabla al que esté apuntando en el model
        .sort('descripcion')
        .exec( (err, categories) => {

            if (err) return res.status(400).json({ ok: false, err })

            res.json({
                ok:true,
                categorias: categories,
                cantidad: cont
            })

        })
});

//Mostar una cateroria por el id
app.get('/categorie/:id', checkToken, (req, res)=> {
    console.log('Consultar una categoria por su id')
    const id = req.params.id;
    Categorie.findById(id , (err, categorie) => {
        if (err) return res.status(400).json({ ok: false, err })
        res.json({
            ok:true,
            categoria: categorie,
        })
    })
});

//crear nueva categoría y devolverla
app.post('/categorie', checkToken, (req,res)=> {
    console.log('post categoria');
    console.log(req.userToken);

    const body = req.body;
    const categorie = new Categorie({
        descripcion: body.descripcion,
        usuario: req.userToken._id,
    });

    categorie.save( (err, categorieDB) => {

        if (err) return res.status(500).json({ ok: false, err })
        
        res.json({
            ok: true,
            categoria: categorieDB
        })

    })
});

//Modificar categoría y devolverla
app.put('/categorie/:id', checkToken, (req,res)=> {
    console.log('actualizar categoria');

    const id = req.params.id;
    const body = _.pick(req.body, ['descripcion']);

    Categorie.findByIdAndUpdate( id, body, {new: true, runValidators:true}, (err, categorieDB) => {
        
        if (err) return res.status(400).json({ ok: false, err })

        res.json({
            ok: true,
            categoria: categorieDB
        })
    
    })
});

//borrar categoría y devolverla, solo el admin la puede borrar
app.delete('/categorie/:id', [checkToken, checkUserAdmin], (req,res)=> {
    
    const id = req.params.id;

    Categorie.findByIdAndRemove(id, (err, deletedCategorie) => {
        if (err) return res.status(400).json({ ok: false, err })

        if (!deletedCategorie) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categria no encontrada'
                }
            })
        }
        res.json({
            ok: true,
            categoria: deletedCategorie
        })
    })

});

module.exports = app; 