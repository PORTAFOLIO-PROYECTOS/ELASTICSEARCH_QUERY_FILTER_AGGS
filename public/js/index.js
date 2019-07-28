'use strict';

const index = (() => {

    const element = {
        templateFiltroMain: '#filtroTreeViewMain',
        templateFiltroList: '#filtroTreeViewList',
        templateCajaProducto: '#cajaProducto',
        mostrarFiltro: '#mostrarFiltro',
        mostrarCajaProducto: '#mostrarCajaProducto'
    }

    const utils = {
        mostrarFiltros: (data => {
            let main = Handlebars.compile($(element.templateFiltroMain).html());
            $(element.mostrarFiltro).html(main({
                items: data
            }));
        }),

        mostrarCajaProducto: (data => {
            let main = Handlebars.compile($(element.templateCajaProducto).html());
            $(element.mostrarCajaProducto).html(main({
                items: data
            }));
        }),

        asignarTipoSeccion: ((data) => {
            
        })
    };

    const service = {
        cargarDatos: () => {
            let data = {
                "textoBusqueda": "pack",
                "filtros": []
            };

            fetch('/filtros', {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(res => res.json())
                .catch(err => console.error('Error:', err))
                .then(response => {
                    utils.mostrarFiltros(response);
                    utils.mostrarCajaProducto(response);
                });
        }
    }

    const init = (() => {
        service.cargarDatos();
    });

    return {
        init: init
    }
})();

(() => {
    index.init();
})();