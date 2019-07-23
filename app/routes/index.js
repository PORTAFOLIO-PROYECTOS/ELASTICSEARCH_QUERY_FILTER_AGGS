"use strict";

const sqlRoute = require('./sql');
const filtrosRoute = require('./filtros');

module.exports = (express)=>{
    express.use('sql', sqlRoute);
    express.use('filtros', filtrosRoute)
};