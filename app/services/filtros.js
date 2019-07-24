"use strict";

const config = require('../../config');
const sqlDatos = require('../services/datos-sql');
const sql = new sqlDatos(config.pais);
const elasticsearchClass = require('./elasticsearch');
const elasticsearch = new elasticsearchClass();

module.exports = class Filtros {
    constructor(params) {
        this.params = params;
    }

    async obtenerDatos(){
        return await elasticsearch.ejecutarBusqueda(this.params);
    }
}