const options = require('../config/dataBase');
const knex = require('knex')(options);
//Cargamos los modelos
const usersModels = require('../models/users');
const mensajesModels = require('../models/mensajes');
const productosModels = require('../models/productos');
const ordenesModels = require('../models/ordenes')

//leemos las persistencias
const users = require('../persistencia/users.json');
const productos = require('../persistencia/productos.json');
const mensajes = require('../persistencia/mensajes.json')
//logs
const logger = require('../utils/winston');
//crear tablas ????
const tablasKnex = require('../models/crearTablaKnex')

class MySql {

    constructor() {}
 
    //leemos la base de datos y si no estan las creamos
    async leer(base, model, num) {
        
         try{
            if(num != null){
                let result =  await knex.from(model).where({id: num});
                return result;
            }   

             if(model === "users"){ 
                base = await knex.from(model).select('*');

                 if(base.length == 0){
                    await tablasKnex.users;                 
                    knex(model).insert(users)
                    .then(() => {
                    logger.warn('producto agregado');
                    }).catch(error => {
                    logger.warn('error: tabla no existe, ejecutar crearTablaKnex.js', error);
                    }).finally(() => {
                    logger.warn('cerrando conexion...');
                    knex.destroy();
                    });               
                    return base = await knex.from(model).select('*');               
                 }
                 
                 return base;
             }
             if(model === "productos"){               
             
                base = await knex.from(model).select('*');

                 if(base.length == 0){
                    await tablasKnex.productos;                 
                    knex(model).insert(productos)
                    .then(() => {
                    logger.warn('producto agregado');
                    }).catch(error => {
                    logger.warn('error: tabla no existe, ejecutar crearTablaKnex.js', error);
                    }).finally(() => {
                    logger.warn('cerrando conexion...');
                    knex.destroy();
                    });               
                    return base = await knex.from(model).select('*');               
                 }
                 
                 return base; 
             }
             if(model === "chat"){

                base = await knex.from(model).select('*');

                if(base.length == 0){

                await tablasKnex.chat;
                knex(model).insert(mensajes)
                .then(() => {
                logger.warn('mensaje agregado');
                }).catch(error => {
                logger.warn('error: tabla no existe, ejecutar crearTablaKnex.js', error);
                }).finally(() => {
                logger.warn('cerrando conexion...');
                knex.destroy();                
                }); 

                base = await knex.from(model).select('*');
                }
                return base
            }
             if(model === "orden-de-compra"){
             
                 base = await usersModels.find({username: num}); 
                 return base      
                    
             }
             
         }          
         catch(error){
         logger.error('Error al leer en MYSQL:', model, error);
     }
 }
 
 async guardar(data, model, username) { 
     
     try{

        await knex(model).insert(data);
         
     }catch{
         logger.error(data)
         logger.error("Error en guardar MYSQL: " + model);
     }      
  }
  async actualizar(num, toUpdate, model) {
     try{
         if(model === "users"){
             return  await knex(model).where({username: num}).update({foto: toUpdate});
         }
         if(model === "productos"){
            return  await knex(model).where({id: num}).update({actualizado: toUpdate});
         }
         if(model === "chat"){
            return  await knex(model).where({id: num}).update({date: toUpdate});
         }
         if(model === "orden-de-compra"){
            return  await knex(model).where({username: num}).update({carrito: toUpdate});
         }
         
     }catch{
         logger.error("error en actualizar MYSQL: " + model);
     }
     
  }
 
  async borrar(num, model){
     
      try{
        await  knex(model)
        .where({ id: num })
        .del()
      }catch{
         logger.error("error en borrar MYSQL: " + model);
     }
  }
 }    

module.exports = MySql;