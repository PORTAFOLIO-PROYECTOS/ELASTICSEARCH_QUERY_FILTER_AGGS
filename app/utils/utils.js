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
            if(element[key] === value) result.push(element);
        }

        return result;
    }
};