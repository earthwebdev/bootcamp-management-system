import User from "../models/users.model.js";
import config from "../config/config.js";
//import pkg from 'jsonwebtoken';
//const { Jwt } = pkg;

import jwt from 'jsonwebtoken'
export const registerUser =  async(req, res) => {    
    try {
        const {name, email, password} = req.body;
        if(!name || !email ||  !password) {
            res.status(400).json({
                status:false,
                message: 'Please enter name, email and password'
            });
        }
            
        //const user = User.findOne({email: email});
        const user = await User.find({ email: email });
        console.log(user);
        if(user.length > 0){
            res.status(400).json({
                status:false,
                message: 'The user has already registered.'
            });
        }
        else{
            const user = new User(req.body);        
            await user.save();
            res.status(200).json({
                status:true,
                data: user,
                message: 'User successfully registered',
            });
        }  
    } catch (error) {
        res.status(400).json({
            status:false,
            message: error.message
        });
    }
}

export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email ||  !password) {
            res.status(400).json({
                status:false,
                message: 'Please enter email and password'
            });
        }
            
        //const user = User.findOne({email: email});
        const user = await User.findOne({ email: email });
        //console.log(user);
        if(user){
            const matchPasswd = await user.validPassword(password);
            //console.log(matchPasswd);
            if(matchPasswd){
                const token = jwt.sign({id: user._id}, config.JWT_SECRET_KEY, {expiresIn:'1d'});
                const updatedUser = await User.findOneAndUpdate({_id: user._id}, {$set:{jwt_token: token}}, {new: true});
                
                res.status(200).json({
                    status:true,
                    token: token,
                    message: 'User successfully registered',
                });
            }
            else{
                res.status(400).json({
                    status:false,
                    message: 'Please enter the correct email and password.'
                });
            }
            
        }
        else{
            res.status(400).json({
                status:false,
                message: 'Please enter the correct email and password.'
            });
                                         
        }  
    } catch (error) {
        res.status(400).json({
            status:false,
            message: error.message
        });
    }
}