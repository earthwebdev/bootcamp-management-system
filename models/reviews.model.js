import mongoose from "mongoose";
import { validataionMessage } from "../constants/validataionMessage.js";

const reviewSchema = mongoose.Schema({
    title:{
        type: String,
        trim: true,
        required: [true, validataionMessage.REQUIRED_REVIEW_NAME_MESSAGE],
        maxLength: 100
    },
    description:{
        type: String,
        trim: true,
        required: [true, validataionMessage.REQUIRED_REVIEW_DESCRIPTION_MESSAGE],
        maxLength: 500,
    },
    rating:
    {
        type: Number,
        min: [1, validataionMessage.MINLENGTH_MESSAGE],
        max: [10, validataionMessage.MAXLENGTH_MESSAGE],
        required: [true, validataionMessage.REQUIRED_RATING_MESSAGE],
    },
    bootcamp:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bootcamp'//,
        ///required: [true, validataionMessage.REQUIRED_BOOTCAMP_ID_MESSAGE],
    },
    course:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, validataionMessage.REQUIRED_USER_ID_MESSAGE],
    }
},
{
    timestamps: true
})

const Review = mongoose.model('Review', reviewSchema);

export default Review;