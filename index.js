const app = require('./app')
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const swaggerJsDoc = require("swagger-jsdoc");

const port = process.env.PORT

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})