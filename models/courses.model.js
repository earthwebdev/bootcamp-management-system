import mongoose from "mongoose";
import {validataionMessage} from '../constants/validataionMessage.js'
const courseSchema = mongoose.Schema({
    title:{
        type: String,
        trim: true,
        required: [true, validataionMessage.REQUIRED_TITLE_MESSAGE]
    },
    description:{
        type: String,
        trim: true,
        required: [true, validataionMessage.REQUIRED_DESCRIPTION_MESSAGE]
    },
    duration:{
        type: String,
        required: [true, validataionMessage.REQUIRED_DURATION_MESSAGE]
    },
    minimumSkill:{
        type: String,
        required: [true, validataionMessage.REQUIRED_MINIMUMSKILL_MESSAGE],
        enum: ['fresher','junior','beginner', 'intermediate', 'advanced']
    },
    content:{
        type: [String],
        required: [true, validataionMessage.REQUIRED_CONTENT_MESSAGE],
        
    },
    scholarshipAvailable:{
        type:Boolean,
        default:false
    },
    bootcamp:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bootcamp',
        required: [true, validataionMessage.REQUIRED_BOOTCAMP_ID_MESSAGE],
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, validataionMessage.REQUIRED_USER_ID_MESSAGE],
    }

},
{
    timestamps: true,
})

const Course = mongoose.model('Course', courseSchema);

export default Course;