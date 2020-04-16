const jwt = require('jsonwebtoken');

// ===================
// Verificar Token
// ===================
const checkToken = (req, res, next) => {
    
    if (!req.headers.authorization) return res.status(400).json({ ok: false, err: 'token no recibido' });
    const token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        
        if (err) {
            return res.status(401).json({ ok: false, err: 'token no válido' });
        }

        req.userToken = decoded.usuario;
        next();

    })

}

// ===================
// Verificar userAdmin
// ===================
const checkUserAdmin = (req, res, next) => {

    const user = req.userToken;

    if (!user) {
        if (!req.headers.authorization) return res.status(400).json({ ok: false, err: 'usuario no recibido para validarlo' });
    }

    if (user && user.role && user.role === 'ADMIN_ROLE') {
        next();
    } else {
        if (!user) {
            return res.status(400).json({ ok: false, err: 'usuario no recibido para validarlo' });
        } else if (!user.role){
            return res.status(400).json({ ok: false, err: 'usuario sin rol' });
        } else {
            return res.status(400).json({ ok: false, err: 'usuario sin permisos' });
        }
    }

}

module.exports = { checkToken, checkUserAdmin }