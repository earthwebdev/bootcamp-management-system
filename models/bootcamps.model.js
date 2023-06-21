import mongoose from 'mongoose'
import {validataionMessage} from '../constants/validataionMessage.js'
const bootcampSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, validataionMessage.BOOTCAMP_NAME_REQUIRED_MESSAGE ],
        unique: true,
        trim: true,
        minLength:[5, validataionMessage.MIN_LENGTH_MESSAGE]
    },
    slug: String,
    description: {
        type: String,
        required: [true, validataionMessage.REQUIRED_DESCRIPTION_MESSAGE],
        maxLength: [500, validataionMessage.MAXLENGTH_MESSAGE],
    },
    website:{
        type: String,
        match:[/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g, 'Please use a valid url for your website.']
    },
    phone:{
        type: Number,
        //max:[20, validataionMessage.MAXLENGTH_PHONE_MESSAGE]
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
            'w',
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
    photo_public_id:{
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
const Bootcamp = mongoose.model('Bootcamp', bootcampSchema);

export default Bootcamp;