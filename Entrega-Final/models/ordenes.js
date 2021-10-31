const mongoose = require('mongoose');

const orden = mongoose.Schema({
    carrito: {type: Array},    
    user: {type: String, require: true, max: 500}    
})

const ordenes = mongoose.model('ordenes', orden);

module.exports = ordenes;