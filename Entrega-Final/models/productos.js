const mongoose = require('mongoose');

const productos = mongoose.Schema({
    title: { type: String, require: true, max: 100},
    price: {type: Number, require: true},
    thumbnail: {type: String, require: true, max: 500},
    id: {type: Number, require: false},
    actualizado:  {type: String, require: false }
})

const Productos = mongoose.model('productos', productos);

module.exports = Productos;