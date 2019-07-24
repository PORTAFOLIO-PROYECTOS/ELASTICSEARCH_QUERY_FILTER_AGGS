"use strict";

module.exports = {
    puerto: 2705,
    pais: 'PE',
    campania: '201912',
    elasticsearch: {
        host: 'https://vpc-es-sbsearch-ppr-rnioiss6o347c74q4w2u7w2uhu.us-east-1.es.amazonaws.com',
        index: 'producto_v2',
        type: '_doc',
    },
    sql: {
        CL: 'Server=AWNTS74; Initial Catalog=BelcorpChile_GANAMAS; User ID=sa; Password=C0n$ult0r@$;',
        CO: 'Server=AWNTS74; Initial Catalog=BelcorpColombia_GANAMAS; User ID=sa; Password=C0n$ult0r@$;',
        CR: 'Server=AWNTS74; Initial Catalog=BelcorpCostaRica_GANAMAS; User ID=sa; Password=C0n$ult0r@$;',
        PE: 'Server=AWNTS74; Initial Catalog=BelcorpPeru_GANAMAS; User ID=sa; Password=C0n$ult0r@$;',
    }
}