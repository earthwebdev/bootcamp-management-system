import User from "../models/users.model.js";
import config from "../config/config.js";
//import pkg from 'jsonwebtoken';
//const { Jwt } = pkg;

import jwt from 'jsonwebtoken'
import { sendEmail } from "../utils/sendEmail.js";
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
        const user = await User.findOne({ email });
        console.log(user);
        if(user){
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
//profile page personal
export const userProfileMe = async (req, res) => {
    try {
        //console.log(req.user.id);
        const user = await User.findOne({_id: req.user.id});
        //console.log(user.jwt_token);
        if(user){            
            res.status(200).json({
                status:true, 
                data: user,      
                message: 'User profile fetch successfully',
            });
        } else {
            res.status(200).json({
                status:false,        
                message: 'No user found',
            });
        }
    } catch (error) {
        res.status(400).json({
            status:false,
            message: error.message
        });
    }
}
//logout user
export const logoutUser = async (req, res) => {
    try {
        //console.log(req.user.id);
        const user = await User.findOne({_id: req.user.id});
        //console.log(user.jwt_token);
        if(user && user.jwt_token   !== "undefined"){
            const updateUserLogout = await User.findOneAndUpdate({_id: req.user.id}, {$set:{jwt_token: "undefined"}}, {new: true});
            res.status(200).json({
                status:true,        
                message: 'User successfully logout',
            });
        } else {
            res.status(200).json({
                status:false,        
                message: 'User has already logout',
            });
        }
    } catch (error) {
        res.status(400).json({
            status:false,
            message: error.message
        });
    }
}

export const forgetPassword = async(req, res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email: email});
        if(!user){
            res.status(400).json({
                status:false,
                message: 'No user found'
            });
        }

        const resetToken = user.getResetToken();
        //console.log(resetToken);
        const mailMessage = 'your are using. Your reset token is '+ resetToken;
        await sendEmail({
            //email: user.email,
            from: "Mailtrap <info@mailtrap.io>", // sender address
            to: "earthweb21st@gmail.com", // list of receivers with comma separators
            subject: 'Password reset token',
            html: mailMessage, 
        } );    
        
    } catch (error) {
        res.status(400).json({
            status:false,
            message: error.message
        });
    }
}