const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore')
const User = require('./../models/user');
const { checkToken, checkUserAdmin } = require('./../middlewares/auth')

const app = express();

app.get('/usuario', checkToken, (req, res) => {

    console.log('get usuario');
    console.log(req.userToken);//usuario sacado del token el cual crea la petición
    
    const since = Number(req.query.desde) || 0;
    const limit = Number(req.query.limite) || 5;

    User.find({estado: true}, 'nombre email role estado google email')//en las llaves podriamos poner google: true para que nos devuelva con esa condición
        .skip(since)//desde este registro
        .limit(limit)//registros a devolver
        .exec( (err, users) => {
            if (err) return res.status(400).json({ ok: false, err })

            User.count({estado: true}, (err, cont) => {
                res.json({
                    ok:true,
                    usuarios:users,
                    cantidad: cont
                })
            })

        })

})
  
app.post('/usuario', checkToken, (req, res) => {

    console.log('post usuario');
    console.log(req.userToken);

    const body = req.body;
    const user = new User({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync( body.password, 10),
        role: body.role
    });

    user.save( (err, userDB) => {

        if (err) return res.status(400).json({ ok: false, err })
        
        res.json({
            ok: true,
            usuario: userDB
        })

    })

})

app.put('/usuario/:id', [checkToken, checkUserAdmin], (req, res) => {
    
    console.log('put usuario');
    console.log(req.userToken);

    const id = req.params.id;
    const body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);//solo se modificarán esos campos independiente de lo que nos manden

    User.findByIdAndUpdate( id, body, {new: true, runValidators:true}, (err, userDB) => {
        
        if (err) return res.status(400).json({ ok: false, err })

        res.json({
            ok: true,
            usuario: userDB
        })
    
    })

})

app.delete('/usuario/:id', checkToken, (req, res) => {

    console.log('delete usuario');
    console.log(req.userToken);

    const id = req.params.id;
    const body = {estado: false};
    User.findByIdAndUpdate( id, body, { new: true }, (err, disabledUser) => {
        
        if (err) return res.status(400).json({ ok: false, err })

        res.json({
            ok: true,
            usuario: disabledUser
        })
    
    })
    // User.findByIdAndRemove(id, (err, deletedUser) => {
    //     if (err) return res.status(400).json({ ok: false, err })

    //     if (!deletedUser) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         })
    //     }
    //     res.json({
    //         ok: true,
    //         usuario: deletedUser
    //     })
    // })
})

module.exports = app;