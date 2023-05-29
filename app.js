var express = require('express');
const http  = require('http')
const bodyParser = require('body-parser')

const router = require('./cognito_Router')

// const app = express()
var app = express();
const server = http.createServer(app)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use('/auth', router)
app.get('/', (req, res) => res.send('Hello Wfrom nodejs        authentication server'));
module.exports = app;