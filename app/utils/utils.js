"use strict";

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
};