'use strict';

module.exports = class Response {
    constructor(params) {
        this.params = params;
    }

    json() {
        return {
            total: this.params.elasticsearchData.hits.total,
            productos: this.params.productos,
            filtros: this.params.filtroNuevo
        }
    }
}