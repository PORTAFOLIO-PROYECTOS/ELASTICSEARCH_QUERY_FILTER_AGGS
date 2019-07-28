'use strict';

const config = require('../../../../config');
const utilsClass = require('../../utils');
const utils = new utilsClass();

module.exports = class ElasticsearchQuerys {
    constructor(params) {
        this.params = params;
    }

    buscadorFiltro() {
        let multiMatch = this.multiMatch();
        let aggs = this.aggregations();

        return {
            size: 20,
            query:{
                bool:{
                    must: multiMatch
                }
            },
            aggs
        }
    }

    multiMatch() {
        let texto = utils.decodeText(this.params.textoBusqueda);
        return [{
            multi_match: {
                query: texto,
                type: "best_fields",
                fields: config.elasticsearch.query.multiMatch
            }
        },{
            terms:{
                "codigoConsultora":["032610099","YYYYYYYYY","000000000"]
            }
        }];
    }

    aggregations() {
        if (this.params.filtroOrigen.length === 0) return [];

        let filtros = utils.distinctInArray(this.params.filtroOrigen, 'ElasticsearchCampo');
        let aggs = '{';
        let coma = 0;

        for (let i = 0; i < filtros.length; i++) {
            const element = filtros[i];

            if (coma > 0) aggs += ',';

            if (element.ElasticsearchOperador === 'term') {
                aggs += `"${element.IdSeccion}":{ "terms": { "field": "${element.ElasticsearchCampo}" }}`;
            }

            if (element.ElasticsearchOperador === 'range') {
                let seleccion = utils.selectInArray(this.params.filtroOrigen, 'ElasticsearchOperador', 'range');
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