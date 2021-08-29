const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const app = require('./app');
const swaggerDocument = require('./swagger.json');

const port = process.env.PORT;

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
