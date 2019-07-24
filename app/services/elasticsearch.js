"use strict";

const config = require('../../config');
const client = require('elasticsearch').Client({
    host: `${config.elasticsearch.host}`
});

module.exports = class Elasticsearch{
    constructor(){

    }

    ejecutar(){
        let indexName = `${config.elasticsearch.index}_${config.pais}_${config.campania}`;
        let typeName = config.elasticsearch.type;
        return client.search({
            index: indexName,
            type: typeName,
            body: body
        });
    }

    async ejecutarBusqueda(params){
        return params;
    }

}