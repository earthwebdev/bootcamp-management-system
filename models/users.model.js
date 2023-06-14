import mongoose from "mongoose";
import {validataionMessage} from '../constants/validataionMessage.js';
import bcrypt from 'bcrypt'


const usersSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true, validataionMessage.REQUIRED_NAME_MESSAGE],
    },
    email:{
        type: String,
        required: [true, validataionMessage.REQUIRED_EMAIL_MESSAGE],
        unique: true,
        match: [/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, validataionMessage.VALIDATE_EMAIL_MESSAGE],
    },
    role:{
        type: String,
        default: 'user',
        enum:['user', 'publisher']
    },
    password:{
        type: String,
        required:[true, validataionMessage.REQUIRED_PASSWORD_MESSAGE],
        match: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
            validataionMessage.MATCH_PASSWORD_MESSAGE
        ]
    },
    jwt_token: String,
    resetPassword: String,
    resetPasswordExpired: {
        type: Date,
    },
    passwordExpire: {
        type: Date,
    }
},
{
    timestamps: true,
})

usersSchema.methods.validPassword = async function(pwd){
    return await bcrypt.compare(pwd, this.password);
}

usersSchema.pre('save', async function (next) {    
    const password = this.password;
    //console.log(this.password);
    //console.log(password);
    //generate salt
    const genSalt = await bcrypt.genSalt(10);
    const encryptPassword = await bcrypt.hash(password.toString(), genSalt);
    //console.log(encryptPassword); 
    this.password = encryptPassword;
    //req.body.password = encryptPassword;
    next();
})

const User = mongoose.model('User', usersSchema);

export default User;