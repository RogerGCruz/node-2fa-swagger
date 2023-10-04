const swaggerAutogen = require('swagger-autogen')()

const outputFile = './documentation/swagger_output.json'
const endpointsFiles = ['./endpoints.js']

const doc = {
    info: {
        version: "1.0.0",
        title: "Xgrow Backend Developer",
        description: "API Documentation."
    },
    host: "localhost:9000",
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            "name": "2FA",
            "description": "Endpoints"
        }
    ],
    definitions: {
        token: {
            email: "teste@teste.com.br"
        },
        login: {
            token: "123456",
            secret: "IFMZMJ3PBHFIVZ35PKRXRHROWKIF5K6F"
            
        }
    }
}

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./server.js')
})