"use strict";

module.exports = class Request {
    constructor(params) {
        this.params = params;
    }

    json(){
        return{
            textoBusqueda: this.params.body.textoBusqueda,
            filtros: this.params.body.filtros
        }
    }
}