import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const authMiddleware = (req, res, next) => {
    //console.log(req.headers.authorization.startsWith('Bearer'));
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        const token = req.headers.authorization.split(' ')[1];

        const verifyUser = jwt.verify(token, config.JWT_SECRET_KEY);
        //console.log(verifyUser.id);
        if(verifyUser){
            req.user = verifyUser;
            next();
        }else{
            res.status(401).json({
                status:false,
                message: 'Unauthorised user'
            });
        }

    }else{
        res.status(401).json({
            status:false,
            message: 'Unauthorised user'
        });
    }
}
