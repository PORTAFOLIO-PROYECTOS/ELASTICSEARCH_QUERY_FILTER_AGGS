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
        this.params.filtros = this.filtroNormal(true);

        let filtroPadreHijo = this.filtroNormal();
        this.params.filtroNuevo = this.filtroNuevo(filtroPadreHijo);

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

    filtroNormal(value) {
        let filtroOrigenDistinct = utils.distinctInArray(this.params.filtroOrigen, 'IdSeccion');
        let filtroOrigenSoloPadre = value ? utils.selectInArray(this.params.filtroOrigen, 'IdPadre', 0) : this.params.filtroOrigen;
        let resultado = [];

        for (let i = 0; i < filtroOrigenDistinct.length; i++) {
            const item = filtroOrigenDistinct[i];
            let filtroSeccionOrigen = utils.selectInArray(filtroOrigenSoloPadre, 'IdSeccion', item.IdSeccion); // se selecciona todos los filtros de esa sección
            let filtroSeccionElasticsearch = this.params.filtroElasticsearch[item.IdSeccion].buckets; // se selecciona los filtros de esa sección en la data de elastic
            let filtroSeccionRequest = this.params.filtros.find(x => x.NombreGrupo === item.Seccion); // se verifica si ese filtro viene en el request
            let filtroSeccion = [];

            for (let j = 0; j < filtroSeccionOrigen.length; j++) { // se recorre los filtros de la sección
                const element = filtroSeccionOrigen[j];
                let filtro = filtroSeccionElasticsearch.find(x => x.key === element.FiltroNombre); // se seleciona el filtro en la data de elastic 
                let filtroRequest = filtroSeccionRequest ? filtroSeccionRequest.Opciones.find(x => x.IdFiltro === element.Codigo) : filtroSeccionRequest; // se verifica si ese filtro que viene en el request existe
                filtroSeccion.push({
                    idFiltro: element.Codigo,
                    nombreFiltro: element.FiltroNombre,
                    cantidad: filtro ? filtro.doc_count : 0,
                    marcado: filtroRequest ? true : false,
                    id: element.IdFiltro,
                    parent: element.IdPadre
                });
            }

            resultado.push({
                IdSeccion: item.IdSeccion,
                NombreGrupo: item.Seccion,
                Opciones: filtroSeccion
            });
        }
        return resultado;
    }

    filtroNuevo(arr) {
        let resultado = [];

        //let data = this.ordenarFiltroNuevoPadreHijo(arr[2].Opciones, 0);

        arr.forEach(item =>{
            item.Opciones = this.ordenarFiltroNuevoPadreHijo(item.Opciones, 0);
            resultado.push(item);
        });


        // for (let i = 0; i < arr.length; i++) {
        //     const item = arr[i];
            
        //     this.Opciones = this.ordenarFiltroNuevoPadreHijo(item.Opciones, 0);
        //     resultado.push(item);
        // }

        return resultado;
    }

    ordenarFiltroNuevoPadreHijo(arr, parent) {
        var out = []
        for (var i in arr) {
            if (arr[i].parent === parent) {
                var children = this.ordenarFiltroNuevoPadreHijo(arr, arr[i].id)

                if (children.length) {
                    arr[i].children = children
                }
                out.push(arr[i])
            }
        }
        return out;
    }
}