const mongoose = require('mongoose');
const urlMongoAtlas = "mongodb://root:coderoot@cluster0-shard-00-00.om0mm.mongodb.net:27017,cluster0-shard-00-01.om0mm.mongodb.net:27017,cluster0-shard-00-02.om0mm.mongodb.net:27017/Entrega-Final-MongoATLAS?replicaSet=atlas-14kjxl-shard-0&ssl=true&authSource=admin";
const logger = require('../utils/winston');

const connection = mongoose.connect(urlMongoAtlas, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {    
    logger.warn('[Mongoose Conexion MongoATLAS] - connected in:', urlMongoAtlas);
});

mongoose.connection.on('error', (err) => {
    logger.warn('[Mongoose] - error:', err);
});

module.exports = {connection, urlMongoAtlas}; 