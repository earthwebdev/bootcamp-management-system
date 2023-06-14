import mongoose from 'mongoose'
import {validataionMessage} from '../constants/validataionMessage.js'
const bootcampsSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, validataionMessage.BOOTCAMP_NAME_REQUIRED_MESSAGE ],
        unique: true,
        trim: true,
        minLength:[5, validataionMessage.MIN_LENGTH_MESSAGE]
    },
    slug: String,
    descrition: {
        type: String,
        required: [true, validataionMessage.REQUIRED_DESCRIPTION_MESSAGE],
        maxLength: [true, validataionMessage.MAXLENGTH_MESSAGE],
    },
    website:{
        type: String,
        match:[/^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g, 'Please use a valid url for your website.']
    },
    phone:{
        type: Number,
        max:[20, validataionMessage.MAXLENGTH_PHONE_MESSAGE]
    },
    email:{
        type: String,
        required: [true, validataionMessage.REQUIRED_EMAIL_MESSAGE],
        unique: true,
        match: [/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, validataionMessage.VALIDATE_EMAIL_MESSAGE],
    },
    address:{
        type: String,
        required: [true, validataionMessage.ADDRESS_REQUIRED_MESSAGE],
    },
    careers:{
        // array of string
        type: [String],
        required: true,
        enum:[
            'web development',
            'mobile development',
            'UI/UX',
            'Data Science',
            'Artificial Inteligense',
            'Others'
        ]
    },
    averageRating:
    {
        type: Number,
        min: [1, validataionMessage.MINLENGTH_MESSAGE],
        max: [10, validataionMessage.MAXLENGTH_MESSAGE]
    },
    averageCost:{
        type: Number,
        required: true,
    },
    photo:{
        type: String,        
    },
    jobGuarante:{
        type: Boolean,
        default: false,
    },
    jobAssitance:{
        type: Boolean,
        default: false,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
},
{
    timestamps: true,
})
const Bootcamp = mongoose.model('Bootcamp', bootcampsSchema);

export default Bootcamp;