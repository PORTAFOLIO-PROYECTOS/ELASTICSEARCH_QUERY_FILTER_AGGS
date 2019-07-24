"use strict";

const filtrosClass = require('../services/filtros');
const request = require('../models/filtros/request');

exports.obtener = async (req, res, next) => {
    try {
        
        let model = new request(req).json();
        let filtros = new filtrosClass(model);
        let data = await filtros.obtenerDatos();
        res.json(data);
        next();
        /*let datos = new sql('PE');
        await datos.listaFiltros().then(data => {
            console.log('entro a consulta');
            res.json(data);
            next();
        }).catch(error => {
            console.log(error);
            next();
        });*/
        
    } catch (error) {
        res.json(error);
        console.error(error);
        next();
    }

};