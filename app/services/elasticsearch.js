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
        let indexName = `${config.elasticsearch.index}_${config.pais}_${config.campania}`;
        let typeName = config.elasticsearch.type;
        return client.search({
            index: indexName,
            type: typeName,
            body: body
        });
    }

    async ejecutarBusquedaFiltro(params){
        let query = new queryClass(params);
        return this.ejecutar(query);
        //return query.buscador();
    }

}