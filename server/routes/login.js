const express = require('express');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID_GOOGLE);

const User = require('./../models/user');

const app = express();

app.post('/login', (req, res) => {

    const body = req.body;
    const { email, password } = body;   

    if ( !email || !password ) return res.status(400).json({ ok: false, err: { message:'No se ha recibido usuario o contraseña' } }) 

    User.findOne({ email: email }, (err, usuarioDB) => {

        if (err) return res.status(500).json({ ok: false, err })

        if (!usuarioDB) {//Usuario invlaido
            return res.status(400).json({ ok: false, err: { message: 'Usuario o contraseña incorrectos' } })
        }

        if (!bcrypt.compareSync(password, usuarioDB.password)) {//Contraseña inválida
            return res.status(400).json({ ok: false, err: { message: 'Usuario o contraseña incorrectos' } })
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


//CONFIG GOOGLE
async function verify(token) {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID_GOOGLE,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    
    return{
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async (req, res) => {

    const token = req.body.idtoken;

    const googleUser = await verify(token)
        .catch( e => {
            return res.status(403).json({ ok:false, err: e})
        })

    User.findOne( {email: googleUser.email}, (err, userDB) => {

        if (err) return res.status(500).json({ ok: false, err });

        if (userDB) {
            if (userDB.google === false) {
                return res.status(400).json({ ok: false, err: { message: 'Debe de usar su autenticación normal' } })
            } else {
                const token = jwt.sign({
                    usuario: userDB
                }, process.env.SEED, { expiresIn: process.env.EXPIRATION });

                return res.json({
                    ok: true,
                    usuario: userDB,
                    token
                });
            }
        } else {
            //Si el usuario no existe en bd
            let user = new User();

            user.nombre = googleUser.nombre;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = true;
            user.password = ':)';

            user.save( (err, userDB) => {
                if (err) return res.status(500).json({ ok: false, err });

                const token = jwt.sign({
                    usuario: userDB
                }, process.env.SEED, { expiresIn: process.env.EXPIRATION });

                return res.json({
                    ok: true,
                    usuario: userDB,
                    token
                });
            } )
        }
    } )

})

module.exports = app;