"use strict";

const config = require('./config');
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./app/routes/index');

const app = express();
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/app/public`));
routes(app);

app.listen(config.puerto, () =>{
    console.log(`It's a live in http://localhost:2705`);
});