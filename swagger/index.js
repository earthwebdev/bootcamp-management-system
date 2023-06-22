import swaggerJsdoc from  'swagger-jsdoc';

const options = {
  failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
  validatorUrl: null,
  customCss: '.swagger-ui .topbar { display: none }',
  explorer: true,
  definition: {
    openapi: '3.0.0',
    servers: [{
        url: `${process.env.SERVER_URL}/api/v1`
      }/* ,
      {
        url: `${process.env.SERVER_URL}/api/v2`
      } */
    ],
    info: {
      title: 'Bootcamp Management System Api',
      version: '1.0.1',
      description: 'Swagger 1.0.1 documentation for the Bootcamp Management System REST API. ',
    },
 /*  host: `${process.env.SERVER_URL}/api`,
  basePath: '/v1', */
  components: {
    securitySchemes: {
        bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
        }
    } 
  },
  security:[
    {
        bearerAuth: []
    }
  ], 
 }, 
  //apis: ['./src/routes*.js'], // files containing annotations as above
  apis: ['./routes/*.js'], //'../routes/*.route.js'
};

export default swaggerJsdoc(options);