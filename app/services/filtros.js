"use strict";

const config = require('../../config');
const sqlDatos = require('../services/datos-sql');
const sql = new sqlDatos(config.pais);
const elasticsearchClass = require('./elasticsearch');
const elasticsearch = new elasticsearchClass();
const utilsClass = require('../utils/utils');
const utils = new utilsClass();
const data = require('../../files');
const responseClass = require('../models/filtros/response');

module.exports = class Filtros {
    constructor(params) {
        this.params = params;
    }

    async obtenerDatos() {
        //this.params.filtroOrigen = await sql.listaFiltros();        
        this.params.filtroOrigen = data.filtroOrigen;

        let elasticsearchData = data.elasticsearch; //await elasticsearch.ejecutarBusquedaFiltro(this.params);
        this.params.filtroElasticsearch = elasticsearchData.aggregations;
        this.params.elasticsearchData = elasticsearchData;

        this.params.productos = this.productos();
        this.params.filtros = this.filtroNormal();

        let response = new responseClass(this.params).json();

        return response;
    }

    productos() {
        let productos = this.params.elasticsearchData;
        let resultado = [];

        for (let i = 0; i < productos.hits.hits.length; i++) {
            const item = productos.hits.hits[i];
            let source = item._source;
            let image = utils.urlImage(source.imagen, config.pais, source.imagenOrigen, config.campania, source.marcaId);

            resultado.push({
                cuv: source.cuv,
                codigoProducto: source.codigoProducto,
                imagen: image ? image : "no_tiene_imagen.jpg",
                descripcion: source.descripcion,
                valorizado: source.valorizado ? source.valorizado : 0,
                precio: source.precio,
                marcaId: source.marcaId,
                tipoPersonalizacion: source.tipoPersonalizacion,
                codigoEstrategia: source.codigoEstrategia ? source.codigoEstrategia : 0,
                codigoTipoEstrategia: source.codigoTipoEstrategia ? source.codigoTipoEstrategia : "0",
                tipoEstrategiaId: source.tipoEstrategiaId ? source.tipoEstrategiaId : 0,
                limiteVenta: source.limiteVenta ? source.limiteVenta : 0,
                stovk: true,
                estrategiaId: source.estrategiaId,
                SubCampania: source.SubCampania ? true : false
            });
        }
        return resultado;
    }

    filtroNormal() {
        let filtroOrigenSeccion = utils.distinctInArray(this.params.filtroOrigen, 'IdSeccion');
        let filtroOrigenSoloPadre = utils.selectInArray(this.params.filtroOrigen, 'IdPadre', 0);
        let resultado = [];

        for (let i = 0; i < filtroOrigenSeccion.length; i++) {
            const item = filtroOrigenSeccion[i];
            let filtroSeccionOrigen = utils.selectInArray(filtroOrigenSoloPadre, 'IdSeccion', item.IdSeccion);
            let filtroSeccionElasticsearch = this.params.filtroElasticsearch[item.IdSeccion].buckets;
            let filtroSeccionRequest = this.params.filtros.find(x => x.NombreGrupo === item.Seccion);
            let filtroSeccion = [];

            for (let j = 0; j < filtroSeccionOrigen.length; j++) {
                const element = filtroSeccionOrigen[j];
                let filtro = filtroSeccionElasticsearch.find(x => x.key === element.FiltroNombre);
                let filtroRequest = !filtroSeccionRequest ? filtroSeccionRequest : filtroSeccionRequest.Opciones.find(x => x.IdFiltro === element.Codigo);
                filtroSeccion.push({
                    idFiltro: element.Codigo,
                    nombreFiltro: element.FiltroNombre,
                    cantidad: !filtro ? 0 : filtro.doc_count,
                    marcado: !filtroRequest ? false : true
                });
            }

            resultado.push({
                NombreGrupo: item.Seccion,
                Opciones: filtroSeccion
            });
        }
        return resultado;
    }
}