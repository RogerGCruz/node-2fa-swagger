const express       = require('express')()
const http          = require('http')
const swaggerUi     = require('swagger-ui-express')
const swaggerFile   = require('./documentation/swagger_output.json')
const port          = 9000;
const path = require('path');

// Server start
http.createServer(express).listen(port, () => {
    console.log(`Server running on ${port}`);
})

// Swagger documentation
express.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile))

// API endpoints
require('./endpoints')(express)

// Html
express.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/view/index.html'));
});

// Unknown error
express.use((err, req, res, next) => {
    console.log(err.log);
    res.status(500).send("General Error");
});
