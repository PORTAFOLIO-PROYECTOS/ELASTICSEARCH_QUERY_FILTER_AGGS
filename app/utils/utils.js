"use strict";

const config = require('../../config');

module.exports = class Utils {
    distinctInArray(array, key) {
        let lookup = {};
        let result = [];

        for (let item, i = 0; item = array[i++];) {
            let seccion = item[key];

            if (!(seccion in lookup)) {
                lookup[seccion] = 1;
                result.push(item);
            }
        }

        return result;
    }

    selectInArray(array, key, value) {
        let result = [];

        for (const i in array) {
            const element = array[i];
            if (element[key] === value) result.push(element);
        }

        return result;
    }

    /**
     * Devuel el texto convertido a UTF8
     * @param {string} str - Texto códificado
     */
    decodeText(str) {
        return str.replace(/&#(\d+);/g, function (match, dec) {
            return String.fromCharCode(dec);
        });
    }

    urlImage(nombre, paisISO, tipoOrigen, campania, marcaId) {

        let urlSB = config.constantes.urlImagenesSB,
            urlAPP = config.constantes.urlImagenesAppCatalogo,
            matriz = config.constantes.Matriz + "/",
            origen = parseInt(tipoOrigen);

        if (nombre === undefined || nombre === null) return "no_tiene_imagen.jpg";
        if (!nombre.length) return "no_tiene_imagen.jpg";

        if (nombre.startsWith("http")) {
            return nombre;
        }
        if (nombre.startsWith("https")) {
            return nombre;
        }

        if (origen === 1) {
            return urlSB + matriz + paisISO + "/" + nombre;
        }

        if (origen === 2) {
            let marcas = ["L", "E", "C"];

            let splited = nombre.split("|");

            if (splited.length > 1) {
                return urlAPP + splited[0] + "/" + splited[1] + "/" + marcas[marcaId - 1] + "/productos/" + splited[2];
            }

            return urlAPP + paisISO + "/" + campania + "/" + marcas[marcaId - 1] + "/productos/" + nombre;
        }
    }
};