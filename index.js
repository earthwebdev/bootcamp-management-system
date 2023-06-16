import express from 'express';

import indexRouter from './routes/index.route.js';
import config from './config/config.js';
import { dbconnection } from './config/db.config.js';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';

dbconnection();




const app = express();

//json data error setting
// parse application/json
app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

// To remove data using these defaults: //for the express mongo sanitize 
app.use(mongoSanitize());
app.use(morgan('combined'))
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
