const express = require('express');
const router = express.Router();
let persistencia = require('../repository/factory').getPersistencia();
let getPersistencia = new persistencia
const jwt = require('../utils/jwt');
const server = require('../server');
const http = require('http').Server(server.app);
const io = require('socket.io')(http);

var data = []; //array donde paso los datos


router.get('/productos',  async (req, res) => {
    try {        
        let result = await getPersistencia.leer(data, "productos")
        res.json(result);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

router.get('/productos/:id', async (req, res) => {
    try {        
        let result = await getPersistencia.leer(data, "productos", req.params.id)
        res.json(result);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

router.post('/productos', async (req, res) => {
    try {        
        let result = await getPersistencia.guardar({title: "prueba"}, "productos")
        return res.json({Agregado: "Articulo agregado desde metodo post", result: result});
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

router.put('/productos/:id', async (req, res) => {
    try {            
            let result = await getPersistencia.actualizar(req.params.id,  new Date().toLocaleString(), "productos");
            return res.json(result);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

router.delete('/productos/:id', async (req, res) => {
    try {        
        let result = await getPersistencia.borrar(req.params.id, "productos");
        return res.json(result);
        
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

router.get('/ordenes', jwt.checkAuthentication, async (req, res) => {
    try {
        let user = req.session.username;               
        let result = await getPersistencia.leer(data, "orden-de-compra", user);
        res.send(`usuario: ${user} tu ultima compra fue <table>${result[0].carrito}</table>`)
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});



module.exports = router;