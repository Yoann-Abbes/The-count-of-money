const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Money API',
            description: 'Money API for crypto money',
            contact: {
                name: "Money API"
            },
            servers: ["http://" + process.env.DB_HOST + ":" + process.env.SERVER_PORT]
        }
    },
    apis: ['./routes/index.js', './routes/user.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}