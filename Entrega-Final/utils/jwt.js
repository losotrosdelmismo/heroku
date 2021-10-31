const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secret = 'secret';
const duaracionDeSecion = require('../config/config.json').duracion_de_sesion;

function checkAuthentication(req, res, next) {
    //let token = req.headers.authorization;
    let token = req.session.JWT
   
    if (!token) {
        return res.status(403).send('debe proveer el token');
    }

    jwt.verify(token, secret, (err, value) => {
        if (err) return res.status(500).send('fallo la autenticacion con token');
        req.user = value;
        next();
    });
}

const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
}

function generateToken(user) {
    return jwt.sign({ data: user }, secret, { expiresIn: duaracionDeSecion });
}

const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

module.exports = {
    createHash,
    generateToken,
    isValidPassword,
    checkAuthentication
}