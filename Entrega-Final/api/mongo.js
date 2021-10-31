const fs = require('fs');
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

class Mongo {

   constructor() {}

   //leemos la base de datos y si no estan las creamos
   async leer(base, model, num) {
       
        try{
            if(model === "users"){

                //buscar un articulo por ID
                if(num != null){
                    return usersModels.find({id: num}) 
                }
                //sino cargamos el array con la base de datos
                base = await usersModels.find();
                //sino existe la creamos y le brindamos los datos que esten en el archivo de persistencia
                if(base.length == 0){                
                    await usersModels.create(users);
                    base = await usersModels.find();                                
                }
    
                return base; 
            }
            if(model === "productos"){
            
                base = await productosModels.find();            
                if(base.length == 0){                
                    await productosModels.create(productos);
                    base = await productosModels.find(); 
                                
                }
                if(num != null){
                    return productosModels.find({id: num}) 
                }    
                return base; 
            }
            if(model === "chat"){
                base = await mensajesModels.find();
                if(base.length == 0){
                    await mensajesModels.create(mensajes);
                    base = await mensajesModels.find();
                   
                }
                if(num != null){
                    return mensajesModels.find({id: num}) 
                }
                
                return base; 
            }
            if(model === "orden-de-compra"){
            
                base = await usersModels.find({username: num}); 
                return base      
                   
            }
            
        }          
        catch(error){
        logger.error('Error al leer en Mongo:', model, error);
    }
}

async guardar(data, model, username) { 
    
    try{
        let result;
      
        if(model === "users"){
            
           let base = await usersModels.find();

            if(base.length == 0){                
                await usersModels.create(users);
                base = await usersModels.find();
                data.id = base.length +1;
                result = await usersModels.create(data);
                base = await usersModels.find();                
                return result;
                            
            }else{
                data.id = base.length +1;
                result = await usersModels.create(data); 
                base = await usersModels.find();                                  
                return result;
            }            
        }
        if(model === "chat"){
            return result = await mensajesModels.create(data);            
        }
        if(model === "productos"){
            return result = await productosModels.create(data);            
        }
        if(model === "ordenes"){
            return result = await ordenesModels.create(data);            
        }
        
    }catch{
        logger.error(data)
        logger.error("Error en guardar MONGO: " + model);
    }      
 }
 async actualizar(num, toUpdate, model) {
    try{
        if(model === "users"){
            return usersModels.updateOne({username: num}, {$set: {foto: toUpdate}});
        }
        if(model === "productos"){
            return productosModels.updateOne({id: num}, { $set: {actualizado: toUpdate}});
        }
        if(model === "chat"){
         return  mensajesModels.updateOne({id: num}, { $set: {date: toUpdate}});          
        }
        if(model === "orden-de-compra"){
            
          base = await usersModels.updateOne({username: num}, { $set: {carrito: toUpdate}});    
          return base       
             
        }
        
    }catch{
        logger.error("error en actualizar MONGO: " + model);
    }
    
 }

 async borrar(num, model){
    
     try{
        if(model === "users"){
            return usersModels.deleteOne({id: num});
        }
        if(model === "productos"){
            return productosModels.deleteOne({id: num});
     }
     if(model === "chat"){
        return mensajesModels.deleteOne({id: num});        
     }
     if(model === "carrito"){
        return carritoModels.deleteOne({id: num});        
     }
     }catch{
        logger.error("error en borrar MONGO: " + model);
    }
 }
}    


module.exports = Mongo;