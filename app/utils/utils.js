"use strict";

module.exports = class Utils {
    distinctInArray(array) {
        let lookup = {};
        let result = [];

        for (let item, i = 0; item = array[i++];) {
            let seccion = item.FiltroSeccion;

            if (!(seccion in lookup)) {
                lookup[seccion] = 1;
                result.push(item);
            }
        }

        return result;
    }
};