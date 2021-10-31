const mongoose = require('mongoose');

const user = mongoose.Schema({    
    username: { type: String, require: true, max: 50 },
    password: { type: String, require: true, max: 400 },
    mail: { type: String, require: true, max: 100 },
    direccion: { type: String, require: true, max: 50 },
    edad: {type: Number, require: true},
    telefono: {type: Number, require: true},
    foto: { type: String, require: true, max: 400 },
    carrito: { type: Array},    
    id: {type: Number, require: false}
});

const User = mongoose.model('users', user);

module.exports = User; 