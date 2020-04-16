const express = require('express');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const User = require('./../models/user');

const app = express();

app.post('/login', (req, res) => {

    const body = req.body;
    const { email, password } = body;   

    if ( !email || !password ) return res.status(400).json({ ok: false, err: 'No se ha recibido usuario o contraseña' }) 

    User.findOne({ email: email }, (err, usuarioDB) => {

        if (err) return res.status(500).json({ ok: false, err })

        if (!usuarioDB) {//Usuario invlaido
            return res.status(400).json({ ok: false, err: 'Usuario o contraseña incorrectos' })
        }

        if (!bcrypt.compareSync(password, usuarioDB.password)) {//Contraseña inválida
            return res.status(400).json({ ok: false, err: 'Usuario o contraseña incorrectos' })
        }

        const token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.EXPIRATION })

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })
    })



})

module.exports = app;