"use strict";

const filtrosRoute = require('./filtros');

module.exports = (express)=>{
    express.use('/filtros', filtrosRoute)
};