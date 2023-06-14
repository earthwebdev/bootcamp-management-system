import express from 'express';
import indexRouter from './routes/index.route.js';
import config from './config/config.js';
import { dbconnection } from './config/db.config.js';

dbconnection();

//json data error setting


const app = express();

// parse application/json
app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

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