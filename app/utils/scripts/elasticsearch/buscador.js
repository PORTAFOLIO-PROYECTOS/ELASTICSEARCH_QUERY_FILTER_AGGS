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
        let filter = this.filtroSelecion();

        return {
            size: 20,
            query: {
                bool: {
                    must: multiMatch,
                    filter
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
        }, {
            terms: {
                "codigoConsultora": ["032610099", "YYYYYYYYY", "000000000"]
            }
        }];
    }

    filtroSelecion() {
        if (this.params.filtros.length === 0) return [];

        let seccionFiltro = utils.distinctInArray(this.params.filtroOrigen, 'IdSeccion');
        let resultado, must = [];

        for (let j = 0; j < seccionFiltro.length; j++) {
            const item = seccionFiltro[j];
            let filtroEnSeccion = this.params.filtros.find(x => x.idSeccion === item.IdSeccion);

            for (let i = 0; i < filtroEnSeccion.length; i++) {
                const element = filtroEnSeccion[i];
                let datoFiltro = this.params.filtroOrigen.find(x => x.Codigo === element.idFiltro); // se obtiene todos los datos del filtro
                let ranges, terms = [];
                if (datoFiltro) {
                    if (datoFiltro.ElasticsearchOperador === 'term') {
                        terms.push({
                            term: {
                                [datoFiltro.ElasticsearchCampo]: datoFiltro.FiltroNombre
                            }
                        });
                    }
                    if (datoFiltro.ElasticsearchOperador === 'range') {
                        if (datoFiltro.ValorMinimo > 0 && datoFiltro.ValorMaximo > 0) {
                            ranges.push({
                                from: datoFiltro.ValorMinimo,
                                to: datoFiltro.ValorMaximo
                            });
                        } else {
                            if (datoFiltro.ValorMaximo > 0) ranges.push({ to: datoFiltro.ValorMaximo });
                            if (datoFiltro.ValorMinimo > 0) ranges.push({ from: datoFiltro.ValorMinimo });
                        }

                        if (ranges.length > 0) {
                            terms.push({
                                range: {
                                    [datoFiltro.ElasticsearchCampo]: ranges
                                }
                            });
                        }
                    }

                    must.push({
                        bool: {
                            should: terms
                        }
                    });
                }
            }
        }

        if (must) {
            resultado.push({
                bool: {
                    must
                }
            });
        }

        return resultado;
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
                let seleccion = this.params.filtroOrigen.find(x => x.ElasticsearchOperador === element.ElasticsearchOperador);
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