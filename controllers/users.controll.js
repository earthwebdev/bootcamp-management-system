import User from "../models/users.model.js";
import config from "../config/config.js";
//import pkg from 'jsonwebtoken';
//const { Jwt } = pkg;

import jwt from 'jsonwebtoken'
import { sendEmail } from "../utils/sendEmail.js";
import crypto from 'crypto';

import bcrypt from 'bcrypt';

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
                                //.select('name email  resetPasswordToken resetPasswordExpired');
        //console.log(user);return;
        if(!user){
            res.status(400).json({
                status:false,
                message: 'No user found'
            });
        }

        const resetToken = user.getResetToken();
        console.log(resetToken);
        const mailMessage = 'your are using. Your reset token is '+ resetToken + '<br> your token will expire in ten minutes.';
        //console.log(user);
        try {
             await sendEmail({
                //email: user.email,
                //from: "Mailtrap <info@bootcamp.com>", // sender address
                email: user.email, // list of receivers with comma separators
                subject: 'Password reset token',
                message: mailMessage, 
            } ); 
            
            
            await user.save({validateBeforeSave: false});
            
        } catch (error) {
            user.resetPasswordToken = '';
            user.resetPasswordExpired = '';
            await user.save({validateBeforeSave: false});
            res.status(400).json({
                status:false,
                message: error.message,
            });
        }
        return  res.status(200).json({
            status:true,
            message: 'Email sent successfully.'
        });
           
        
    } catch (error) {
        res.status(400).json({
            status:false,
            message: error.message
        });
    }
}

export const resetPassword = async (req, res) => {
    try {
        //console.log(req.params)
        const  resetToken = req.params.resettoken;
        //hashed password
        const hashToken = crypto.createHash('sha512').update(resetToken).digest('hex');
        //console.log(hashToken)
        const user = await User.findOne({resetPasswordToken: hashToken, resetPasswordExpired: { $gte: new Date() }}); 
        
        if(!user){
            res.status(400).json({
                status:false,
                message: 'Invalid password token / password expired'
            });
        }
        
        const hashPass = await hashPassword(req.body.password);
        const data = {
            password: hashPass,
            resetPasswordToken: '',
            resetPasswordExpired: '', 
        };
        await User.findOneAndUpdate({_id: user._id}, {$set: data},
            {
                new: true,
            }
        );
        
        res.status(200).json({
            status: true,
            message: 'Password reset successfully',
        });
    } catch (error) {        
        res.status(200).json({
            status: false,
            message: error.message,
        });
    }
}

 const hashPassword = async (passwd) => {    
    //generate salt
    const genSalt = await bcrypt.genSalt(10);
    const encryptPassword = await bcrypt.hash(passwd.toString(), genSalt); 
    return encryptPassword;
}

//crud operation for the admin role user

export const usersListsForAdmin = async (req, res) => {

}

export const CreateUserByAdmin = async (req, res) => {
    
}

export const updateUserByAdmin = async (req, res) => {
    
}

export const deleteUserByAdmin = async (req, res) => {
    
}