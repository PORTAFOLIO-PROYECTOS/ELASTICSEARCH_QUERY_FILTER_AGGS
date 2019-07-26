"use strict";

const config = require('../../config');
const queryClass = require('../utils/scripts/elasticsearch/buscador');
const client = require('elasticsearch').Client({
    host: `${config.elasticsearch.host}`
});

module.exports = class Elasticsearch{
    constructor(){

    }

    ejecutar(body){
        let indexName = `${config.elasticsearch.index}_${config.pais.toLocaleLowerCase()}_${config.campania}`;
        let typeName = config.elasticsearch.type;
        return client.search({
            index: indexName,
            type: typeName,
            body: body
        });
    }

    async ejecutarBusquedaFiltro(params){
        let query = new queryClass(params);
        let body = query.buscadorFiltro();
        return await this.ejecutar(body);
        //return query.buscador();
    }

}