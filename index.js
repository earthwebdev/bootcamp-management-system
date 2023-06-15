import express from 'express';

import indexRouter from './routes/index.route.js';
import config from './config/config.js';
import { dbconnection } from './config/db.config.js';
import mongoSanitize from 'express-mongo-sanitize';
import winston from 'winston';
import { createLogger, format, transports } from 'winston';

dbconnection();




const app = express();

//json data error setting
// parse application/json
app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

// To remove data using these defaults: //for the express mongo sanitize 
app.use(mongoSanitize());

const PORT = config.PORT || 8080;
const NODE_ENV = config.NODE_ENV;

app.use('/api/v1', indexRouter);

//Error Handling for unmatched routes
app.use((req, res, next) => {
    const error = new Error("Page not found");
    error.status = 404;
    next(error);
})
//Error hadnler middleware
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        status: false,
        error: error.message,
    })
})

app.listen(PORT, () => {
    console.log(`Server running in ${NODE_ENV} at port ${PORT}`)
})
/* const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      //
      // - Write all logs with importance level of `error` or less to `error.log`
      // - Write all logs with importance level of `info` or less to `combined.log`
      //
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
  });

  const options = {
    from: new Date() - (24 * 60 * 60 * 1000),
    until: new Date(),
    limit: 10,
    start: 0,
    order: 'desc',
    fields: ['message']
  };
  
  //
  // Find items logged between today and yesterday.
  //
  logger.query(options, function (err, results) {
    if (err) {
      /* TODO: handle me ////
      throw err;
    }
  
    console.log(results);
  });
if (NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.combine(
          format.colorize(),
          format.simple()
        )
      }));
  } */