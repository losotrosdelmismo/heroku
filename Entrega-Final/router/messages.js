const express = require('express');
const router = express.Router();
let persistencia = require('../repository/factory').getPersistencia();
let getPersistencia = new persistencia

var data = []; //array donde paso los datos

router.get('/messages', async (req, res) => {
    try {        
        
        let result = await getPersistencia.leer(data, "chat")
        res.json(result);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

router.get('/messages/:id', async (req, res) => {
    try {
       
        let result = await getPersistencia.leer(data, "chat", req.params.id)
        res.json(result);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

router.post('/messages', async (req, res) => {
    try {
        
        let result = await getPersistencia.guardar({autor: "metodo@post", date: new Date().toLocaleString(), texto: "prueba"}, "chat")
        return res.json({Agregado: "Articulo agregado desde metodo post", result: result});
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

router.put('/messages/:id', async (req, res) => {
    try {        
        
        let result = await getPersistencia.actualizar(req.params.id, new Date().toLocaleString(), "chat");
        res.json(result);
} catch (error) {
    return res.status(500).send({ error: error.message });
}
});

router.delete('/messages/:id', async (req, res) => {
    try {
        
        let result = await getPersistencia.borrar(req.params.id, "chat");
        return res.json(result);
        
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

module.exports = router;