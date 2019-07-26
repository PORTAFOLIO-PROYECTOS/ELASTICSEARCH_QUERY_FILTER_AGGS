"use strict";

module.exports = {
    puerto: 2705,
    pais: 'PE',
    campania: '201912',
    elasticsearch: {
        host: 'https://vpc-es-sbsearch-qa-6lqloaf2kfljixcaekbyqxu2aa.us-east-1.es.amazonaws.com',
        index: 'producto_v2',
        type: '_doc',
        query:{
            multiMatch: ["textoBusqueda^20","textoBusqueda.synonym^15","textoBusqueda.ngram^12","textoBusqueda.phonetic^10","cuv","marcas^8","marcas.synonym^6","marcas.phonetic^4","marcas.ngram","categorias^8","categorias.synonym^6","categorias.phonetic^4","categorias.ngram","lineas^8","lineas.synonym^6","lineas.phonetic^2","lineas.ngram","grupoArticulos^8","grupoArticulos.synonym^8","grupoArticulos.phonetic^6","grupoArticulos.ngram","seccion1^8","seccion1.synonym^6","seccion1.phonetic^4","seccion1.ngram"]
        }
    },
    sql: {
        CL: 'Server=AWNTS74; Initial Catalog=BelcorpChile_GANAMAS; User ID=sa; Password=C0n$ult0r@$;',
        CO: 'Server=AWNTS74; Initial Catalog=BelcorpColombia_GANAMAS; User ID=sa; Password=C0n$ult0r@$;',
        CR: 'Server=AWNTS74; Initial Catalog=BelcorpCostaRica_GANAMAS; User ID=sa; Password=C0n$ult0r@$;',
        PE: 'Server=AWNTS74; Initial Catalog=BelcorpPeru_GANAMAS; User ID=sa; Password=C0n$ult0r@$;',
    }
}