

class PersistenciaFactory {

    constructor() { }

    getPersistencia() {
        try {
            const tipo = require('../config/config.json').persistencia;
            let modulo = require(`../api/${tipo}`);
            return modulo
        } catch (error) {
            console.log('No se encontro el tipo de persistencia', error);
        }
    }
}

module.exports = new PersistenciaFactory();
