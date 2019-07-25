'use strict';

module.exports = class ElasticsearchQuerys {
    constructor(params) {
        this.params = params;
    }

    buscador() {

    }

    aggregations() {
        if (this.params.filtroDatosSQL.length === 0) return [];

        let filtros = utils.distinctInArray(this.params.filtroDatosSQL, 'ElasticsearchCampo');
        let aggs = '{';
        let coma = 0;
        let j = 0;

        for (let index = 0; index < filtros.length; index++) {
            const element = filtros[index];
            if (coma > 0) aggs += ',';
            if (element.ElasticsearchOperador === 'term') {
                aggs = `"${element.}"`;
            }

            coma++;
        }

        aggs += '}';
        return JSON.parse(aggs);
    }

}