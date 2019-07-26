'use strict';

const utilsClass = require('../../utils');
const utils = new utilsClass();

module.exports = class ElasticsearchQuerys {
    constructor(params) {
        this.params = params;
    }

    buscador() {
        return this.aggregations();
    }

    aggregations() {
        if (this.params.filtroDatosSQL.length === 0) return [];

        let filtros = utils.distinctInArray(this.params.filtroDatosSQL, 'ElasticsearchCampo');
        let aggs = '{';
        let coma = 0;

        for (let i = 0; i < filtros.length; i++) {
            const element = filtros[i];

            if (coma > 0) aggs += ',';

            if (element.ElasticsearchOperador === 'term') {
                aggs += `"${element.IdSeccion}":{ "terms": { "field": "${element.ElasticsearchCampo}" }}`;
            }

            if (element.ElasticsearchOperador === 'range') {
                let seleccion = utils.selectInArray(this.params.filtroDatosSQL, 'ElasticsearchOperador', 'range');
                let comaRange = 0;

                aggs += `"${element.IdSeccion}": { "range": { "field": "${element.ElasticsearchCampo}", "ranges": [`;

                for (let j = 0; j < seleccion.length; j++) {
                    const item = seleccion[j];

                    if (comaRange > 0) aggs += ',';

                    aggs += `{ "key": "${item.FiltroNombre}"`;
                    if (item.ValorMinimo > 0) aggs += `, "from": "${item.ValorMinimo}"`;
                    if (item.ValorMaximo > 0) aggs += `, "to": "${item.ValorMaximo}"`;
                    aggs += '}';

                    comaRange++;
                }

                aggs += ']}}';
            }

            coma++;
        }

        aggs += '}';
        return JSON.parse(aggs);
    }

}