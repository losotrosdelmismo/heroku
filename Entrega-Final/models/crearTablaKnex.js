const options = require('../dataBase/dataBase');
const knex = require('knex')(options);


//creamos la tabla
const users = knex.schema.createTable('users', table => {    
    table.string('username');
    table.string('password');
    table.string('mail');
    table.string('direccion');
    table.integer('edad');
    table.integer('telefono');
    table.string('foto');
    table.string('carrito');
    table.integer('id');
}).then(() => {
    logger.warn('tabla usuarios creada!');
}).catch(error => {
    logger.warn('error:', error);
    throw error;
}).finally(() => {
    logger.warn('cerrando conexion...');
    knex.destroy(); 
});

const chat = knex.schema.createTable('chat', table => {    
        table.string('autor');
        table.string('date');
        table.string('texto');
        table.integer("id")
    }).then(() => {
        logger.warn('tabla mensajes creada!');
    }).catch(error => { 
        logger.warn('error:', error);
        throw error;
    }).finally(() => { 
        logger.warn('cerrando conexion...');
        knex.destroy();
    });

    const productos = knex.schema.createTable('productos', table => {    
        table.string('title');
        table.integer('price');
        table.string('thumbnail');
        table.integer('id');
        table.string('actualizado');
    }).then(() => {
        logger.warn('tabla productos creada!');
    }).catch(error => {
        logger.warn('error:', error);
        throw error;
    }).finally(() => {
        logger.warn('cerrando conexion...');
        knex.destroy();
    });

const carrito = knex.schema.createTable('carrito', table => {   
 knex.schema.createTable('carrito', table => {   
    table.increments('id');
    table.string('timeStamp');
    table.string('producto'); 
}).then(() => {
    logger.warn('tabla carrito creada!'); 
}).catch(error => {
    logger.warn('error:', error);
    throw error;
}).finally(() => {
    logger.warn('cerrando conexion...');
    knex.destroy();
});
})

module.exports = {
    carrito,
    productos,
    chat,
    users
}
