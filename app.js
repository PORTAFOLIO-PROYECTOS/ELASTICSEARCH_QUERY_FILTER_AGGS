"use strict";

const config = require('./config');
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./app/routes/index');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
routes(app);

app.listen(config.puerto, () =>{
    console.log(`It's a live in http://localhost:2705`);
});