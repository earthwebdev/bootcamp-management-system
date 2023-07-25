import express from "express";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger/index.js';

const router = express.Router();
var options = {
    customCssUrl: [      
      'https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui.css'
    ]
  };
router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument, options));

export default router;