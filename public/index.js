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

        setLocalStorage: ((data, key) => {
            var value = JSON.stringify(data);
            localStorage.setItem(key, value);
        }),

        getLocalStorage: ((key) => {
            var value = localStorage.getItem(key);
            value = JSON.parse(value);
            return value;
        }),

        asignarTipoSeccion: ((data) => {

        })
    };

    const eventos = {
        SelecionaFiltro: function (e) {
            e.preventDefault();

            let filtro = $(this).closest("[data-item='filtroParent']").eq(0);
            let idFiltro = $(filtro).find(".idFiltro").val();
            let nombreFiltro = $(filtro).find(".nombreFiltro").val();
            let idSeccion = $(filtro).find(".idSeccion").val();

            let dataFiltroSelecion = {
                idFiltro,
                nombreFiltro,
                marcado: true,
                idSeccion
            }

            let dataLocalStorage = utils.getLocalStorage('filtro');

            let dataFiltroExistente = !dataLocalStorage ? [] : dataLocalStorage;
            console.log(dataFiltroExistente);
            dataFiltroExistente.push(dataFiltroSelecion);
            utils.setLocalStorage(dataFiltroExistente, 'filtro');
            service.cargarDatos(dataFiltroExistente);
        }
    }

    const service = {
        cargarDatos: (filtro) => {
            let data = {
                "textoBusqueda": "pack",
                "filtros": filtro || []
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
        $(document).on('click', '.filtro', eventos.SelecionaFiltro);
        service.cargarDatos();
        utils.setLocalStorage([], 'filtro');
    });

    return {
        init: init
    }
})();

$(document).ready(function () {
    index.init();
});