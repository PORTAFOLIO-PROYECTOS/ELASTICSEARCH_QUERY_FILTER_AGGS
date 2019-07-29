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

        let elasticsearchData =  await elasticsearch.ejecutarBusquedaFiltro(this.params);
        //let elasticsearchData = data.elasticsearch;
        this.params.elasticsearchData = elasticsearchData;

        this.params.productos = this.productos();

        let filtroPadreHijo = this.filtro();
        this.params.filtroNuevo = this.filtroOrdenar(filtroPadreHijo);

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

    filtro() {
        let filtroOrigenDistinct = utils.distinctInArray(this.params.filtroOrigen, 'IdSeccion');
        let filtroOrigen = this.params.filtroOrigen;
        let filtrosElasticsearch = this.params.elasticsearchData.aggregations;
        let resultado = [];

        for (let i = 0; i < filtroOrigenDistinct.length; i++) {
            const item = filtroOrigenDistinct[i];
            let filtroSeccionOrigen = utils.selectInArray(filtroOrigen, 'IdSeccion', item.IdSeccion); // se selecciona todos los filtros de esa sección
            let filtroSeccionElasticsearch = filtrosElasticsearch[item.IdSeccion].buckets; // se selecciona los filtros de esa sección en la data de elastic
            let filtroSeccionRequest = utils.selectInArray(this.params.filtros, 'idSeccion', item.IdSeccion);
            let filtroSeccion = [];

            for (let j = 0; j < filtroSeccionOrigen.length; j++) { // se recorre los filtros de la sección
                const element = filtroSeccionOrigen[j];
                let filtro = filtroSeccionElasticsearch.find(x => x.key === element.FiltroNombre); // se seleciona el filtro en la data de elastic 
                let filtroRequest = filtroSeccionRequest ? filtroSeccionRequest.find(x => x.idFiltro === element.Codigo) : filtroSeccionRequest; // se verifica si ese filtro que viene en el request existe

                filtroSeccion.push({
                    idFiltro: element.Codigo,
                    nombreFiltro: element.FiltroNombre,
                    cantidad: filtro ? filtro.doc_count : 0,
                    marcado: filtroRequest ? true : false,
                    id: element.IdFiltro,
                    parent: element.IdPadre,
                    type: item.Tipo,
                    idSeccion: item.IdSeccion,
                    //tieneHijo: tieneHijos.length === 0 ? false : true
                });

                /*let distinct = utils.distinctInArray(filtroSeccion, 'parent');
                filtroSeccion.forEach(element => {

                });*/
            }

            resultado.push({
                IdSeccion: item.IdSeccion,
                NombreGrupo: item.Seccion,
                Tipo: item.Tipo,
                Opciones: filtroSeccion
            });
        }
        return resultado;
    }

    filtroOrdenar(arr) {
        let resultado = [];

        arr.forEach(item => {
            item.Opciones = this.filtroOrdenarRecursiva(item.Opciones, 0);
            resultado.push(item);
        });

        return resultado;
    }

    filtroOrdenarRecursiva(arr, parent) {
        let out = [];

        for (let i in arr) {
            if (arr[i].parent === parent) {
                let children = this.filtroOrdenarRecursiva(arr, arr[i].id)

                if (children.length) arr[i].children = children;
                
                out.push(arr[i])
            }
        }
        return out;
    }

    asignarEvento(arr) {
        arr.forEach(item => {

        });
    }

    asignarRecursive(arr, type) {
        let children = false;
        for (const i in arr) {
            if (arr[i].children) children = true;

        }
    }
}