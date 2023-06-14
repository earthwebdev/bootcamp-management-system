import mongoose from "mongoose";
import {validataionMessage} from '../constants/validataionMessage.js'
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

const User = mongoose.model('User', usersSchema);

export default User;