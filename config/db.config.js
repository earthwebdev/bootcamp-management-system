import mongoose from 'mongoose'
import config from './config.js';

const MONGO_URI = config.MONGO_URI;
//console.log(MONGO_URI);

// Connect MongoDB at default port 27017.
export const dbconnection = async () => {
    const connect = await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
    })
    console.log('Mongodb connected', connect.connection.host);
}
